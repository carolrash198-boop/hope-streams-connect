-- Create tithes table
CREATE TABLE public.tithes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id UUID NOT NULL,
  member_id UUID,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KES',
  amount_in_kes NUMERIC NOT NULL,
  payment_method TEXT,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  transaction_reference TEXT,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tithes ENABLE ROW LEVEL SECURITY;

-- Create policies for tithes
CREATE POLICY "Admins can view all tithes"
ON public.tithes
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert tithes"
ON public.tithes
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update tithes"
ON public.tithes
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete tithes"
ON public.tithes
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_tithes_updated_at
BEFORE UPDATE ON public.tithes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create exchange rates table for currency conversion
CREATE TABLE public.exchange_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  currency_code TEXT NOT NULL UNIQUE,
  rate_to_kes NUMERIC NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for exchange rates
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;

-- Create policies for exchange rates
CREATE POLICY "Public can view exchange rates"
ON public.exchange_rates
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage exchange rates"
ON public.exchange_rates
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default exchange rates (approximate rates as of 2025)
INSERT INTO public.exchange_rates (currency_code, rate_to_kes) VALUES
('KES', 1),
('USD', 130),
('EUR', 140),
('GBP', 165),
('ZAR', 7.5),
('UGX', 0.035),
('TZS', 0.055);

-- Create trigger for exchange rates updated_at
CREATE TRIGGER update_exchange_rates_updated_at
BEFORE UPDATE ON public.exchange_rates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();