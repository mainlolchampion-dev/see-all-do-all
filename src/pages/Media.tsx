import { motion } from "framer-motion";
import { Play, Image as ImageIcon, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useMedia } from "@/hooks/useMedia";

function getYouTubeId(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace("/", "");
    }
    if (parsed.searchParams.get("v")) {
      return parsed.searchParams.get("v") as string;
    }
    return "";
  } catch {
    return "";
  }
}

function getVideoThumbnail(url: string) {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}

export default function Media() {
  const { data, isLoading, error } = useMedia();

  const featured = (data || []).filter((item) => item.is_featured);
  const gallery = (data || []).filter((item) => !item.is_featured);

  return (
    <Layout>
      <div className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-gold">Media Gallery</span>
            </h1>
            <p className="text-muted-foreground">Screenshots and videos from our server</p>
          </motion.div>

          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading media...</span>
            </div>
          )}

          {error && !isLoading && (
            <div className="text-center py-12 text-destructive">
              Failed to load media. Please try again later.
            </div>
          )}

          {!isLoading && !error && (data || []).length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No media items yet. Check back soon.
            </div>
          )}

          {!isLoading && !error && featured.length > 0 && (
            <div className="mb-16">
              <h2 className="font-display text-2xl font-bold mb-6 text-gradient-gold">Featured</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featured.map((item, index) => {
                  const isVideo = item.media_type === "video";
                  const fallbackThumbnail = isVideo ? getVideoThumbnail(item.url) : "";
                  const thumbnail = item.thumbnail_url || fallbackThumbnail;

                  return (
                    <motion.a
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="gaming-card rounded-xl overflow-hidden group cursor-pointer"
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="aspect-video bg-muted flex items-center justify-center relative overflow-hidden">
                        {thumbnail ? (
                          <img src={thumbnail} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-10 h-10 text-muted-foreground" />
                        )}
                        {isVideo && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-12 h-12 text-primary" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold">{item.title}</h3>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        )}
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </div>
          )}

          {!isLoading && !error && gallery.length > 0 && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-6 text-gradient-gold">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.map((item, index) => {
                  const isVideo = item.media_type === "video";
                  const fallbackThumbnail = isVideo ? getVideoThumbnail(item.url) : "";
                  const thumbnail = item.thumbnail_url || fallbackThumbnail;

                  return (
                    <motion.a
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="aspect-video gaming-card rounded-xl flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all overflow-hidden relative"
                    >
                      {thumbnail ? (
                        <img src={thumbnail} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      )}
                      {isVideo && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Play className="w-10 h-10 text-primary" />
                        </div>
                      )}
                    </motion.a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
