import { motion } from "framer-motion";
import { useServerStatus } from "@/hooks/useServerStatus";
import { Discord, Youtube } from "@/components/icons/SocialIcons";
import { Castle } from "lucide-react";

export function ServerCards() {
  const serverStatus = useServerStatus();

  const isOnline = serverStatus.loginServer.status === "online" || serverStatus.gameServer.status === "online";
  const totalPlayers = serverStatus.gameServer.players || 0;

  const servers = [
    {
      name: "L2 All Stars",
      description: "Our main High Five x7 server, designed for competitive PvP and classic gameplay experience.",
      online: isOnline,
      players: totalPlayers,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Server Cards */}
      {servers.map((server, index) => (
        <motion.div
          key={server.name}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="server-card rounded-lg"
        >
          <div className="server-card-icon">
            <Castle className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display font-semibold text-foreground">{server.name}</h3>
              <span className={`w-2 h-2 rounded-full ${server.online ? "status-online" : "status-offline"}`} />
              <span className={`text-xs ${server.online ? "text-emerald" : "text-destructive"}`}>
                Online: {server.players}
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{server.description}</p>
          </div>
        </motion.div>
      ))}

      {/* Social Links */}
      <div className="flex items-center justify-center gap-3 pt-4">
        <a
          href="https://discord.gg/PGCWBavr"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
        >
          <Discord className="w-5 h-5" />
        </a>
        <a
          href="https://www.youtube.com/@Lineage2AllStars"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
        >
          <Youtube className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}
