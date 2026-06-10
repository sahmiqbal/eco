-- Create the orders table and ensure missing order fields are available.
create extension if not exists "pgcrypto";

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  city text not null,
  address text not null,
  items jsonb not null,
  total numeric not null,
  delivery_fee numeric not null default 0,
  status text not null default 'pending',
  contact_preference text not null default 'whatsapp',
  note text,
  order_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

alter table if exists public.orders add column if not exists delivery_fee numeric not null default 0;
alter table if exists public.orders add column if not exists contact_preference text not null default 'whatsapp';
alter table if exists public.orders add column if not exists note text;
alter table if exists public.orders add column if not exists order_number text;
alter table if exists public.orders add column if not exists created_at timestamptz not null default now();
alter table if exists public.orders add column if not exists updated_at timestamptz;
