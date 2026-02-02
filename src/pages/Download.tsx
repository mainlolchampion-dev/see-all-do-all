import { motion } from "framer-motion";
import { Download as DownloadIcon, Monitor, HardDrive, FileDown, ExternalLink, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useDownloads } from "@/hooks/useDownloads";

const typeIconMap: Record<string, typeof HardDrive> = {
  client: HardDrive,
  patch: FileDown,
  updater: Monitor,
  addon: FileDown,
  other: FileDown,
};

export default function Download() {
  const { data, isLoading, error } = useDownloads();

  return (
    <Layout>
      <div className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-gold">Download</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get the game client and start your adventure. Download the required files below.
            </p>
          </motion.div>

          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading downloads...</span>
            </div>
          )}

          {error && !isLoading && (
            <div className="text-center py-12 text-destructive">
              Failed to load downloads. Please try again later.
            </div>
          )}

          {!isLoading && !error && (data || []).length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No downloads available yet. Check back soon.
            </div>
          )}

          {!isLoading && !error && (data || []).length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
              {(data || []).map((item, index) => {
                const Icon = typeIconMap[item.download_type] || FileDown;
                const highlight = item.is_primary;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`gaming-card rounded-xl p-6 ${highlight ? "border-primary/50" : ""}`}
                  >
                    <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-2">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Size: {item.file_size || "Unknown"}
                      </span>
                      <Button size="sm" className={highlight ? "btn-glow" : ""} asChild>
                        <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                          <DownloadIcon className="w-4 h-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    </div>

                    {item.mirrors.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="text-xs text-muted-foreground mb-2">Mirrors</div>
                        <div className="flex flex-wrap gap-2">
                          {item.mirrors.map((mirror) => (
                            <a
                              key={mirror.id}
                              href={mirror.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 hover:bg-primary/20 hover:text-primary transition-all text-xs"
                            >
                              {mirror.name}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <div className="gaming-card rounded-xl p-8">
              <h2 className="font-display text-2xl font-bold mb-6 text-center">
                <span className="text-gradient-gold">System Requirements</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-primary mb-4">Minimum</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>- OS: Windows 7 / 8 / 10 / 11</li>
                    <li>- CPU: Pentium 4 2.0 GHz</li>
                    <li>- RAM: 2 GB</li>
                    <li>- GPU: GeForce 6600 / Radeon X1600</li>
                    <li>- Storage: 10 GB</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-4">Recommended</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>- OS: Windows 10 / 11</li>
                    <li>- CPU: Core i3 or equivalent</li>
                    <li>- RAM: 4 GB</li>
                    <li>- GPU: GeForce GTX 650 / Radeon HD 7750</li>
                    <li>- Storage: 15 GB SSD</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
