-- Restrict news management to admins only
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can create news" ON public.news;
DROP POLICY IF EXISTS "Authenticated users can update news" ON public.news;
DROP POLICY IF EXISTS "Authenticated users can delete news" ON public.news;

CREATE POLICY "Only admins can create news"
  ON public.news
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update news"
  ON public.news
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete news"
  ON public.news
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));
