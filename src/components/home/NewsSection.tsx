import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const newsItems = [
  {
    id: 1,
    title: "Grand Opening Event",
    excerpt: "Join us for the grand opening with exclusive rewards and double XP weekend!",
    date: "January 20, 2024",
    category: "Event",
  },
  {
    id: 2,
    title: "New Castle Siege Schedule",
    excerpt: "Updated siege times for better participation across all timezones.",
    date: "January 18, 2024",
    category: "Update",
  },
  {
    id: 3,
    title: "Anti-Bot System Upgrade",
    excerpt: "We've enhanced our protection systems for a cleaner gaming experience.",
    date: "January 15, 2024",
    category: "Security",
  },
];

export function NewsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
              <span className="text-gradient-gold">Latest News</span>
            </h2>
            <p className="text-muted-foreground">Stay updated with server announcements</p>
          </div>
          <Button variant="outline" className="hidden md:flex border-primary/50" asChild>
            <Link to="/news">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsItems.map((news, index) => (
            <motion.article
              key={news.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="gaming-card rounded-xl overflow-hidden group cursor-pointer"
            >
              <div className="h-40 bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center">
                <span className="text-4xl opacity-50">📰</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-primary/20 text-primary">
                    {news.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {news.date}
                  </div>
                </div>
                <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {news.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{news.excerpt}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" className="border-primary/50" asChild>
            <Link to="/news">
              View All News
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
