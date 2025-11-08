-- Enable realtime for donations table
ALTER TABLE public.donations REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.donations;

-- Enable realtime for church_members table
ALTER TABLE public.church_members REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.church_members;

-- Enable realtime for prayer_requests table
ALTER TABLE public.prayer_requests REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.prayer_requests;

-- Enable realtime for contact_submissions table
ALTER TABLE public.contact_submissions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_submissions;

-- Enable realtime for volunteer_submissions table
ALTER TABLE public.volunteer_submissions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.volunteer_submissions;

-- Enable realtime for events table
ALTER TABLE public.events REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;

-- Enable realtime for sermons table
ALTER TABLE public.sermons REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sermons;
