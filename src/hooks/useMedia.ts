import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MediaItem {
  id: string;
  title: string;
  media_type: "screenshot" | "video" | string;
  url: string;
  thumbnail_url: string | null;
  description: string | null;
  sort_order: number | null;
  is_featured: boolean | null;
}

export function useMedia() {
  return useQuery<MediaItem[]>({
    queryKey: ["media"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("media")
        .select("*")
        .order("is_featured", { ascending: false })
        .order("sort_order", { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    },
    staleTime: 60 * 1000,
  });
}
