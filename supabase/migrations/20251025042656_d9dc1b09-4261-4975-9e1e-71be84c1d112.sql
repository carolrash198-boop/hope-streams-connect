-- Create sunday_school_classes table
CREATE TABLE public.sunday_school_classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age_range TEXT NOT NULL,
  time_start TIME NOT NULL,
  time_end TIME NOT NULL,
  description TEXT,
  teacher_name TEXT,
  location TEXT,
  curriculum TEXT,
  current_enrollment INTEGER DEFAULT 0,
  max_capacity INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.sunday_school_classes ENABLE ROW LEVEL SECURITY;

-- Public can view active classes
CREATE POLICY "Public can view active classes"
ON public.sunday_school_classes
FOR SELECT
USING (is_active = true);

-- Admins can do everything
CREATE POLICY "Admins can insert classes"
ON public.sunday_school_classes
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update classes"
ON public.sunday_school_classes
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete classes"
ON public.sunday_school_classes
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_sunday_school_classes_updated_at
BEFORE UPDATE ON public.sunday_school_classes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create class_visits table for tracking visit requests
CREATE TABLE public.class_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID NOT NULL REFERENCES public.sunday_school_classes(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  child_name TEXT NOT NULL,
  child_age INTEGER,
  visit_date DATE,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.class_visits ENABLE ROW LEVEL SECURITY;

-- Users can insert visit requests
CREATE POLICY "Anyone can submit visit requests"
ON public.class_visits
FOR INSERT
WITH CHECK (true);

-- Users can view their own visits
CREATE POLICY "Users can view their own visits"
ON public.class_visits
FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

-- Admins can view all visits
CREATE POLICY "Admins can view all visits"
ON public.class_visits
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update visits
CREATE POLICY "Admins can update visits"
ON public.class_visits
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete visits
CREATE POLICY "Admins can delete visits"
ON public.class_visits
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));