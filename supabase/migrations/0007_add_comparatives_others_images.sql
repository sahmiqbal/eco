-- Add support for comparative and other image groups for products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS comparatives_images text[],
  ADD COLUMN IF NOT EXISTS others_images text[];

COMMENT ON COLUMN public.products.comparatives_images IS 'Array of image URLs for comparative product section (COMPARATIVES).';
COMMENT ON COLUMN public.products.others_images IS 'Array of image URLs for the alternative product section (OTHERS).';
