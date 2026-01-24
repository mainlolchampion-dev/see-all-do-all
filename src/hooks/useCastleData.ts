import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CastleData {
  id: number;
  name: string;
  owner: string | null;
  taxPercent: number;
  siegeDate: string | null;
}

export function useCastleData() {
  return useQuery<CastleData[]>({
    queryKey: ["castles"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("castle-data");
      
      if (error) {
        console.error("Castle data fetch error:", error);
        throw error;
      }
      
      return data?.castles || [];
    },
    staleTime: 60000, // Cache for 1 minute
    refetchInterval: 60000, // Refetch every minute
  });
}
