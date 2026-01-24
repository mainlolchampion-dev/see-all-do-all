import { motion } from "framer-motion";
import { Server, Users, Wifi, Clock, Loader2, RefreshCw } from "lucide-react";
import { useServerStatus } from "@/hooks/useServerStatus";

export function ServerStatus() {
  const { loginServer, gameServer, isLoading, error, lastUpdated } = useServerStatus();

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
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <p>
              {isLoading 
                ? "Connecting to server..." 
                : error 
                  ? error 
                  : `Live • Updates every 30s`
              }
            </p>
          </div>
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
                  {isLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <span className={`w-2 h-2 rounded-full ${loginServer.status === "online" ? "status-online" : "status-offline"}`} />
                      <span className="text-sm text-muted-foreground capitalize">{loginServer.status}</span>
                    </>
                  )}
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
                  {isLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <span className={`w-2 h-2 rounded-full ${gameServer.status === "online" ? "status-online" : "status-offline"}`} />
                      <span className="text-sm text-muted-foreground capitalize">{gameServer.status}</span>
                    </>
                  )}
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
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                ) : (
                  <p className="text-2xl font-bold text-gradient-gold">
                    {gameServer.players.toLocaleString()}
                  </p>
                )}
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
                <p className="text-sm text-primary">Saturday 20:00 GMT</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Last Updated */}
        {lastUpdated && !isLoading && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs text-muted-foreground mt-6"
          >
            Last updated: {lastUpdated.toLocaleTimeString()}
          </motion.p>
        )}
      </div>
    </section>
  );
}
