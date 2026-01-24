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

async function fetchUserData(login?: string, email?: string): Promise<UserData> {
  const { data, error } = await supabase.functions.invoke("user-data", {
    body: { login, email },
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

export function useUserData(login?: string | null, email?: string | null) {
  return useQuery({
    queryKey: ["user-data", login, email],
    queryFn: () => fetchUserData(login || undefined, email || undefined),
    enabled: !!(login || email),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refresh every minute
    retry: 1,
  });
}
