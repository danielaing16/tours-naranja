import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const url = (process.env.SUPABASE_URL || '').trim().replace(/\/$/, '');
const key = (process.env.SUPABASE_SERVICE_KEY || '').trim().replace(/^["']|["']$/g, '');

if (!url || !key) {
  throw new Error('Faltan SUPABASE_URL o SUPABASE_SERVICE_KEY en backend/.env');
}

if (!url.startsWith('https://')) {
  throw new Error('SUPABASE_URL debe empezar con https:// (ej: https://ogjocklzcgpckpngccdf.supabase.co)');
}

export const supabase = createClient(url, key);
