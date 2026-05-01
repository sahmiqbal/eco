-- Add support for multiple images per product
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS image_urls text[];

-- Backfill existing products from the legacy image_url column when available
UPDATE public.products
SET image_urls = ARRAY[image_url]
WHERE image_url IS NOT NULL;

-- Keep the legacy image_url column for backward compatibility
COMMENT ON COLUMN public.products.image_urls IS 'Array of image URLs for product gallery; fallback to image_url for a single image.';
