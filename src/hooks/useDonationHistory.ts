import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DonationRecord {
  id: string;
  date: string;
  amount: number;
  coins: number;
  status: string;
}

export function useDonationHistory(login: string | undefined) {
  return useQuery<DonationRecord[]>({
    queryKey: ["donation-history", login],
    queryFn: async () => {
      if (!login) return [];
      
      const { data, error } = await supabase.functions.invoke("donation-history", {
        body: { login }
      });
      
      if (error) {
        console.error("Donation history fetch error:", error);
        return [];
      }
      
      return data?.donations || [];
    },
    enabled: !!login,
    staleTime: 30000, // Cache for 30 seconds
  });
}
