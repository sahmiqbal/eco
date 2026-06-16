-- Seed example rows for the `videos` table using full public URLs
-- Replace <your-supabase> with your Supabase project ref (or put real public URLs)

psql "postgresql://<user>:<password>@<host>:<port>/<db>" -f supabase/migrations/0010_seed_videos_public_urls.sql

-- Notes:
-- 1) If you have public files hosted elsewhere (CDN, public storage), you can put full URLs directly in the columns.
-- 2) After updating the URLs, apply this SQL via the Supabase SQL editor or with psql:
--    psql "postgresql://<user>:<password>@<host>:<port>/<db>" -f supabase/migrations/0010_seed_videos_public_urls.sql
