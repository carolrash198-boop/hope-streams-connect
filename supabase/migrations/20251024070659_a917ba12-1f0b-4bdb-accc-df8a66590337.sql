-- Assign admin role to rashtech198@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('59575443-0894-4924-ab6a-76a6405051ce', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;