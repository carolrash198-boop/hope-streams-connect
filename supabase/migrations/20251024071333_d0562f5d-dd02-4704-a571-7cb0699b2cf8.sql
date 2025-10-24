-- Create gallery-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-images', 'gallery-images', true);

-- Allow admins to upload images
CREATE POLICY "Admins can upload gallery images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'gallery-images' AND
  public.has_role(auth.uid(), 'admin')
);

-- Allow admins to update images
CREATE POLICY "Admins can update gallery images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'gallery-images' AND
  public.has_role(auth.uid(), 'admin')
);

-- Allow admins to delete images
CREATE POLICY "Admins can delete gallery images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'gallery-images' AND
  public.has_role(auth.uid(), 'admin')
);

-- Allow public to view gallery images
CREATE POLICY "Public can view gallery images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'gallery-images');