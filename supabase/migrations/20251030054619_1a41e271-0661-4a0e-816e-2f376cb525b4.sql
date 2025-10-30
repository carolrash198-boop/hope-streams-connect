-- Create service schedules table
CREATE TABLE public.service_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  time TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  audience TEXT,
  duration TEXT,
  style TEXT,
  location TEXT DEFAULT 'Main Sanctuary',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create what to expect items table
CREATE TABLE public.service_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  icon_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create kids programs table  
CREATE TABLE public.kids_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  age_group TEXT NOT NULL,
  ages TEXT NOT NULL,
  description TEXT NOT NULL,
  service_time TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sunday school teachers table
CREATE TABLE public.sunday_school_teachers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  experience TEXT,
  background TEXT,
  bio TEXT,
  photo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create curriculum items table
CREATE TABLE public.curriculum_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quarter TEXT NOT NULL,
  theme TEXT NOT NULL,
  focus TEXT NOT NULL,
  key_verses TEXT[],
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.service_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kids_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sunday_school_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for service_schedules
CREATE POLICY "Public can view active schedules" ON public.service_schedules FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can insert schedules" ON public.service_schedules FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update schedules" ON public.service_schedules FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete schedules" ON public.service_schedules FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for service_features
CREATE POLICY "Public can view active features" ON public.service_features FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can insert features" ON public.service_features FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update features" ON public.service_features FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete features" ON public.service_features FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for kids_programs
CREATE POLICY "Public can view active programs" ON public.kids_programs FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can insert programs" ON public.kids_programs FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update programs" ON public.kids_programs FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete programs" ON public.kids_programs FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for sunday_school_teachers
CREATE POLICY "Public can view active teachers" ON public.sunday_school_teachers FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can insert teachers" ON public.sunday_school_teachers FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update teachers" ON public.sunday_school_teachers FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete teachers" ON public.sunday_school_teachers FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for curriculum_items
CREATE POLICY "Public can view active curriculum" ON public.curriculum_items FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can insert curriculum" ON public.curriculum_items FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update curriculum" ON public.curriculum_items FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete curriculum" ON public.curriculum_items FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Create triggers for updated_at
CREATE TRIGGER update_service_schedules_updated_at BEFORE UPDATE ON public.service_schedules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_service_features_updated_at BEFORE UPDATE ON public.service_features FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_kids_programs_updated_at BEFORE UPDATE ON public.kids_programs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sunday_school_teachers_updated_at BEFORE UPDATE ON public.sunday_school_teachers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_curriculum_items_updated_at BEFORE UPDATE ON public.curriculum_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();