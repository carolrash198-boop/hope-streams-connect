-- Add admin policies for sermons table
CREATE POLICY "Admins can insert sermons"
ON public.sermons
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update sermons"
ON public.sermons
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete sermons"
ON public.sermons
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add admin policies for gallery_items table
CREATE POLICY "Admins can insert gallery items"
ON public.gallery_items
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update gallery items"
ON public.gallery_items
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete gallery items"
ON public.gallery_items
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add admin policies for events table
CREATE POLICY "Admins can insert events"
ON public.events
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update events"
ON public.events
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete events"
ON public.events
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add admin policies for blog_posts table
CREATE POLICY "Admins can insert blog posts"
ON public.blog_posts
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update blog posts"
ON public.blog_posts
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete blog posts"
ON public.blog_posts
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));