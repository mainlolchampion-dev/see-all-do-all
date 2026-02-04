-- Create starter pack metrics table
CREATE TABLE public.starter_pack_metrics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key text NOT NULL UNIQUE,
    basic_count integer NOT NULL DEFAULT 0,
    improved_count integer NOT NULL DEFAULT 0,
    premium_count integer NOT NULL DEFAULT 0,
    elite_count integer NOT NULL DEFAULT 0,
    total_revenue integer NOT NULL DEFAULT 0,
    reset_at timestamp with time zone,
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert global record
INSERT INTO public.starter_pack_metrics (key) VALUES ('global');

-- Enable RLS
ALTER TABLE public.starter_pack_metrics ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Starter pack metrics are viewable by everyone"
ON public.starter_pack_metrics
FOR SELECT
USING (true);

CREATE POLICY "Only admins can manage starter pack metrics"
ON public.starter_pack_metrics
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Function to increment starter pack sales
CREATE OR REPLACE FUNCTION public.increment_starter_pack_sale(_pack_id text, _amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.starter_pack_metrics
  SET 
    basic_count = CASE WHEN _pack_id = 'basic' THEN basic_count + 1 ELSE basic_count END,
    improved_count = CASE WHEN _pack_id = 'improved' THEN improved_count + 1 ELSE improved_count END,
    premium_count = CASE WHEN _pack_id = 'premium' THEN premium_count + 1 ELSE premium_count END,
    elite_count = CASE WHEN _pack_id = 'elite' THEN elite_count + 1 ELSE elite_count END,
    total_revenue = total_revenue + _amount,
    updated_at = now()
  WHERE key = 'global';
END;
$$;