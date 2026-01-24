import { motion } from "framer-motion";
import { Download as DownloadIcon, Monitor, HardDrive, FileDown, ExternalLink } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const downloads = [
  {
    title: "Full Client",
    description: "Complete Lineage 2 High Five client with all required files.",
    size: "7.2 GB",
    icon: HardDrive,
    type: "primary",
  },
  {
    title: "System Patch",
    description: "Latest system patch for connecting to our server.",
    size: "245 MB",
    icon: FileDown,
    type: "secondary",
  },
  {
    title: "Auto Updater",
    description: "Keep your client up-to-date automatically.",
    size: "15 MB",
    icon: Monitor,
    type: "secondary",
  },
];

const mirrors = [
  { name: "Google Drive", url: "#" },
  { name: "Mega.nz", url: "#" },
  { name: "MediaFire", url: "#" },
  { name: "Torrent", url: "#" },
];

export default function Download() {
  return (
    <Layout>
      <div className="py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-gold">Download</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get the game client and start your adventure. Make sure to download all required files.
            </p>
          </motion.div>

          {/* Download Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            {downloads.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`gaming-card rounded-xl p-6 ${
                  item.type === "primary" ? "border-primary/50 md:col-span-1" : ""
                }`}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Size: {item.size}</span>
                  <Button size="sm" className={item.type === "primary" ? "btn-glow" : ""}>
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mirror Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            <div className="gaming-card rounded-xl p-8">
              <h2 className="font-display text-2xl font-bold mb-6 text-center">
                <span className="text-gradient-gold">Download Mirrors</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mirrors.map((mirror) => (
                  <a
                    key={mirror.name}
                    href={mirror.url}
                    className="flex items-center justify-center gap-2 p-4 rounded-lg bg-muted/50 hover:bg-primary/20 hover:text-primary transition-all group"
                  >
                    <span className="font-medium">{mirror.name}</span>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* System Requirements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-3xl mx-auto mt-12"
          >
            <div className="gaming-card rounded-xl p-8">
              <h2 className="font-display text-2xl font-bold mb-6 text-center">
                <span className="text-gradient-gold">System Requirements</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-primary mb-4">Minimum</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• OS: Windows 7 / 8 / 10 / 11</li>
                    <li>• CPU: Pentium 4 2.0 GHz</li>
                    <li>• RAM: 2 GB</li>
                    <li>• GPU: GeForce 6600 / Radeon X1600</li>
                    <li>• Storage: 10 GB</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-4">Recommended</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• OS: Windows 10 / 11</li>
                    <li>• CPU: Core i3 or equivalent</li>
                    <li>• RAM: 4 GB</li>
                    <li>• GPU: GeForce GTX 650 / Radeon HD 7750</li>
                    <li>• Storage: 15 GB SSD</li>
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
