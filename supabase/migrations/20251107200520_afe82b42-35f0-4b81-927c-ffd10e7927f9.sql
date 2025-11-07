-- Create hero settings table
CREATE TABLE public.hero_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  heading text NOT NULL DEFAULT 'Free Pentecostal Fellowship Church of Kenya',
  tagline text NOT NULL DEFAULT 'Hope. Freedom. Community.',
  subtitle text NOT NULL DEFAULT 'We gather to worship, heal, and serve. Join us Sundays at 9:00 AM & 11:00 AM — all are welcome.',
  next_service_title text NOT NULL DEFAULT 'Next Service',
  service_name text NOT NULL DEFAULT 'Sunday Worship',
  service_time text NOT NULL DEFAULT 'This Sunday at 9:00 AM',
  service_location text NOT NULL DEFAULT 'Main Sanctuary • Baringo County, Kenya',
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hero_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view active hero settings"
  ON public.hero_settings
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can insert hero settings"
  ON public.hero_settings
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update hero settings"
  ON public.hero_settings
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete hero settings"
  ON public.hero_settings
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_hero_settings_updated_at
  BEFORE UPDATE ON public.hero_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default hero settings
INSERT INTO public.hero_settings (
  heading,
  tagline,
  subtitle,
  next_service_title,
  service_name,
  service_time,
  service_location,
  is_active
) VALUES (
  'Free Pentecostal Fellowship Church of Kenya',
  'Hope. Freedom. Community.',
  'We gather to worship, heal, and serve. Join us Sundays at 9:00 AM & 11:00 AM — all are welcome.',
  'Next Service',
  'Sunday Worship',
  'This Sunday at 9:00 AM',
  'Main Sanctuary • Baringo County, Kenya',
  true
);