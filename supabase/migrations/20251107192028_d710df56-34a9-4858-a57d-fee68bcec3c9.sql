-- Create volunteer_submissions table
CREATE TABLE public.volunteer_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  areas_of_interest text[] NOT NULL,
  availability text NOT NULL,
  message text,
  skills text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'active', 'inactive')),
  follow_up_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.volunteer_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit volunteer forms
CREATE POLICY "Anyone can submit volunteer forms"
  ON public.volunteer_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Users can view their own submissions
CREATE POLICY "Users can view their own submissions"
  ON public.volunteer_submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Admins can view all submissions
CREATE POLICY "Admins can view all submissions"
  ON public.volunteer_submissions
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update submissions
CREATE POLICY "Admins can update submissions"
  ON public.volunteer_submissions
  FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete submissions
CREATE POLICY "Admins can delete submissions"
  ON public.volunteer_submissions
  FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_volunteer_submissions_updated_at
  BEFORE UPDATE ON public.volunteer_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();