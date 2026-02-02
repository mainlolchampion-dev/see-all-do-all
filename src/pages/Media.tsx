import { motion } from "framer-motion";
import { Play, Image as ImageIcon } from "lucide-react";
import { Layout } from "@/components/layout/Layout";

const screenshots = Array.from({ length: 6 }, (_, i) => ({ id: i + 1, title: `Screenshot ${i + 1}` }));
const videos = [
  { id: 1, title: "Server Trailer", thumbnail: "🎬" },
  { id: 2, title: "Castle Siege", thumbnail: "⚔️" },
  { id: 3, title: "Epic PvP Moments", thumbnail: "🏆" },
];

export default function Media() {
  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wide mb-2">
              <span className="text-gradient-gold">Media Gallery</span>
            </h1>
            <p className="text-muted-foreground">Screenshots and videos from our server</p>
          </motion.div>

          {/* Videos */}
          <div className="mb-12">
            <h2 className="font-display text-xl font-bold mb-4 text-primary uppercase tracking-wide">Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {videos.map((video, index) => (
                <motion.div key={video.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.1 }} className="gaming-card rounded-lg overflow-hidden group cursor-pointer">
                  <div className="aspect-video bg-muted flex items-center justify-center relative">
                    <span className="text-4xl">{video.thumbnail}</span>
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-10 h-10 text-primary" />
                    </div>
                  </div>
                  <div className="p-3"><h3 className="font-display text-sm uppercase tracking-wide">{video.title}</h3></div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Screenshots */}
          <div>
            <h2 className="font-display text-xl font-bold mb-4 text-primary uppercase tracking-wide">Screenshots</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {screenshots.map((ss, index) => (
                <motion.div key={ss.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="aspect-video gaming-card rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all">
                  <ImageIcon className="w-6 h-6 text-muted-foreground" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="ornament-divider" />
    </Layout>
  );
}
