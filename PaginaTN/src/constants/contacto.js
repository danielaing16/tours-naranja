/** WhatsApp / teléfono Tours Naranja — +57 302 2266184 */
export const WHATSAPP_NUMBER = '573022266184';
export const PHONE_DISPLAY = '+57 302 2266184';

export function whatsappUrl(text = '') {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}
