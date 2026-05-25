import { paquetes as mockPaquetes } from '../data/mockData';
import { fetchJson } from '../lib/fetchJson';

/** Solo en desarrollo local: datos de prueba si el backend no responde. */
const USE_MOCK_FALLBACK = import.meta.env.DEV;

export async function fetchPaquetes() {
  try {
    const data = await fetchJson('/api/paquetes');
    const lista = Array.isArray(data) ? data : [];
    if (lista.length === 0 && USE_MOCK_FALLBACK) return mockPaquetes;
    return lista;
  } catch (err) {
    if (USE_MOCK_FALLBACK) return mockPaquetes;
    throw new Error(
      err.message?.includes('backend')
        ? err.message
        : `${err.message} — Revisa VITE_API_URL en Vercel y que Render esté activo.`
    );
  }
}

export async function fetchPaqueteById(id) {
  try {
    return await fetchJson(`/api/paquetes/${id}`);
  } catch (err) {
    if (USE_MOCK_FALLBACK) {
      const found = mockPaquetes.find((p) => String(p.id) === String(id));
      if (found) return found;
    }
    throw err;
  }
}

export async function fetchPaquetesDestacados(limit = 3) {
  const lista = await fetchPaquetes();
  const destacados = lista.filter((p) => p.destacado);
  const base = destacados.length ? destacados : lista;
  return base.slice(0, limit);
}
