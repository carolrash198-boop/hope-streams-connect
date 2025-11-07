-- Add admin policies for campaigns table
CREATE POLICY "Admins can insert campaigns"
ON public.campaigns
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update campaigns"
ON public.campaigns
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete campaigns"
ON public.campaigns
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all campaigns"
ON public.campaigns
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));