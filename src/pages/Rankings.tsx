import { motion } from "framer-motion";
import { Trophy, Swords, Crown, Users, Medal, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useRankings } from "@/hooks/useRankings";
import { useState } from "react";

type TabType = "players" | "clans" | "heroes";

export default function Rankings() {
  const { data, isLoading, error } = useRankings();
  const [activeTab, setActiveTab] = useState<TabType>("players");

  const topPlayers = data?.players || [];
  const topClans = data?.clans || [];
  const heroes = data?.heroes || [];

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: "players", label: "Top Players", icon: Swords },
    { id: "clans", label: "Top Clans", icon: Users },
    { id: "heroes", label: "Heroes", icon: Crown },
  ];

  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wide">
              <span className="text-gradient-gold">Statistics</span>
            </h1>
            <p className="text-muted-foreground mt-2">
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
            <div className="max-w-5xl mx-auto">
              {/* Tab Headers */}
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`lin2web-tab flex items-center gap-2 rounded-lg ${
                      activeTab === tab.id ? "active" : ""
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="gaming-card rounded-xl overflow-hidden">
                {activeTab === "players" && (
                  <PlayersTable players={topPlayers} />
                )}
                {activeTab === "clans" && (
                  <ClansTable clans={topClans} />
                )}
                {activeTab === "heroes" && (
                  <HeroesGrid heroes={heroes} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function PlayersTable({ players }: { players: any[] }) {
  if (players.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No player data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-border">
          <tr className="text-left text-sm text-muted-foreground">
            <th className="px-4 py-3 w-12">#</th>
            <th className="px-4 py-3">Player</th>
            <th className="px-4 py-3">Class</th>
            <th className="px-4 py-3 text-center">Level</th>
            <th className="px-4 py-3 text-center">PvP</th>
            <th className="px-4 py-3 text-center">PK</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.rank} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3">
                <RankBadge rank={player.rank} />
              </td>
              <td className="px-4 py-3 font-medium text-foreground">{player.name}</td>
              <td className="px-4 py-3 text-muted-foreground text-sm">{player.class}</td>
              <td className="px-4 py-3 text-center text-primary font-semibold">{player.level}</td>
              <td className="px-4 py-3 text-center text-emerald font-semibold">{player.pvp}</td>
              <td className="px-4 py-3 text-center text-destructive font-semibold">{player.pk}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ClansTable({ clans }: { clans: any[] }) {
  if (clans.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No clan data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-border">
          <tr className="text-left text-sm text-muted-foreground">
            <th className="px-4 py-3 w-12">#</th>
            <th className="px-4 py-3">Clan</th>
            <th className="px-4 py-3">Leader</th>
            <th className="px-4 py-3 text-center">Level</th>
            <th className="px-4 py-3 text-center">Members</th>
            <th className="px-4 py-3 text-center">Reputation</th>
          </tr>
        </thead>
        <tbody>
          {clans.map((clan) => (
            <tr key={clan.rank} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3">
                <RankBadge rank={clan.rank} />
              </td>
              <td className="px-4 py-3 font-medium text-foreground">{clan.name}</td>
              <td className="px-4 py-3 text-muted-foreground">{clan.leader}</td>
              <td className="px-4 py-3 text-center text-primary font-semibold">{clan.level}</td>
              <td className="px-4 py-3 text-center text-muted-foreground">{clan.members}</td>
              <td className="px-4 py-3 text-center text-primary font-semibold">{clan.reputation?.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HeroesGrid({ heroes }: { heroes: any[] }) {
  if (heroes.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No hero data available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {heroes.map((hero) => (
        <div key={hero.name} className="gaming-card rounded-lg p-4 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-3">
            <Crown className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-display font-semibold text-foreground">{hero.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{hero.class}</p>
          <div className="text-xl font-bold text-primary">{hero.count}x Hero</div>
        </div>
      ))}
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return <span className="text-yellow-400 text-lg">🥇</span>;
  }
  if (rank === 2) {
    return <span className="text-gray-400 text-lg">🥈</span>;
  }
  if (rank === 3) {
    return <span className="text-amber-600 text-lg">🥉</span>;
  }
  return <span className="text-muted-foreground">{rank}</span>;
}
