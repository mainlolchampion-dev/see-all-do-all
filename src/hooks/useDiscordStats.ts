import { useState, useEffect } from "react";

interface DiscordStats {
  onlineCount: number;
  memberCount: number;
  guildName: string;
  isLoading: boolean;
  error: string | null;
}

export function useDiscordStats(inviteCode: string): DiscordStats {
  const [stats, setStats] = useState<DiscordStats>({
    onlineCount: 0,
    memberCount: 0,
    guildName: "",
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchDiscordStats() {
      try {
        const response = await fetch(
          `https://discord.com/api/v9/invites/${inviteCode}?with_counts=true`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch Discord stats");
        }
        
        const data = await response.json();
        
        setStats({
          onlineCount: data.approximate_presence_count || 0,
          memberCount: data.approximate_member_count || 0,
          guildName: data.guild?.name || "L2 ALL STARS",
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error("Discord API error:", error);
        setStats({
          onlineCount: 0,
          memberCount: 0,
          guildName: "L2 ALL STARS",
          isLoading: false,
          error: "Could not load Discord stats",
        });
      }
    }

    fetchDiscordStats();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchDiscordStats, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [inviteCode]);

  return stats;
}
