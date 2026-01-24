import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TopPlayer {
  rank: number;
  name: string;
  class: string;
  level: number;
  pvp: number;
  pk: number;
  clan: string;
}

interface TopClan {
  rank: number;
  name: string;
  leader: string;
  level: number;
  members: number;
  reputation: number;
}

interface Hero {
  name: string;
  class: string;
  count: number;
}

interface RankingsData {
  players: TopPlayer[];
  clans: TopClan[];
  heroes: Hero[];
}

export function useRankings() {
  return useQuery<RankingsData>({
    queryKey: ["rankings"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("rankings");
      
      if (error) {
        console.error("Rankings fetch error:", error);
        throw error;
      }
      
      return {
        players: data?.players || [],
        clans: data?.clans || [],
        heroes: data?.heroes || []
      };
    },
    staleTime: 60000, // Cache for 1 minute
    refetchInterval: 60000, // Refetch every minute
  });
}
