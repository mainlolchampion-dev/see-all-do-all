import { motion } from "framer-motion";
import { Users, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Discord } from "@/components/icons/SocialIcons";
import { useDiscordStats } from "@/hooks/useDiscordStats";
import { useServerSettings } from "@/hooks/useServerSettings";

const FALLBACK_INVITE = "PGCWBavr";

function extractInviteCode(inviteUrl: string | undefined) {
  if (!inviteUrl) return FALLBACK_INVITE;
  try {
    const url = new URL(inviteUrl);
    const parts = url.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || FALLBACK_INVITE;
  } catch {
    const cleaned = inviteUrl.replace("https://", "").replace("http://", "");
    const parts = cleaned.split("/");
    return parts[parts.length - 1] || FALLBACK_INVITE;
  }
}

export function DiscordWidget() {
  const { data: settings } = useServerSettings();
  const inviteCode = extractInviteCode(settings?.discord?.invite_url);
  const inviteUrl = settings?.discord?.invite_url || `https://discord.gg/${inviteCode}`;
  const { onlineCount, memberCount, guildName, isLoading, error } = useDiscordStats(inviteCode);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="gaming-card rounded-xl overflow-hidden border-yellow-500/50 shadow-[0_0_30px_hsl(38_90%_50%/0.15)] relative"
    >
      {/* Gold corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-500/60 rounded-tl-xl z-10" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-500/60 rounded-tr-xl z-10" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-yellow-500/60 rounded-bl-xl z-10" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-yellow-500/60 rounded-br-xl z-10" />

      {/* Header */}
      <div className="bg-[#5865F2] p-4 flex items-center gap-3">
        <Discord className="w-6 h-6 text-white" />
        <div>
          <h3 className="font-semibold text-white">{guildName || "L2 ALL STARS"} Discord</h3>
          <p className="text-xs text-white/70">Join our community</p>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 border-b border-border">
        {isLoading ? (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <p className="text-sm text-muted-foreground">{error}</p>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full status-online" />
              <span className="text-sm font-medium">{onlineCount.toLocaleString()} Online</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{memberCount.toLocaleString()} Members</span>
            </div>
          </div>
        )}
      </div>

      {/* Live indicator */}
      <div className="px-4 py-3 bg-muted/30">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
          <span>Live stats - Updates every 5 min</span>
        </div>
      </div>

      {/* Join Button */}
      <div className="p-4 pt-3">
        <Button 
          className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white"
          asChild
        >
          <a href={inviteUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="w-4 h-4 mr-2" />
            Join Discord
          </a>
        </Button>
      </div>
    </motion.div>
  );
}
