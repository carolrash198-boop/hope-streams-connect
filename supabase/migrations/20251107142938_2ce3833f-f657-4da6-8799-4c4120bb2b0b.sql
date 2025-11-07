-- Create table for live stream settings
CREATE TABLE public.live_stream_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text NOT NULL,
  service_time text NOT NULL,
  youtube_url text,
  facebook_url text,
  how_to_watch_title text NOT NULL DEFAULT 'How to Watch',
  how_to_watch_steps text[] NOT NULL DEFAULT ARRAY['Visit our website', 'Click on the "Watch Live" button', 'Enjoy the service'],
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.live_stream_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view active live stream settings"
ON public.live_stream_settings FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can insert live stream settings"
ON public.live_stream_settings FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update live stream settings"
ON public.live_stream_settings FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete live stream settings"
ON public.live_stream_settings FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_live_stream_settings_updated_at
BEFORE UPDATE ON public.live_stream_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default data
INSERT INTO public.live_stream_settings (service_name, service_time, youtube_url, facebook_url, how_to_watch_steps)
VALUES 
  ('Sunday Morning Service', 'Sundays at 10:00 AM EST', 
   'https://youtube.com/@yourchannel/live', 
   'https://facebook.com/yourpage/live',
   ARRAY[
     'Visit our website at the scheduled service time',
     'Click on either the YouTube or Facebook watch button below',
     'Join us in worship and fellowship online'
   ]),
  ('Wednesday Bible Study', 'Wednesdays at 7:00 PM EST',
   'https://youtube.com/@yourchannel/live',
   'https://facebook.com/yourpage/live',
   ARRAY[
     'Tune in at 7:00 PM EST every Wednesday',
     'Choose your preferred streaming platform',
     'Participate in our interactive Bible study'
   ]);