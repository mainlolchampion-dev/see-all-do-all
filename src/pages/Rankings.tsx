import { motion } from "framer-motion";
import { Trophy, Swords, Crown, Users, Medal, Target } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const topPlayers = [
  { rank: 1, name: "DarkElf", class: "Ghost Hunter", level: 85, pvp: 15420, pk: 892, clan: "Nemesis" },
  { rank: 2, name: "ShadowMage", class: "Archmage", level: 85, pvp: 12850, pk: 445, clan: "Immortals" },
  { rank: 3, name: "DragonSlayer", class: "Duelist", level: 85, pvp: 11200, pk: 1203, clan: "Legends" },
  { rank: 4, name: "IceQueen", class: "Storm Screamer", level: 84, pvp: 9800, pk: 321, clan: "Frost" },
  { rank: 5, name: "BladeRunner", class: "Grand Khavatari", level: 84, pvp: 8950, pk: 567, clan: "Nemesis" },
  { rank: 6, name: "NightHunter", class: "Adventurer", level: 84, pvp: 8420, pk: 234, clan: "Shadows" },
  { rank: 7, name: "ThunderGod", class: "Titan", level: 83, pvp: 7800, pk: 890, clan: "Olympus" },
  { rank: 8, name: "Phoenix", class: "Hierophant", level: 83, pvp: 7200, pk: 123, clan: "Immortals" },
  { rank: 9, name: "DemonLord", class: "Hell Knight", level: 83, pvp: 6900, pk: 1567, clan: "Demons" },
  { rank: 10, name: "Assassin", class: "Wind Rider", level: 82, pvp: 6500, pk: 456, clan: "Shadows" },
];

const topClans = [
  { rank: 1, name: "Nemesis", leader: "DarkElf", level: 11, members: 120, reputation: 45000 },
  { rank: 2, name: "Immortals", leader: "Phoenix", level: 11, members: 115, reputation: 42000 },
  { rank: 3, name: "Legends", leader: "DragonSlayer", level: 10, members: 98, reputation: 38000 },
  { rank: 4, name: "Shadows", leader: "NightHunter", level: 10, members: 85, reputation: 32000 },
  { rank: 5, name: "Olympus", leader: "ThunderGod", level: 9, members: 72, reputation: 28000 },
];

const heroes = [
  { name: "DarkElf", class: "Ghost Hunter", wins: 48, losses: 2 },
  { name: "ShadowMage", class: "Archmage", wins: 45, losses: 5 },
  { name: "DragonSlayer", class: "Duelist", wins: 42, losses: 8 },
];

export default function Rankings() {
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

          {/* Tabs */}
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
              </motion.div>
            </TabsContent>

            <TabsContent value="clans">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="gaming-card rounded-xl overflow-hidden"
              >
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
              </motion.div>
            </TabsContent>

            <TabsContent value="heroes">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {heroes.map((hero, index) => (
                  <div key={hero.name} className="gaming-card rounded-xl p-6 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-gold flex items-center justify-center mb-4">
                      <Crown className="w-8 h-8 text-background" />
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-1">{hero.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{hero.class}</p>
                    <div className="flex justify-center gap-6">
                      <div>
                        <div className="text-2xl font-bold text-green-500">{hero.wins}</div>
                        <div className="text-xs text-muted-foreground">Wins</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-500">{hero.losses}</div>
                        <div className="text-xs text-muted-foreground">Losses</div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
