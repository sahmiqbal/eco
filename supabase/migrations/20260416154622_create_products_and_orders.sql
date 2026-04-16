/*
  # Moroccan Cosmetics Ecommerce - Products & Orders Schema

  ## Overview
  Full ecommerce + CRM schema for a Moroccan cosmetic brand.

  ## Tables

  ### products
  - `id` (uuid, primary key)
  - `name` (text) - product name in French/Arabic
  - `slug` (text, unique) - URL-friendly identifier
  - `price` (numeric) - base price in MAD
  - `price_2` (numeric) - price for 2 units bundle
  - `price_3plus` (numeric) - price for 3+ units bundle
  - `image_url` (text) - product image
  - `description` (text) - product description
  - `ingredients` (text) - product ingredients
  - `category` (text) - pack or individual product
  - `stock` (integer) - available stock
  - `is_featured` (boolean) - show on homepage
  - `created_at` (timestamptz)

  ### orders
  - `id` (uuid, primary key)
  - `name` (text) - customer name
  - `phone` (text) - customer phone (Moroccan format)
  - `city` (text) - customer city
  - `address` (text) - delivery address
  - `items` (jsonb) - ordered items array
  - `total` (numeric) - total price in MAD
  - `status` (text) - pending | confirmed
  - `contact_preference` (text) - whatsapp | call
  - `call_time` (text, optional) - preferred call time
  - `note` (text, optional) - internal admin note
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on both tables
  - Products: public read, admin write
  - Orders: public insert, admin full access
  - Admin access controlled by authenticated users (Supabase Auth)
*/

-- ============================================================
-- PRODUCTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  price_2 numeric(10,2),
  price_3plus numeric(10,2),
  image_url text,
  description text DEFAULT '',
  ingredients text DEFAULT '',
  category text NOT NULL DEFAULT 'individual',
  stock integer NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public can read all products
CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated users (admin) can insert products
CREATE POLICY "Admin can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users (admin) can update products
CREATE POLICY "Admin can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users (admin) can delete products
CREATE POLICY "Admin can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- ORDERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  city text NOT NULL,
  address text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed')),
  contact_preference text NOT NULL DEFAULT 'whatsapp' CHECK (contact_preference IN ('whatsapp', 'call')),
  call_time text,
  note text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Anyone can create an order (customers don't need auth)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users (admin) can read orders
CREATE POLICY "Admin can read all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated users (admin) can update orders
CREATE POLICY "Admin can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users (admin) can delete orders
CREATE POLICY "Admin can delete orders"
  ON orders FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS products_slug_idx ON products(slug);
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS products_featured_idx ON products(is_featured);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS orders_phone_idx ON orders(phone);

-- ============================================================
-- SEED DATA: Products
-- ============================================================
INSERT INTO products (name, slug, price, price_2, price_3plus, description, ingredients, category, stock, is_featured) VALUES

-- PACKS
('Pack Hammam Aker Fassi', 'pack-aker-fassi', 299, 249, 199,
 'Notre pack signature inspiré de la tradition du hammam marocain, enrichi à l''Aker Fassi - ce précieux colorant naturel issu de fleurs de grenadier séchées. Un rituel beauté complet pour une peau lumineuse.',
 'Savon Beldi, Tebrima, Gommage Corps, Huile Capillaire, Crème Éclaircissante, Cadeau Surprise',
 'pack', 50, true),

('Pack Hammam Nila', 'pack-nila', 279, 229, 185,
 'Le pack Nila, inspiré de l''indigo naturel utilisé depuis des siècles au Maroc pour ses vertus purifiantes. Une expérience hammam authentique pour un éclat naturel.',
 'Savon Beldi, Tebrima, Gommage Corps, Huile Capillaire, Crème Éclaircissante, Cadeau Surprise',
 'pack', 40, true),

('Pack Soin Cheveux', 'pack-soin-cheveux', 259, 219, 175,
 'Le pack dédié à la beauté de vos cheveux, enrichi aux huiles précieuses du Maroc. Retrouvez des cheveux brillants, nourris et éclatants de santé.',
 'Savon Beldi, Tebrima, Gommage Corps, Huile Capillaire, Crème Éclaircissante, Cadeau Surprise',
 'pack', 35, true),

-- INDIVIDUAL PRODUCTS
('Savon Beldi', 'savon-beldi', 59, 49, 39,
 'Le savon beldi authentique, fabriqué selon la tradition marocaine. Enrichi en huile d''olive et en potasse naturelle, il nettoie en profondeur et prépare la peau à la gommage.',
 'Huile d''olive, potasse naturelle, eau de rose',
 'individual', 100, false),

('Tebrima (Kessa)', 'tebrima', 29, 24, 19,
 'Le gant de kessa marocain traditionnel, indispensable du rituel hammam. Retire les cellules mortes et révèle une peau douce et lumineuse.',
 '100% polyester spécial exfoliant',
 'individual', 200, false),

('Gommage Corps', 'gommage-corps', 69, 59, 49,
 'Notre gommage corps aux herbes naturelles du Maroc. Exfolie en douceur tout en nourrissant la peau pour un résultat lisse et éclatant.',
 'Sucre naturel, argan, herbes marocaines, huile d''amande douce',
 'individual', 80, false),

('Huile Capillaire', 'huile-capillaire', 79, 69, 55,
 'Notre huile capillaire précieuse, mélange d''huiles naturelles marocaines. Nourrit, brille et fortifie les cheveux en profondeur.',
 'Huile d''argan, huile de ricin, huile de cèdre, vitamine E',
 'individual', 90, false),

('Crème Éclaircissante', 'creme-eclaircissante', 89, 75, 65,
 'Notre crème éclaircissante naturelle aux extraits de plantes marocaines. Illumine le teint, unifie la peau et réduit les taches.',
 'Aker Fassi, eau de rose, glycérine, vitamine C naturelle',
 'individual', 75, false)

ON CONFLICT (slug) DO NOTHING;
