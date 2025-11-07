-- Create payment methods table
CREATE TABLE public.payment_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  method_type TEXT NOT NULL, -- 'mpesa', 'remitly', 'bank', 'paypal'
  provider_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT,
  instructions TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID
);

-- Enable RLS
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Policies for payment_methods
CREATE POLICY "Public can view active payment methods"
  ON public.payment_methods
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can insert payment methods"
  ON public.payment_methods
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update payment methods"
  ON public.payment_methods
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete payment methods"
  ON public.payment_methods
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add transaction_code and selected_currency to donations table
ALTER TABLE public.donations
ADD COLUMN transaction_code TEXT,
ADD COLUMN selected_currency TEXT DEFAULT 'USD',
ADD COLUMN payment_method_id UUID REFERENCES public.payment_methods(id),
ADD COLUMN verification_status TEXT DEFAULT 'pending'; -- 'pending', 'verified', 'rejected'

-- Insert default payment methods
INSERT INTO public.payment_methods (method_type, provider_name, account_number, account_name, instructions, display_order) VALUES
('mpesa', 'M-Pesa Paybill', '123434', NULL, 'Send money to Paybill 123434', 1),
('remitly', 'Remitly Transfer', '074845745', 'Macharia', 'Send via Remitly to phone number with name Macharia', 2),
('paypal', 'PayPal', 'info@pentecostal.com', NULL, 'Send payment to our PayPal account', 3);

-- Trigger for updated_at
CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON public.payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();