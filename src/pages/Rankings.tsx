import { motion } from "framer-motion";
import { Trophy, Swords, Crown, Users, Medal, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRankings } from "@/hooks/useRankings";

export default function Rankings() {
  const { data, isLoading, error } = useRankings();

  const topPlayers = data?.players || [];
  const topClans = data?.clans || [];
  const heroes = data?.heroes || [];

  return (
    <Layout>
      <div className="py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-gold">Rankings</span>
            </h1>
            <p className="text-muted-foreground">
              Top players and clans on the server
            </p>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading rankings...</span>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="text-center py-10">
              <p className="text-destructive">Failed to load rankings. Please try again later.</p>
            </div>
          )}

          {/* Tabs */}
          {!isLoading && (
            <Tabs defaultValue="players" className="max-w-5xl mx-auto">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/50">
                <TabsTrigger value="players" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Swords className="w-4 h-4 mr-2" />
                  Top Players
                </TabsTrigger>
                <TabsTrigger value="clans" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Users className="w-4 h-4 mr-2" />
                  Top Clans
                </TabsTrigger>
                <TabsTrigger value="heroes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Crown className="w-4 h-4 mr-2" />
                  Heroes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="players">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="gaming-card rounded-xl overflow-hidden"
                >
                  {topPlayers.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                      No player data available
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/50 border-b border-border">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Rank</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Player</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Class</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold">Level</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold">PvP</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold">PK</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Clan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {topPlayers.map((player) => (
                            <tr key={player.rank} className="hover:bg-muted/30 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  {player.rank <= 3 ? (
                                    <Trophy className={`w-5 h-5 ${
                                      player.rank === 1 ? "text-yellow-500" :
                                      player.rank === 2 ? "text-gray-400" :
                                      "text-amber-600"
                                    }`} />
                                  ) : (
                                    <span className="w-5 text-center text-muted-foreground">{player.rank}</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 font-medium">{player.name}</td>
                              <td className="px-6 py-4 text-muted-foreground">{player.class}</td>
                              <td className="px-6 py-4 text-center text-primary">{player.level}</td>
                              <td className="px-6 py-4 text-center text-green-500">{player.pvp.toLocaleString()}</td>
                              <td className="px-6 py-4 text-center text-red-500">{player.pk.toLocaleString()}</td>
                              <td className="px-6 py-4 text-muted-foreground">{player.clan}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="clans">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="gaming-card rounded-xl overflow-hidden"
                >
                  {topClans.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                      No clan data available
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/50 border-b border-border">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Rank</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Clan</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Leader</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold">Level</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold">Members</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold">Reputation</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {topClans.map((clan) => (
                            <tr key={clan.rank} className="hover:bg-muted/30 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  {clan.rank <= 3 ? (
                                    <Medal className={`w-5 h-5 ${
                                      clan.rank === 1 ? "text-yellow-500" :
                                      clan.rank === 2 ? "text-gray-400" :
                                      "text-amber-600"
                                    }`} />
                                  ) : (
                                    <span className="w-5 text-center text-muted-foreground">{clan.rank}</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 font-medium">{clan.name}</td>
                              <td className="px-6 py-4 text-muted-foreground">{clan.leader}</td>
                              <td className="px-6 py-4 text-center text-primary">{clan.level}</td>
                              <td className="px-6 py-4 text-center">{clan.members}</td>
                              <td className="px-6 py-4 text-center text-gradient-gold font-semibold">{clan.reputation.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="heroes">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  {heroes.length === 0 ? (
                    <div className="col-span-3 text-center py-10 text-muted-foreground">
                      No hero data available
                    </div>
                  ) : (
                    heroes.map((hero, index) => (
                      <div key={hero.name} className="gaming-card rounded-xl p-6 text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-gold flex items-center justify-center mb-4">
                          <Crown className="w-8 h-8 text-background" />
                        </div>
                        <h3 className="font-display text-xl font-semibold mb-1">{hero.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{hero.class}</p>
                        <div className="flex justify-center">
                          <div>
                            <div className="text-2xl font-bold text-gradient-gold">{hero.count}</div>
                            <div className="text-xs text-muted-foreground">Hero Count</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </Layout>
  );
}
