export async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let data = null;

  if (text.trim()) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        res.ok
          ? 'La respuesta del servidor no es válida. Revisa que el backend esté en marcha.'
          : `Error ${res.status}: respuesta no válida del servidor.`
      );
    }
  } else if (!res.ok) {
    throw new Error(
      `Error ${res.status}. ¿Está encendido el backend? (cd backend → npm run dev, puerto 3001)`
    );
  } else {
    data = [];
  }

  if (!res.ok) {
    throw new Error(data?.error || data?.message || `Error ${res.status}`);
  }
  if (data?.error) {
    throw new Error(data.error);
  }
  return data;
}
