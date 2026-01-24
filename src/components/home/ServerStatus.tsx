import { motion } from "framer-motion";
import { Server, Users, Wifi, Clock } from "lucide-react";

const serverData = {
  loginServer: { status: "online", players: 1247 },
  gameServer: { status: "online", players: 1189 },
  uptime: "15 days, 4 hours",
  nextSiege: "Saturday 20:00 GMT",
};

export function ServerStatus() {
  return (
    <section className="py-20 bg-surface-overlay">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient-gold">Server Status</span>
          </h2>
          <p className="text-muted-foreground">Real-time server information</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {/* Login Server */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="gaming-card rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Server className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Login Server</h3>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${serverData.loginServer.status === "online" ? "status-online" : "status-offline"}`} />
                  <span className="text-sm text-muted-foreground capitalize">{serverData.loginServer.status}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Game Server */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="gaming-card rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Wifi className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Game Server</h3>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${serverData.gameServer.status === "online" ? "status-online" : "status-offline"}`} />
                  <span className="text-sm text-muted-foreground capitalize">{serverData.gameServer.status}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Online Players */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="gaming-card rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Online Players</h3>
                <p className="text-2xl font-bold text-gradient-gold">{serverData.loginServer.players}</p>
              </div>
            </div>
          </motion.div>

          {/* Next Siege */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="gaming-card rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Next Siege</h3>
                <p className="text-sm text-primary">{serverData.nextSiege}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
