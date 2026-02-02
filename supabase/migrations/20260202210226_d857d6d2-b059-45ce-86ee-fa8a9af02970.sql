-- Create donation_metrics table to track total coins sold
CREATE TABLE public.donation_metrics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  total_coins integer NOT NULL DEFAULT 0,
  reset_at timestamp with time zone,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.donation_metrics ENABLE ROW LEVEL SECURITY;

-- Everyone can view metrics
CREATE POLICY "Donation metrics are viewable by everyone"
  ON public.donation_metrics
  FOR SELECT
  USING (true);

-- Only admins can manage metrics
CREATE POLICY "Only admins can manage donation metrics"
  ON public.donation_metrics
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert initial global counter row
INSERT INTO public.donation_metrics (key, total_coins, reset_at)
VALUES ('global', 0, now());