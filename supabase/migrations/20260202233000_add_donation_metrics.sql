-- Donation metrics for admin-only reporting
CREATE TABLE IF NOT EXISTS public.donation_metrics (
  key TEXT PRIMARY KEY,
  total_coins BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reset_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.donation_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read donation metrics"
  ON public.donation_metrics
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert donation metrics"
  ON public.donation_metrics
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update donation metrics"
  ON public.donation_metrics
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.donation_metrics (key, total_coins)
VALUES ('global', 0)
ON CONFLICT (key) DO NOTHING;

-- Atomic increment for donation coins
CREATE OR REPLACE FUNCTION public.increment_donation_coins(_amount BIGINT)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.donation_metrics
  SET total_coins = total_coins + _amount,
      updated_at = now()
  WHERE key = 'global';
$$;
