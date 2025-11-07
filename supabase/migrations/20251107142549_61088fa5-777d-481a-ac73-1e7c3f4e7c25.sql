-- Create storage bucket for sermon media files
INSERT INTO storage.buckets (id, name, public)
VALUES ('sermon-media', 'sermon-media', true);

-- Create RLS policies for sermon-media bucket
CREATE POLICY "Public can view sermon media files"
ON storage.objects FOR SELECT
USING (bucket_id = 'sermon-media');

CREATE POLICY "Admins can upload sermon media files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'sermon-media' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update sermon media files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'sermon-media' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete sermon media files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'sermon-media' 
  AND has_role(auth.uid(), 'admin'::app_role)
);