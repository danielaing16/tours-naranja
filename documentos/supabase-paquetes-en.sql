-- Columnas opcionales para textos en inglés (catálogo público EN).
-- Ejecutar en Supabase → SQL Editor si aún no existen.

ALTER TABLE paquetes
  ADD COLUMN IF NOT EXISTS nombre_en text,
  ADD COLUMN IF NOT EXISTS descripcion_corta_en text,
  ADD COLUMN IF NOT EXISTS descripcion_larga_en text,
  ADD COLUMN IF NOT EXISTS incluye_en jsonb DEFAULT '[]'::jsonb;
