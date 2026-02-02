import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { defaultServerSettings, type ServerSettings } from "@/lib/serverSettings";

export function useServerSettings() {
  return useQuery<ServerSettings>({
    queryKey: ["server-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("server_settings").select("key, value");

      if (error) {
        throw error;
      }

      const merged = { ...defaultServerSettings } as ServerSettings;

      (data || []).forEach((row) => {
        if (row.key in merged) {
          (merged as any)[row.key] = row.value;
        }
      });

      return merged;
    },
    staleTime: 60 * 1000,
  });
}
