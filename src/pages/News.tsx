import { motion } from "framer-motion";
import { Calendar, Loader2, Newspaper } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useNews } from "@/hooks/useNews";
import { format } from "date-fns";

export default function News() {
  const { data: newsItems, isLoading } = useNews();

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
              <span className="text-gradient-gold">News & Announcements</span>
            </h1>
            <p className="text-muted-foreground">
              Stay updated with the latest server news
            </p>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading news...</span>
            </div>
          )}

          {/* News Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(newsItems || []).map((news, index) => (
                <motion.article
                  key={news.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="gaming-card rounded-xl overflow-hidden group cursor-pointer"
                >
                  <div className="h-40 bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center">
                    <Newspaper className="w-10 h-10 text-muted-foreground/60" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-primary/20 text-primary">
                        {news.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(news.published_at), "MMMM d, yyyy")}
                      </div>
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{news.excerpt}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && (!newsItems || newsItems.length === 0) && (
            <div className="text-center py-20">
            <Newspaper className="w-14 h-14 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No news yet</h3>
              <p className="text-muted-foreground">Check back later for updates!</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
