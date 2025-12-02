-- Create contact_page_settings table
CREATE TABLE IF NOT EXISTS public.contact_page_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Hero Section
  hero_heading TEXT NOT NULL DEFAULT 'Contact Us',
  hero_subtitle TEXT NOT NULL DEFAULT 'We''d love to hear from you! Whether you have questions, need prayer, or want to get involved, we''re here to help.',
  
  -- Contact Information
  address_line1 TEXT NOT NULL DEFAULT '123 Faith Street',
  address_line2 TEXT NOT NULL DEFAULT 'Hope City, HC 12345',
  main_phone TEXT NOT NULL DEFAULT '(123) 456-7890',
  prayer_line_phone TEXT NOT NULL DEFAULT '(123) 456-7891',
  main_email TEXT NOT NULL DEFAULT 'info@fpfchurch.or.ke',
  pastor_email TEXT NOT NULL DEFAULT 'pastor@fpfchurch.or.ke',
  maps_url TEXT DEFAULT 'https://maps.google.com',
  
  -- Quick Stats
  response_time TEXT NOT NULL DEFAULT '24 hrs',
  days_per_week TEXT NOT NULL DEFAULT '7 days',
  pastoral_staff_count TEXT NOT NULL DEFAULT '3',
  families_served TEXT NOT NULL DEFAULT '500+',
  
  -- Service Hours (JSON array)
  service_hours JSONB NOT NULL DEFAULT '[
    {"day": "Sunday", "times": "9:00 AM & 11:00 AM", "service": "Worship Services"},
    {"day": "Wednesday", "times": "7:00 PM", "service": "Bible Study"},
    {"day": "Friday", "times": "7:00 PM", "service": "Youth Group"},
    {"day": "Saturday", "times": "10:00 AM - 2:00 PM", "service": "Food Bank"}
  ]'::jsonb,
  
  -- Office Hours (JSON array)
  office_hours JSONB NOT NULL DEFAULT '[
    {"day": "Monday - Thursday", "times": "9:00 AM - 5:00 PM"},
    {"day": "Friday", "times": "9:00 AM - 3:00 PM"},
    {"day": "Saturday", "times": "10:00 AM - 2:00 PM"},
    {"day": "Sunday", "times": "8:00 AM - 12:30 PM"}
  ]'::jsonb,
  
  -- Pastoral Staff (JSON array)
  pastoral_staff JSONB NOT NULL DEFAULT '[
    {
      "name": "Pastor Michael Johnson",
      "role": "Senior Pastor",
      "email": "pastor@fpfchurch.or.ke",
      "phone": "(123) 456-7892",
      "specialties": ["Marriage Counseling", "Spiritual Guidance", "Leadership"]
    },
    {
      "name": "Pastor Sarah Martinez",
      "role": "Associate Pastor",
      "email": "sarah@fpfchurch.or.ke",
      "phone": "(123) 456-7893",
      "specialties": ["Women''s Ministry", "Family Counseling", "Prayer Ministry"]
    },
    {
      "name": "Pastor Mark Thompson",
      "role": "Youth Pastor",
      "email": "mark@fpfchurch.or.ke",
      "phone": "(123) 456-7894",
      "specialties": ["Youth Ministry", "Young Adults", "Discipleship"]
    }
  ]'::jsonb,
  
  -- Emergency Contact Message
  emergency_contact_text TEXT NOT NULL DEFAULT 'For urgent pastoral care, call our 24/7 prayer line at',
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.contact_page_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view active contact page settings"
  ON public.contact_page_settings
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can insert contact page settings"
  ON public.contact_page_settings
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update contact page settings"
  ON public.contact_page_settings
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete contact page settings"
  ON public.contact_page_settings
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_contact_page_settings_updated_at
  BEFORE UPDATE ON public.contact_page_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default data
INSERT INTO public.contact_page_settings (
  hero_heading,
  hero_subtitle,
  address_line1,
  address_line2,
  main_phone,
  prayer_line_phone,
  main_email,
  pastor_email,
  is_active
) VALUES (
  'Contact Us',
  'We''d love to hear from you! Whether you have questions, need prayer, or want to get involved, we''re here to help.',
  '123 Faith Street',
  'Hope City, HC 12345',
  '(123) 456-7890',
  '(123) 456-7891',
  'info@fpfchurch.or.ke',
  'pastor@fpfchurch.or.ke',
  true
);