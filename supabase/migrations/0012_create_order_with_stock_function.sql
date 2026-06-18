-- Create a server-side function that inserts an order and decrements stock atomically.
create extension if not exists "pgcrypto";

create or replace function public.create_order_with_stock(
  customer_name text,
  customer_phone text,
  customer_city text,
  customer_address text,
  items jsonb,
  total numeric,
  contact_preference text
)
returns public.orders
language plpgsql
as $$
declare
  item record;
  product_stock integer;
  order_row public.orders%rowtype;
begin
  if items is null then
    raise exception 'Order items must be provided';
  end if;

  for item in select * from jsonb_to_recordset(items) as x(
    product_id uuid,
    product_name text,
    quantity integer,
    unit_price numeric,
    subtotal numeric
  ) loop
    select stock into product_stock
    from public.products
    where id = item.product_id
    for update;

    if product_stock is null then
      raise exception 'Product % not found', item.product_id;
    end if;

    if item.quantity > product_stock then
      raise exception 'Insufficient stock for: %', item.product_name;
    end if;
  end loop;

  insert into public.orders (
    id,
    name,
    phone,
    city,
    address,
    items,
    total,
    status,
    contact_preference,
    created_at,
    updated_at
  ) values (
    gen_random_uuid(),
    customer_name,
    customer_phone,
    customer_city,
    customer_address,
    items,
    total,
    'pending',
    contact_preference,
    now(),
    now()
  ) returning * into order_row;

  for item in select * from jsonb_to_recordset(items) as x(
    product_id uuid,
    product_name text,
    quantity integer,
    unit_price numeric,
    subtotal numeric
  ) loop
    update public.products
    set stock = stock - item.quantity
    where id = item.product_id;
  end loop;

  return order_row;
end;
$$;
