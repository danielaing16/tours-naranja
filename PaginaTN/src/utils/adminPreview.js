const RETURN_KEY = 'adminPreviewReturn';
const EDIT_KEY = 'adminPreviewEditId';
const LABEL_KEY = 'adminPreviewLabel';

export function setAdminPreviewReturn(returnTo = '', options = {}) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(RETURN_KEY, returnTo || `${window.location.pathname}${window.location.search}`);
  if (options.editId != null) {
    sessionStorage.setItem(EDIT_KEY, String(options.editId));
  } else {
    sessionStorage.removeItem(EDIT_KEY);
  }
  sessionStorage.setItem(LABEL_KEY, options.label || 'Volver al panel');
}

export function getAdminPreviewReturn() {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(RETURN_KEY);
}

export function getAdminPreviewLabel() {
  if (typeof window === 'undefined') return 'Volver al panel';
  return sessionStorage.getItem(LABEL_KEY) || 'Volver al panel';
}

export function consumeAdminPreviewEditId() {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(EDIT_KEY);
  sessionStorage.removeItem(EDIT_KEY);
  if (!raw) return null;
  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}

export function clearAdminPreview() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(RETURN_KEY);
  sessionStorage.removeItem(EDIT_KEY);
  sessionStorage.removeItem(LABEL_KEY);
}

export function isAdminPreviewSession() {
  return Boolean(getAdminPreviewReturn());
}
