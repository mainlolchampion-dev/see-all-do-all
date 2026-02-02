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
      <div className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-gold">Media Gallery</span>
            </h1>
            <p className="text-muted-foreground">Screenshots and videos from our server</p>
          </motion.div>

          {/* Videos */}
          <div className="mb-16">
            <h2 className="font-display text-2xl font-bold mb-6 text-gradient-gold">Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <motion.div key={video.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.1 }} className="gaming-card rounded-xl overflow-hidden group cursor-pointer">
                  <div className="aspect-video bg-muted flex items-center justify-center relative">
                    <span className="text-5xl">{video.thumbnail}</span>
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-12 h-12 text-primary" />
                    </div>
                  </div>
                  <div className="p-4"><h3 className="font-semibold">{video.title}</h3></div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Screenshots */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-6 text-gradient-gold">Screenshots</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {screenshots.map((ss, index) => (
                <motion.div key={ss.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="aspect-video gaming-card rounded-xl flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
