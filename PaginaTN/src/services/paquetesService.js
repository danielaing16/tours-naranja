import { paquetes as mockPaquetes } from '../data/mockData';
import { fetchJson } from '../lib/fetchJson';

/** Sustituir por API cuando el backend esté en producción. */
const USE_MOCK_FALLBACK = true;

export async function fetchPaquetes() {
  try {
    const data = await fetchJson('/api/paquetes');
    const lista = Array.isArray(data) ? data : [];
    if (lista.length === 0 && USE_MOCK_FALLBACK) return mockPaquetes;
    return lista;
  } catch (err) {
    if (!USE_MOCK_FALLBACK) throw err;
    return mockPaquetes;
  }
}

export async function fetchPaqueteById(id) {
  try {
    return await fetchJson(`/api/paquetes/${id}`);
  } catch (err) {
    if (!USE_MOCK_FALLBACK) throw err;
    const found = mockPaquetes.find((p) => String(p.id) === String(id));
    if (!found) throw new Error('Paquete no encontrado');
    return found;
  }
}

export async function fetchPaquetesDestacados(limit = 3) {
  const lista = await fetchPaquetes();
  const destacados = lista.filter((p) => p.destacado);
  const base = destacados.length ? destacados : lista;
  return base.slice(0, limit);
}
