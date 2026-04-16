/*
  # Create decrement_stock RPC function

  This migration creates a PostgreSQL function that safely decrements
  product stock when an order is placed.

  ## Function: decrement_stock(items jsonb)
  - Accepts an array of order items (product_id, quantity)
  - Decrements stock for each product
  - Will not go below 0 (uses GREATEST)
  - Called from the checkout page after order creation
*/

CREATE OR REPLACE FUNCTION decrement_stock(items jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  item jsonb;
BEGIN
  FOR item IN SELECT * FROM jsonb_array_elements(items)
  LOOP
    UPDATE products
    SET stock = GREATEST(0, stock - (item->>'quantity')::int)
    WHERE id = (item->>'product_id')::uuid;
  END LOOP;
END;
$$;
