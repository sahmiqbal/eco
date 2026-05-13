# Image Upload Setup

To enable image uploads for products, you need to set up the Supabase storage bucket:

## Option 1: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to Storage
3. Create a new bucket called `product-images`
4. Make it public
5. Add the following policies:

### Upload Policy (INSERT)
```sql
-- Allow public users to upload product images
CREATE POLICY "Users can upload product images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images');
```

### Update Policy (UPDATE)
```sql
-- Allow public users to update their own product images
CREATE POLICY "Users can update their own product images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'product-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### Delete Policy (DELETE)
```sql
-- Allow public users to delete their own product images
CREATE POLICY "Users can delete their own product images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### View Policy (SELECT)
```sql
-- Allow public access to view images
CREATE POLICY "Public can view product images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');
```

## Option 2: Using Supabase CLI

If you have Supabase CLI set up and logged in:

1. **Create the bucket**:
   ```bash
   npx supabase storage create product-images --public
   ```

2. **Apply the policies via SQL** (run this in your Supabase SQL editor or via CLI):
   ```bash
   npx supabase db sql --file - << 'EOF'
   -- Upload Policy (INSERT)
   CREATE POLICY "Users can upload product images" ON storage.objects
   FOR INSERT WITH CHECK (bucket_id = 'product-images');

   -- Update Policy (UPDATE)
   CREATE POLICY "Users can update their own product images" ON storage.objects
   FOR UPDATE USING (
     bucket_id = 'product-images'
     AND auth.uid()::text = (storage.foldername(name))[1]
   );

   -- Delete Policy (DELETE)
   CREATE POLICY "Users can delete their own product images" ON storage.objects
   FOR DELETE USING (
     bucket_id = 'product-images'
     AND auth.uid()::text = (storage.foldername(name))[1]
   );

   -- View Policy (SELECT)
   CREATE POLICY "Public can view product images" ON storage.objects
   FOR SELECT USING (bucket_id = 'product-images');
   EOF
   ```

## Current Bucket Setup (As of Your Dashboard)

Based on your current Supabase setup, you have:
- **Bucket**: `product-images` (Public)
- **Policies**:
  - Public can view product images (SELECT, public)
  - Users can delete their own product images (DELETE, public)
  - Users can update their own product images (UPDATE, public)
  - Users can upload product images (INSERT, public)

These match the recommended policies. If you need to recreate or verify them, use the SQL below.

### SQL Commands for Your Current Policies
Run these in your Supabase SQL Editor to ensure the policies are applied:

```sql
-- View Policy (SELECT)
CREATE POLICY "Public can view product images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

-- Upload Policy (INSERT)
CREATE POLICY "Users can upload product images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images');

-- Update Policy (UPDATE)
CREATE POLICY "Users can update their own product images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'product-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Delete Policy (DELETE)
CREATE POLICY "Users can delete their own product images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## Option 3: Using SQL Commands Only

- **File Upload**: Admins can now upload image files directly instead of just entering URLs
- **Multiple Image Support**: Upload multiple product images at once
- **Before/After Images**: Upload before and after transformation images
- **All Image Formats**: Supports JPG, PNG, WebP, GIF, and other common image formats
- **Drag & Drop UI**: User-friendly file selection interface

## Usage

1. In the admin product form, you'll see new file upload sections
2. Click the upload areas to select files
3. Files are automatically uploaded to Supabase storage when saving
4. URLs are stored in the database for display