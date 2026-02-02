import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ServerStatus {
  loginServer: {
    status: "online" | "offline";
    players: number;
  };
  gameServer: {
    status: "online" | "offline";
    players: number;
  };
  maxPlayers: number;
  uptime: string;
}

const fallbackStatus: ServerStatus = {
  loginServer: { status: "offline", players: 0 },
  gameServer: { status: "offline", players: 0 },
  maxPlayers: 5000,
  uptime: "N/A",
};

export function useServerStatus() {
  return useQuery<ServerStatus>({
    queryKey: ["server-status"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("server-status");
      if (error) {
        throw error;
      }
      return data || fallbackStatus;
    },
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    retry: 1,
  });
}
