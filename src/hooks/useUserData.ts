import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Character {
  name: string;
  class: string;
  classId: number;
  level: number;
  online: boolean;
  pvpkills: number;
  pkkills: number;
}

export interface UserData {
  login: string;
  characters: Character[];
  characterCount: number;
  donationCoins: number;
}

async function fetchUserData(email: string): Promise<UserData> {
  const { data, error } = await supabase.functions.invoke("user-data", {
    body: { email },
  });

  if (error) {
    throw new Error(error.message || "Failed to fetch user data");
  }

  if (data.error) {
    const err = new Error(data.error) as Error & { notLinked?: boolean };
    err.notLinked = data.notLinked || false;
    throw err;
  }

  return data as UserData;
}

export function useUserData(email: string | null | undefined) {
  return useQuery({
    queryKey: ["user-data", email],
    queryFn: () => fetchUserData(email!),
    enabled: !!email,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refresh every minute
    retry: 1,
  });
}
