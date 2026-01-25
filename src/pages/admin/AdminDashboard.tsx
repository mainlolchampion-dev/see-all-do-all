import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Newspaper, Download, Image, Users } from "lucide-react";

export default function AdminDashboard() {
  const { isAdmin, isLoading } = useAdminAuth();
  const [stats, setStats] = useState({
    news: 0,
    downloads: 0,
    media: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [newsResult, downloadsResult, mediaResult] = await Promise.all([
          supabase.from("news").select("id", { count: "exact", head: true }),
          supabase.from("downloads").select("id", { count: "exact", head: true }),
          supabase.from("media").select("id", { count: "exact", head: true }),
        ]);

        setStats({
          news: newsResult.count || 0,
          downloads: downloadsResult.count || 0,
          media: mediaResult.count || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const statCards = [
    { title: "News Articles", value: stats.news, icon: Newspaper, color: "text-blue-500" },
    { title: "Downloads", value: stats.downloads, icon: Download, color: "text-green-500" },
    { title: "Media Items", value: stats.media, icon: Image, color: "text-purple-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-gradient-gold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to the L2 ALL STARS Admin Panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((stat) => (
            <Card key={stat.title} className="gaming-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                {loadingStats ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <div className="text-3xl font-bold">{stat.value}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="gaming-card">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="/admin/news" className="p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-center">
                <Newspaper className="w-8 h-8 mx-auto mb-2 text-primary" />
                <span className="text-sm font-medium">Add News</span>
              </a>
              <a href="/admin/downloads" className="p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-center">
                <Download className="w-8 h-8 mx-auto mb-2 text-primary" />
                <span className="text-sm font-medium">Manage Downloads</span>
              </a>
              <a href="/admin/media" className="p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-center">
                <Image className="w-8 h-8 mx-auto mb-2 text-primary" />
                <span className="text-sm font-medium">Upload Media</span>
              </a>
              <a href="/admin/settings" className="p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                <span className="text-sm font-medium">Server Settings</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
