import { motion } from "framer-motion";
import { Users, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Discord } from "@/components/icons/SocialIcons";

const onlineMembers = [
  "DarkElf", "ShadowMage", "DragonSlayer", "IceQueen", "BladeRunner",
  "NightHunter", "ThunderGod", "Phoenix", "Assassin", "DemonLord"
];

export function DiscordWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="gaming-card rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-[#5865F2] p-4 flex items-center gap-3">
        <Discord className="w-6 h-6 text-white" />
        <div>
          <h3 className="font-semibold text-white">L2 ALL STARS Discord</h3>
          <p className="text-xs text-white/70">Join our community</p>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full status-online" />
            <span className="text-sm font-medium">630 Online</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">2,845 Members</span>
          </div>
        </div>
      </div>

      {/* Online Members Preview */}
      <div className="p-4 space-y-2 max-h-40 overflow-hidden">
        {onlineMembers.slice(0, 5).map((member) => (
          <div key={member} className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full status-online" />
            <span className="text-muted-foreground">{member}</span>
          </div>
        ))}
        <p className="text-xs text-muted-foreground">+{onlineMembers.length - 5} more online</p>
      </div>

      {/* Join Button */}
      <div className="p-4 pt-0">
        <Button 
          className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white"
          asChild
        >
          <a href="https://discord.gg/l2allstars" target="_blank" rel="noopener noreferrer">
            <MessageCircle className="w-4 h-4 mr-2" />
            Join Discord
          </a>
        </Button>
      </div>
    </motion.div>
  );
}
