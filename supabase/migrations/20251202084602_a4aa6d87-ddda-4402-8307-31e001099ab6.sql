-- Add church_locations field to contact_page_settings table to store multiple church locations
ALTER TABLE public.contact_page_settings
ADD COLUMN IF NOT EXISTS church_locations jsonb DEFAULT '[]'::jsonb;