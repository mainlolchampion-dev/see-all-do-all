-- Create news table for announcements
CREATE TABLE public.news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT,
  category TEXT NOT NULL DEFAULT 'Update',
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Public read access for news
CREATE POLICY "News is viewable by everyone"
  ON public.news
  FOR SELECT
  USING (true);

-- Only authenticated admins can manage news (for now, allow all authenticated users - can restrict later)
CREATE POLICY "Authenticated users can create news"
  ON public.news
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update news"
  ON public.news
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete news"
  ON public.news
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Insert some initial news
INSERT INTO public.news (title, excerpt, category, published_at) VALUES
  ('Grand Opening Event', 'Join us for the grand opening with exclusive rewards and double XP weekend!', 'Event', NOW() - INTERVAL '4 days'),
  ('New Castle Siege Schedule', 'Updated siege times for better participation across all timezones.', 'Update', NOW() - INTERVAL '6 days'),
  ('Anti-Bot System Upgrade', 'We''ve enhanced our protection systems for a cleaner gaming experience.', 'Security', NOW() - INTERVAL '9 days');