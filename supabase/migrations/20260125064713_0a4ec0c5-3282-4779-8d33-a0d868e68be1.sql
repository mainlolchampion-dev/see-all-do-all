-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create downloads table for managing download links
CREATE TABLE public.downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_size TEXT,
    icon TEXT DEFAULT 'download',
    download_type TEXT NOT NULL DEFAULT 'client',
    is_primary BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Downloads are viewable by everyone"
ON public.downloads FOR SELECT
USING (true);

CREATE POLICY "Only admins can manage downloads"
ON public.downloads FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create media table for gallery management
CREATE TABLE public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    media_type TEXT NOT NULL DEFAULT 'screenshot',
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Media is viewable by everyone"
ON public.media FOR SELECT
USING (true);

CREATE POLICY "Only admins can manage media"
ON public.media FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create server_settings table for dynamic site configuration
CREATE TABLE public.server_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL DEFAULT '{}',
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.server_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings are viewable by everyone"
ON public.server_settings FOR SELECT
USING (true);

CREATE POLICY "Only admins can manage settings"
ON public.server_settings FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create download_mirrors table
CREATE TABLE public.download_mirrors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    download_id UUID REFERENCES public.downloads(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.download_mirrors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mirrors are viewable by everyone"
ON public.download_mirrors FOR SELECT
USING (true);

CREATE POLICY "Only admins can manage mirrors"
ON public.download_mirrors FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Insert default server settings
INSERT INTO public.server_settings (key, value, description) VALUES
('rates', '{"xp": 50, "sp": 50, "adena": 50, "drop": 5, "spoil": 5, "quest_drop": 5, "seal_stones": 5, "raid_drop": 1, "epic_drop": 1}', 'Server experience and drop rates'),
('features', '{"max_enchant": "+25", "safe_enchant": "+4", "max_level": 85, "subclass_without_quest": true, "free_teleport": true, "global_gk": true, "auto_learn_skills": true, "custom_weapons": true, "custom_armors": true}', 'Server features configuration'),
('discord', '{"invite_url": "https://discord.gg/l2allstars", "widget_id": ""}', 'Discord integration settings'),
('siege', '{"schedule": "Every Sunday 20:00 GMT+2"}', 'Siege schedule settings');

-- Add the first admin (wedilink@gmail.com)
-- This will be done via a separate insert after migration