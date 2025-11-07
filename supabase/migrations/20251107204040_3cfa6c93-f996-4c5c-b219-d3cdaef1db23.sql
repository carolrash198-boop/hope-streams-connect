-- Create footer_settings table
CREATE TABLE public.footer_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  is_active BOOLEAN DEFAULT true,
  
  -- About Section
  church_name TEXT NOT NULL DEFAULT 'Free Pentecostal Fellowship',
  church_abbreviation TEXT NOT NULL DEFAULT 'FPFK',
  about_text TEXT NOT NULL DEFAULT 'Hope. Freedom. Community. We gather to worship, heal, and serve together in Christ''s love.',
  
  -- Contact Information
  address_line1 TEXT NOT NULL DEFAULT 'Baringo County',
  address_line2 TEXT NOT NULL DEFAULT 'Kenya',
  phone TEXT NOT NULL DEFAULT '(123) 456-7890',
  email TEXT NOT NULL DEFAULT 'info@fpfchurch.or.ke',
  
  -- Service Times (stored as JSON array)
  service_times JSONB NOT NULL DEFAULT '[
    {"name": "Sunday Worship", "time": "9:00 AM & 11:00 AM"},
    {"name": "Wednesday Bible Study", "time": "7:00 PM"}
  ]'::jsonb,
  
  -- Quick Links (stored as JSON array)
  quick_links JSONB NOT NULL DEFAULT '[
    {"label": "Sunday Services", "url": "/services"},
    {"label": "Bible Studies", "url": "/bible-studies"},
    {"label": "Sunday School", "url": "/sunday-school"},
    {"label": "Outreach", "url": "/outreach"}
  ]'::jsonb,
  
  -- Social Media Links
  facebook_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  
  -- Footer Bottom
  copyright_text TEXT NOT NULL DEFAULT '© 2025 Free Pentecostal Fellowship Church of Kenya. All rights reserved.',
  show_privacy_policy BOOLEAN DEFAULT true,
  show_terms_of_service BOOLEAN DEFAULT true,
  
  -- Metadata
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.footer_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view active footer settings"
  ON public.footer_settings
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can insert footer settings"
  ON public.footer_settings
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update footer settings"
  ON public.footer_settings
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete footer settings"
  ON public.footer_settings
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_footer_settings_updated_at
  BEFORE UPDATE ON public.footer_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default footer settings
INSERT INTO public.footer_settings (
  church_name,
  church_abbreviation,
  about_text,
  address_line1,
  address_line2,
  phone,
  email
) VALUES (
  'Free Pentecostal Fellowship',
  'FPFK',
  'Hope. Freedom. Community. We gather to worship, heal, and serve together in Christ''s love.',
  'Baringo County',
  'Kenya',
  '(123) 456-7890',
  'info@fpfchurch.or.ke'
);