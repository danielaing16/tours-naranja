import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { authAdmin } from './middleware/authAdmin.js';
import { blogBodyFromRequest, mapBlogRow } from './blogHelpers.js';
import { uploadPaqueteImagen, ensurePaquetesImgDir } from './uploadPaqueteImagen.js';
import { uploadGaleria, ensureGaleriaDir } from './uploadGaleria.js';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { supabase } from './supabaseClient.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_SEED_PATH = path.join(__dirname, 'data', 'blog-posts.json');
import { generarPlan, parseDiasSolicitados } from './planGenerator.js';
import {
  geminiDisponible,
  personalizarPlanConGemini,
  responderChatConFaq,
} from './geminiService.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
ensurePaquetesImgDir();
ensureGaleriaDir();

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    mensaje: 'Backend Tours Naranja funcionando',
    gemini: geminiDisponible(),
  });
});

app.get('/api/ia/status', (req, res) => {
  res.json({
    activo: geminiDisponible(),
    proveedor: 'google-gemini',
    modelo: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
  });
});

// Prueba directa Supabase
app.get('/api/supabase-test', async (req, res) => {
  try {
    const { data, error } = await supabase.from('destinos').select('id, nombre').limit(1);
    if (error) {
      return res.status(500).json({ ok: false, supabaseError: error.message, hint: error.hint });
    }
    res.json({ ok: true, muestra: data });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message,
      cause: err.cause?.message || null,
      tip: 'Revisa SUPABASE_URL y SUPABASE_SERVICE_KEY en .env (sin espacios ni comillas extra)',
    });
  }
});

app.get('/api/faq', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('faq')
      .select('id, pregunta, respuesta, orden')
      .order('orden', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: errorMessage(err) });
  }
});

app.get('/api/destinos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('destinos')
      .select('id, nombre, descripcion_corta')
      .eq('activo', true)
      .order('orden', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: errorMessage(err) });
  }
});

app.get('/api/paquetes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('paquetes')
      .select('*')
      .eq('activo', true)
      .order('id', { ascending: true });

    if (error) throw error;

    const conDestino = await attachDestinos(data);
    res.json(conDestino);
  } catch (err) {
    res.status(500).json({ error: errorMessage(err) });
  }
});

// Contacto — guardar mensaje
app.post('/api/contacto', async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;

    if (!nombre?.trim() || !email?.trim() || !mensaje?.trim()) {
      return res.status(400).json({ error: 'Nombre, correo y mensaje son obligatorios.' });
    }

    const emailLimpio = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpio)) {
      return res.status(400).json({ error: 'Correo electrónico no válido.' });
    }

    const { data, error } = await supabase
      .from('contactos')
      .insert({
        nombre: nombre.trim(),
        email: emailLimpio,
        mensaje: mensaje.trim(),
      })
      .select('id, created_at')
      .single();

    if (error) throw error;

    res.status(201).json({
      ok: true,
      mensaje: 'Mensaje recibido. Te contactaremos pronto.',
      id: data.id,
    });
  } catch (err) {
    res.status(500).json({ error: errorMessage(err) });
  }
});

// Personaliza tu experiencia — recomendación (paquete oficial o asesoría)
app.post('/api/planes/generar', async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.dias || !body.personas || body.presupuesto == null || body.presupuesto === '') {
      return res.status(400).json({
        error: 'Faltan campos obligatorios: dias, personas y presupuesto.',
      });
    }
    const diasSolicitados = parseDiasSolicitados(body.dias);
    if (diasSolicitados < 1 || diasSolicitados > 14) {
      return res.status(400).json({ error: 'Los días deben estar entre 1 y 14.' });
    }
    if (!body.ayudaElegir && (!body.destinosSeleccionados || body.destinosSeleccionados.length === 0)) {
      return res.status(400).json({
        error: 'Selecciona al menos un destino o marca "Ayúdenme a elegir".',
      });
    }
    if (!Array.isArray(body.intereses) || body.intereses.length === 0) {
      return res.status(400).json({ error: 'Marca al menos un interés.' });
    }

    const resultado = await generarPlan(supabase, body);

    if (resultado.paquete) {
      const [conDestino] = await attachDestinos([resultado.paquete]);
      resultado.paquete = conDestino;
    }

    const iaPlan = await personalizarPlanConGemini(resultado);
    if (iaPlan?.mensaje) {
      resultado.mensaje_ia = iaPlan.mensaje;
      resultado.gemini = true;
      resultado.gemini_personalizado = Boolean(iaPlan.itinerario?.length);
      if (iaPlan.itinerario?.length) {
        resultado.itinerario = iaPlan.itinerario;
        resultado.dias = iaPlan.itinerario;
      }
    }

    if (debeGuardarHistorialPlan(req.body)) {
      await guardarSolicitudPlan(resultado);
    }
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: errorMessage(err) });
  }
});

app.post('/api/ia/chat', async (req, res) => {
  try {
    const pregunta = req.body?.pregunta?.trim();
    if (!pregunta) {
      return res.status(400).json({ error: 'Falta la pregunta.' });
    }
    if (!geminiDisponible()) {
      return res.status(503).json({
        error: 'Gemini no configurado. Añade GEMINI_API_KEY en backend/.env',
        fallback: true,
      });
    }

    const { data: faq, error } = await supabase
      .from('faq')
      .select('pregunta, respuesta')
      .order('orden', { ascending: true });
    if (error) throw error;

    const respuesta = await responderChatConFaq(pregunta, faq || []);
    if (!respuesta) {
      return res.status(502).json({ error: 'No se pudo generar respuesta.', fallback: true });
    }

    res.json({ respuesta, gemini: true });
  } catch (err) {
    res.status(500).json({ error: errorMessage(err), fallback: true });
  }
});

// ========== Blog (público) ==========
app.get('/api/blog', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, titulo, slug, extracto, contenido, imagen_url, publicado, created_at')
      .eq('publicado', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json((data || []).map(mapBlogRow));
  } catch (err) {
    res.status(500).json({ error: errorMessage(err) });
  }
});

app.get('/api/blog/:slug', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, titulo, slug, extracto, contenido, imagen_url, publicado, created_at')
      .eq('slug', req.params.slug)
      .eq('publicado', true)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Artículo no encontrado.' });
    res.json(mapBlogRow(data));
  } catch (err) {
    res.status(500).json({ error: errorMessage(err) });
  }
});

app.get('/api/paquetes/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('paquetes')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    const [one] = await attachDestinos([data]);
    res.json(one);
  } catch (err) {
    res.status(500).json({ error: errorMessage(err) });
  }
});

async function attachDestinos(paquetes) {
  const { data: destinos, error } = await supabase.from('destinos').select('id, nombre');
  if (error) return paquetes;

  const map = Object.fromEntries((destinos || []).map((d) => [d.id, d]));
  return paquetes.map((p) => ({
    ...p,
    destinos: p.destino_id ? map[p.destino_id] || null : null,
  }));
}

function errorMessage(err) {
  if (err?.cause?.message) return `${err.message} — ${err.cause.message}`;
  return err?.message || String(err);
}

/** Historial opcional: no crea paquetes en catálogo, solo solicitudes. */
function debeGuardarHistorialPlan(body) {
  if (body?.guardarHistorial === false) return false;
  if (body?.guardarHistorial === true) return true;
  return process.env.GUARDAR_PLANES_SOLICITUDES === 'true';
}

/** Guarda solicitud Personaliza si existe la tabla planes_generados */
async function guardarSolicitudPlan(resultado) {
  try {
    const { error } = await supabase.from('planes_generados').insert({
      tipo: resultado.tipo,
      paquete_id: resultado.paqueteId || null,
      score: resultado.score ?? 0,
      precio_estimado: resultado.precio_estimado ?? null,
      origen_salida: resultado.origen_salida || null,
      preferencias: resultado.preferencias || {},
    });
    if (error && !/does not exist|schema cache/i.test(error.message)) {
      console.warn('[planes_generados]', error.message);
    }
  } catch (e) {
    console.warn('[planes_generados]', e.message);
  }
}

// ========== ADMIN: Login (público) ==========
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios.' });
    }

    const { data: admin, error } = await supabase
      .from('administradores')
      .select('id, email, password_hash')
      .eq('email', email.trim().toLowerCase())
      .single();

    if (error || !admin) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    const passwordOk = await bcrypt.compare(password, admin.password_hash);
    if (!passwordOk) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      ok: true,
      token,
      admin: { id: admin.id, email: admin.email },
    });
  } catch (err) {
    res.status(500).json({ error: errorMessage(err) });
  }
});

app.get('/api/admin/yo', authAdmin, (req, res) => {
  res.json({ ok: true, admin: req.admin });
});

// ========== ADMIN: Galería inicio (video + 4 fotos) ==========
app.post(
  '/api/admin/upload/galeria',
  authAdmin,
  (req, res, next) => {
    uploadGaleria.single('archivo')(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.message || 'Archivo no válido.' });
      next();
    });
  },
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'Selecciona un archivo.' });
    }
    res.json({
      ok: true,
      url: `/galeria/${req.file.filename}`,
      nombre: req.file.filename,
      slot: req.body?.slot || null,
    });
  }
);

// ========== ADMIN: Subir imagen de paquete (archivo del PC) ==========
app.post(
  '/api/admin/upload/paquete-imagen',
  authAdmin,
  (req, res, next) => {
    uploadPaqueteImagen.single('imagen')(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.message || 'Archivo no válido.' });
      next();
    });
  },
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'Selecciona una imagen (.jpg, .png, .webp).' });
    }
    res.json({
      ok: true,
      url: `/paquetes/${req.file.filename}`,
      nombre: req.file.filename,
    });
  }
);

// ========== ADMIN: Paquetes (protegido) ==========
app.get('/api/admin/paquetes', authAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('paquetes').select('*').order('id', { ascending: true });
    if (error) throw error;
    const conDestino = await attachDestinos(data);
    res.json(conDestino);
  } catch (err) {
    res.status(500).json({ error: errorMessage(err) });
  }
});

app.get('/api/admin/paquetes/:id', authAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('paquetes').select('*').eq('id', req.params.id).single();
    if (error) throw error;
    const [one] = await attachDestinos([data]);
    res.json(one);
  } catch (err) {
    res.status(500).json({ error: errorMessage(err) });
  }
});

app.post('/api/admin/paquetes', authAdmin, async (req, res) => {
  try {
    const body = req.body;
    if (!body.nombre?.trim() || body.precio == null || !body.dias) {
      return res.status(400).json({ error: 'nombre, precio y dias son obligatorios.' });
    }

    const fila = {
      nombre: body.nombre.trim(),
      descripcion_corta: body.descripcion_corta || null,
      descripcion_larga: body.descripcion_larga || null,
      precio: Number(body.precio),
      dias: Number(body.dias),
      destino_id: body.destino_id ? Number(body.destino_id) : null,
      intereses: body.intereses || [],
      incluye: body.incluye || [],
      no_incluye: body.no_incluye || [],
      incluye_transporte: Boolean(body.incluye_transporte),
      apto_ninos: body.apto_ninos !== false,
      imagen_url: body.imagen_url || null,
      visible_web: body.visible_web !== false,
      activo: body.activo !== false,
      itinerario: body.itinerario || [],
    };

    const { data, error } = await supabase.from('paquetes').insert(fila).select('*').single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: errorMessage(err) });
  }
});

app.put('/api/admin/paquetes/:id', authAdmin, async (req, res) => {
  try {
    const body = { ...req.body };
    delete body.id;
    delete body.created_at;
    delete body.destinos;

    if (body.destino_id !== undefined && body.destino_id !== null && body.destino_id !== '') {
      body.destino_id = Number(body.destino_id);
    } else if (body.destino_id === '') {
      body.destino_id = null;
    }
    if (body.precio != null) body.precio = Number(body.precio);
    if (body.dias != null) body.dias = Number(body.dias);

    const { data, error } = await supabase
      .from('paquetes')
      .update(body)
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: errorMessage(err) });
  }
});

app.patch('/api/admin/paquetes/:id/desactivar', authAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('paquetes')
      .update({ activo: false, visible_web: false })
      .eq('id', req.params.id)
      .select('id, nombre, activo')
      .single();
    if (error) throw error;
    res.json({ ok: true, paquete: data });
  } catch (err) {
    res.status(500).json({ error: errorMessage(err) });
  }
});

// ========== ADMIN: Blog ==========
app.get('/api/admin/blog', authAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, titulo, slug, extracto, contenido, imagen_url, publicado, created_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json((data || []).map(mapBlogRow));
  } catch (err) {
    res.status(500).json({ error: errorMessage(err) });
  }
});

app.get('/api/admin/blog/:id', authAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, titulo, slug, extracto, contenido, imagen_url, publicado, created_at')
      .eq('id', req.params.id)
      .single();
    if (error) throw error;
    res.json(mapBlogRow(data));
  } catch (err) {
    res.status(500).json({ error: errorMessage(err) });
  }
});

app.post('/api/admin/blog', authAdmin, async (req, res) => {
  try {
    const parsed = blogBodyFromRequest(req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });

    const { data, error } = await supabase.from('blog_posts').insert(parsed.fila).select('*').single();
    if (error) {
      if (/duplicate|unique/i.test(error.message)) {
        return res.status(409).json({ error: 'Ya existe un artículo con ese slug.' });
      }
      throw error;
    }
    res.status(201).json(mapBlogRow(data));
  } catch (err) {
    res.status(500).json({ error: errorMessage(err) });
  }
});

app.put('/api/admin/blog/:id', authAdmin, async (req, res) => {
  try {
    const parsed = blogBodyFromRequest(req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });

    const { data, error } = await supabase
      .from('blog_posts')
      .update(parsed.fila)
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error) {
      if (/duplicate|unique/i.test(error.message)) {
        return res.status(409).json({ error: 'Ya existe otro artículo con ese slug.' });
      }
      throw error;
    }
    res.json(mapBlogRow(data));
  } catch (err) {
    res.status(500).json({ error: errorMessage(err) });
  }
});

app.delete('/api/admin/blog/:id', authAdmin, async (req, res) => {
  try {
    const { error } = await supabase.from('blog_posts').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: errorMessage(err) });
  }
});

/** Importa artículos desde backend/data/blog-posts.json (upsert por slug) */
app.post('/api/admin/blog/importar-json', authAdmin, async (req, res) => {
  try {
    const raw = readFileSync(BLOG_SEED_PATH, 'utf8');
    const items = JSON.parse(raw);
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'El JSON de blog no es un arreglo.' });
    }

    let insertados = 0;
    let actualizados = 0;
    const errores = [];

    for (const item of items) {
      const parsed = blogBodyFromRequest({
        ...item,
        publicado: item.publicado !== false,
      });
      if (parsed.error) {
        errores.push(`${item.slug || '?'}: ${parsed.error}`);
        continue;
      }

      const { data: existente } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', parsed.fila.slug)
        .maybeSingle();

      if (existente?.id) {
        const { error } = await supabase.from('blog_posts').update(parsed.fila).eq('id', existente.id);
        if (error) errores.push(`${parsed.fila.slug}: ${error.message}`);
        else actualizados += 1;
      } else {
        const { error } = await supabase.from('blog_posts').insert(parsed.fila);
        if (error) errores.push(`${parsed.fila.slug}: ${error.message}`);
        else insertados += 1;
      }
    }

    res.json({
      ok: true,
      insertados,
      actualizados,
      total: items.length,
      errores: errores.length ? errores : undefined,
    });
  } catch (err) {
    res.status(500).json({ error: errorMessage(err) });
  }
});

app.get('/api/admin/contactos', authAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contactos')
      .select('id, nombre, email, mensaje, created_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: errorMessage(err) });
  }
});

app.listen(PORT, () => {
  console.log(`API Tours Naranja: http://localhost:${PORT}`);
  console.log(`Supabase URL: ${(process.env.SUPABASE_URL || '').trim().slice(0, 40)}...`);
});
