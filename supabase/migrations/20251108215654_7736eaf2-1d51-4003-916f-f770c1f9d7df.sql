-- Create churches table
CREATE TABLE public.churches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  pastor_name TEXT,
  established_date DATE,
  member_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create church_members table
CREATE TABLE public.church_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  marital_status TEXT,
  address TEXT,
  occupation TEXT,
  membership_date DATE DEFAULT CURRENT_DATE,
  baptism_date DATE,
  is_active BOOLEAN DEFAULT true,
  ministry_involvement TEXT[],
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create church_resources table
CREATE TABLE public.church_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  resource_name TEXT NOT NULL,
  resource_type TEXT NOT NULL, -- 'equipment', 'facility', 'vehicle', 'other'
  description TEXT,
  quantity INTEGER DEFAULT 1,
  condition TEXT, -- 'excellent', 'good', 'fair', 'poor'
  purchase_date DATE,
  purchase_cost NUMERIC,
  current_value NUMERIC,
  location TEXT,
  assigned_to TEXT,
  maintenance_schedule TEXT,
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  is_available BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for churches
CREATE POLICY "Admins can view all churches"
  ON public.churches FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert churches"
  ON public.churches FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update churches"
  ON public.churches FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete churches"
  ON public.churches FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for church_members
CREATE POLICY "Admins can view all church members"
  ON public.church_members FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert church members"
  ON public.church_members FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update church members"
  ON public.church_members FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete church members"
  ON public.church_members FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for church_resources
CREATE POLICY "Admins can view all church resources"
  ON public.church_resources FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert church resources"
  ON public.church_resources FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update church resources"
  ON public.church_resources FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete church resources"
  ON public.church_resources FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for updated_at
CREATE TRIGGER update_churches_updated_at
  BEFORE UPDATE ON public.churches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_church_members_updated_at
  BEFORE UPDATE ON public.church_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_church_resources_updated_at
  BEFORE UPDATE ON public.church_resources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();