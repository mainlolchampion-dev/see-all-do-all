-- Create function to safely increment donation coins
CREATE OR REPLACE FUNCTION public.increment_donation_coins(_amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.donation_metrics
  SET total_coins = total_coins + _amount,
      updated_at = now()
  WHERE key = 'global';
END;
$$;