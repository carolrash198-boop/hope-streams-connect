-- Create outreach_projects table to store all outreach content
CREATE TABLE public.outreach_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  impact_metric TEXT,
  schedule TEXT,
  volunteers_needed TEXT,
  location TEXT,
  is_urgent BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  project_type TEXT NOT NULL DEFAULT 'current_project', -- current_project, impact_story, volunteer_opportunity
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.outreach_projects ENABLE ROW LEVEL SECURITY;

-- Public can view active projects
CREATE POLICY "Public can view active outreach projects"
ON public.outreach_projects
FOR SELECT
USING (is_active = true);

-- Admins can do everything
CREATE POLICY "Admins can insert outreach projects"
ON public.outreach_projects
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update outreach projects"
ON public.outreach_projects
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete outreach projects"
ON public.outreach_projects
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_outreach_projects_updated_at
BEFORE UPDATE ON public.outreach_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();