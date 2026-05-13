-- Add before/after image support for products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS before_image text,
  ADD COLUMN IF NOT EXISTS after_image text;

COMMENT ON COLUMN public.products.before_image IS 'Optional image URL used for the before image in the before/after viewer.';
COMMENT ON COLUMN public.products.after_image IS 'Optional image URL used for the after image in the before/after viewer.';
