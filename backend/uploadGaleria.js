import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const GALERIA_DIR = path.join(__dirname, '..', 'PaginaTN', 'public', 'galeria');

const ALLOWED = {
  video: new Set(['.mp4', '.webm']),
  image: new Set(['.jpg', '.jpeg', '.png', '.webp']),
};

export function ensureGaleriaDir() {
  fs.mkdirSync(GALERIA_DIR, { recursive: true });
}

/** Nombres fijos para que coincidan con site.js */
const FIXED_NAMES = {
  'video-experiencias': 'experiencias.mp4',
  'poster': 'poster.jpg',
  'foto-1': '1-naturaleza-rio.jpg',
  'foto-2': '2-aventura-cordoba.jpg',
  'foto-3': '3-rutas-patrimonio.jpg',
  'foto-4': '4-sabores-cordobesos.jpg',
};

export const uploadGaleria = multer({
  storage: multer.diskStorage({
    destination(_req, _file, cb) {
      ensureGaleriaDir();
      cb(null, GALERIA_DIR);
    },
    filename(req, file, cb) {
      const slot = req.body?.slot || req.query?.slot;
      if (slot && FIXED_NAMES[slot]) {
        return cb(null, FIXED_NAMES[slot]);
      }
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `archivo-${Date.now()}${ext}`);
    },
  }),
  limits: { fileSize: 80 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const ok =
      /^video\//.test(file.mimetype) && ALLOWED.video.has(ext) ||
      /^image\//.test(file.mimetype) && ALLOWED.image.has(ext);
    cb(ok ? null : new Error('Archivo no válido (mp4/webm o jpg/png/webp).'), ok);
  },
});
