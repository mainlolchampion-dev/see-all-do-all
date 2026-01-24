import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ServerStatus {
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
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export function useServerStatus(): ServerStatus {
  const [status, setStatus] = useState<ServerStatus>({
    loginServer: { status: "offline", players: 0 },
    gameServer: { status: "offline", players: 0 },
    maxPlayers: 5000,
    uptime: "N/A",
    isLoading: true,
    error: null,
    lastUpdated: null,
  });

  useEffect(() => {
    async function fetchServerStatus() {
      try {
        const { data, error } = await supabase.functions.invoke('server-status');
        
        if (error) {
          throw error;
        }

        setStatus({
          ...data,
          isLoading: false,
          error: null,
          lastUpdated: new Date(),
        });
      } catch (error) {
        console.error("Failed to fetch server status:", error);
        setStatus(prev => ({
          ...prev,
          isLoading: false,
          error: "Could not connect to server",
          lastUpdated: new Date(),
        }));
      }
    }

    fetchServerStatus();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchServerStatus, 30 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return status;
}
