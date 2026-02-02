import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNews } from "@/hooks/useNews";
import { useRankings } from "@/hooks/useRankings";
import { useCastleData } from "@/hooks/useCastleData";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

type TabType = "news" | "pvp" | "pk" | "clans" | "castles";

const tabs: { id: TabType; label: string }[] = [
  { id: "news", label: "News" },
  { id: "pvp", label: "Top PvP" },
  { id: "pk", label: "Top PK" },
  { id: "clans", label: "Clans" },
  { id: "castles", label: "Castles" },
];

export function ContentTabs() {
  const [activeTab, setActiveTab] = useState<TabType>("news");
  const { data: news } = useNews();
  const { data: rankings } = useRankings();
  const { data: castles } = useCastleData();

  return (
    <div className="gaming-card rounded-xl overflow-hidden">
      {/* Tab Headers */}
      <div className="flex flex-wrap border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`lin2web-tab flex-1 min-w-[100px] rounded-none border-0 border-r border-border last:border-r-0 ${
              activeTab === tab.id ? "active" : ""
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "news" && <NewsContent news={news || []} />}
            {activeTab === "pvp" && <RankingsContent data={rankings?.players || []} type="pvp" />}
            {activeTab === "pk" && <RankingsContent data={rankings?.players || []} type="pk" />}
            {activeTab === "clans" && <ClansContent data={rankings?.clans || []} />}
            {activeTab === "castles" && <CastlesContent data={castles || []} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function NewsContent({ news }: { news: any[] }) {
  if (!news.length) {
    return <p className="text-muted-foreground text-center py-8">No news available</p>;
  }

  return (
    <div className="space-y-4">
      {news.slice(0, 3).map((item) => (
        <div key={item.id} className="flex gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
          <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-primary text-2xl font-bold">📰</span>
          </div>
          <div className="flex-1 min-w-0">
            <Link to={`/news/${item.id}`} className="hover:text-primary transition-colors">
              <h4 className="font-display font-semibold text-foreground truncate">{item.title}</h4>
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.excerpt}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">
                {format(new Date(item.published_at), "dd.MM.yyyy")}
              </span>
              <Link 
                to={`/news/${item.id}`}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                More details <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RankingsContent({ data, type }: { data: any[]; type: "pvp" | "pk" }) {
  const sortedData = [...data].sort((a, b) => 
    type === "pvp" ? (b.pvpkills || 0) - (a.pvpkills || 0) : (b.pkkills || 0) - (a.pkkills || 0)
  ).slice(0, 5);

  if (!sortedData.length) {
    return <p className="text-muted-foreground text-center py-8">No data available</p>;
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="text-left text-muted-foreground text-sm border-b border-border">
          <th className="pb-2 w-12">#</th>
          <th className="pb-2">Nickname</th>
          <th className="pb-2 text-center">Level</th>
          <th className="pb-2 text-right">{type.toUpperCase()}</th>
        </tr>
      </thead>
      <tbody>
        {sortedData.map((player, index) => (
          <tr key={player.char_name} className="border-b border-border/50 hover:bg-muted/30">
            <td className="py-3">
              <RankBadge rank={index + 1} />
            </td>
            <td className="py-3 font-medium">{player.char_name}</td>
            <td className="py-3 text-center text-muted-foreground">{player.level}</td>
            <td className="py-3 text-right text-primary font-semibold">
              {type === "pvp" ? player.pvpkills : player.pkkills}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ClansContent({ data }: { data: any[] }) {
  if (!data.length) {
    return <p className="text-muted-foreground text-center py-8">No clans available</p>;
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="text-left text-muted-foreground text-sm border-b border-border">
          <th className="pb-2 w-12">#</th>
          <th className="pb-2">Clan Name</th>
          <th className="pb-2">Leader</th>
          <th className="pb-2 text-right">Level</th>
        </tr>
      </thead>
      <tbody>
        {data.slice(0, 5).map((clan, index) => (
          <tr key={clan.clan_name} className="border-b border-border/50 hover:bg-muted/30">
            <td className="py-3">
              <RankBadge rank={index + 1} />
            </td>
            <td className="py-3 font-medium">{clan.clan_name}</td>
            <td className="py-3 text-muted-foreground">{clan.leader_name}</td>
            <td className="py-3 text-right text-primary font-semibold">{clan.clan_level}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CastlesContent({ data }: { data: any[] }) {
  if (!data.length) {
    return <p className="text-muted-foreground text-center py-8">No castle data available</p>;
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="text-left text-muted-foreground text-sm border-b border-border">
          <th className="pb-2">Castle</th>
          <th className="pb-2">Owner</th>
          <th className="pb-2 text-right">Tax Rate</th>
        </tr>
      </thead>
      <tbody>
        {data.map((castle) => (
          <tr key={castle.name} className="border-b border-border/50 hover:bg-muted/30">
            <td className="py-3 font-medium">{castle.name}</td>
            <td className="py-3 text-muted-foreground">{castle.owner || "—"}</td>
            <td className="py-3 text-right text-primary font-semibold">{castle.taxPercent || 0}%</td>
          </tr>
        ))}
      </tbody>
    </table>
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
