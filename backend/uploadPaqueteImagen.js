import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const PAQUETES_IMG_DIR = path.join(__dirname, '..', 'PaginaTN', 'public', 'paquetes');

function safeBaseName(name) {
  return String(name || 'paquete')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'paquete';
}

export function ensurePaquetesImgDir() {
  fs.mkdirSync(PAQUETES_IMG_DIR, { recursive: true });
}

export const uploadPaqueteImagen = multer({
  storage: multer.diskStorage({
    destination(_req, _file, cb) {
      ensurePaquetesImgDir();
      cb(null, PAQUETES_IMG_DIR);
    },
    filename(_req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();
      const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
      const suffix = allowed.includes(ext) ? ext : '.jpg';
      const base = safeBaseName(path.basename(file.originalname, ext));
      cb(null, `${base}-${Date.now()}${suffix}`);
    },
  }),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const ok = /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype);
    cb(ok ? null : new Error('Solo imágenes JPG, PNG, WEBP o GIF.'), ok);
  },
});
