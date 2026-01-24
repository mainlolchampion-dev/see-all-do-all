import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  published_at: string;
}

export function useNews() {
  return useQuery<NewsItem[]>({
    queryKey: ["news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("id, title, excerpt, category, published_at")
        .order("published_at", { ascending: false })
        .limit(5);
      
      if (error) {
        console.error("News fetch error:", error);
        throw error;
      }
      
      return data || [];
    },
    staleTime: 60000, // Cache for 1 minute
  });
}
