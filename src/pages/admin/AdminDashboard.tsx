import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Users, Coins, Package, FileText, Settings } from "lucide-react";

interface StarterPackMetrics {
  basic_count: number;
  improved_count: number;
  premium_count: number;
  elite_count: number;
  total_revenue: number;
  reset_at: string | null;
}

export default function AdminDashboard() {
  const { isAdmin, isLoading } = useAdminAuth();
  const [stats, setStats] = useState({
    downloads: 0,
  });
  const [donationTotal, setDonationTotal] = useState(0);
  const [donationResetAt, setDonationResetAt] = useState<string | null>(null);
  const [starterPackMetrics, setStarterPackMetrics] = useState<StarterPackMetrics>({
    basic_count: 0,
    improved_count: 0,
    premium_count: 0,
    elite_count: 0,
    total_revenue: 0,
    reset_at: null,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [downloadsResult, donationResult, starterPackResult] = await Promise.all([
          supabase.from("downloads").select("id", { count: "exact", head: true }),
          supabase.from("donation_metrics").select("total_coins, reset_at").eq("key", "global").single(),
          supabase.from("starter_pack_metrics").select("*").eq("key", "global").single(),
        ]);

        setStats({
          downloads: downloadsResult.count || 0,
        });

        setDonationTotal(donationResult?.data?.total_coins || 0);
        setDonationResetAt(donationResult?.data?.reset_at || null);
        
        if (starterPackResult?.data) {
          setStarterPackMetrics({
            basic_count: starterPackResult.data.basic_count || 0,
            improved_count: starterPackResult.data.improved_count || 0,
            premium_count: starterPackResult.data.premium_count || 0,
            elite_count: starterPackResult.data.elite_count || 0,
            total_revenue: starterPackResult.data.total_revenue || 0,
            reset_at: starterPackResult.data.reset_at || null,
          });
        }
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

  const handleResetDonationCounter = async () => {
    const confirmed = confirm("Reset the donation coins counter to 0?");
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("donation_metrics")
        .update({
          total_coins: 0,
          reset_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as any)
        .eq("key", "global");

      if (error) throw error;

      setDonationTotal(0);
      setDonationResetAt(new Date().toISOString());
    } catch (error) {
      console.error("Failed to reset donation counter:", error);
    }
  };

  const handleResetStarterPackCounter = async () => {
    const confirmed = confirm("Reset all Starter Pack counters to 0?");
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("starter_pack_metrics")
        .update({
          basic_count: 0,
          improved_count: 0,
          premium_count: 0,
          elite_count: 0,
          total_revenue: 0,
          reset_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as any)
        .eq("key", "global");

      if (error) throw error;

      setStarterPackMetrics({
        basic_count: 0,
        improved_count: 0,
        premium_count: 0,
        elite_count: 0,
        total_revenue: 0,
        reset_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to reset starter pack counter:", error);
    }
  };

  const totalPacksSold = starterPackMetrics.basic_count + starterPackMetrics.improved_count + 
                         starterPackMetrics.premium_count + starterPackMetrics.elite_count;

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
    { title: "Downloads", value: stats.downloads, icon: Download, color: "text-green-500" },
    { title: "Donation Coins Sold", value: donationTotal, icon: Coins, color: "text-amber-500" },
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
                  <div className="text-3xl font-bold">
                    {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="gaming-card">
          <CardHeader>
            <CardTitle className="text-lg">Donation Counter</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Total donation coins sold</div>
              <div className="text-3xl font-bold text-gradient-gold">
                {donationTotal.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Last reset: {donationResetAt ? new Date(donationResetAt).toLocaleString() : "Never"}
              </div>
            </div>
            <Button variant="destructive" onClick={handleResetDonationCounter}>
              Reset Counter
            </Button>
          </CardContent>
        </Card>

        {/* Starter Packs Counter */}
        <Card className="gaming-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Starter Packs Sales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Basic</div>
                <div className="text-2xl font-bold text-blue-400">{starterPackMetrics.basic_count}</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Improved</div>
                <div className="text-2xl font-bold text-green-400">{starterPackMetrics.improved_count}</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Premium</div>
                <div className="text-2xl font-bold text-amber-400">{starterPackMetrics.premium_count}</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Elite</div>
                <div className="text-2xl font-bold text-red-400">{starterPackMetrics.elite_count}</div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4 border-t border-border">
              <div>
                <div className="text-sm text-muted-foreground">Total Packs Sold</div>
                <div className="text-3xl font-bold">{totalPacksSold}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
                <div className="text-3xl font-bold text-gradient-gold">
                  €{(starterPackMetrics.total_revenue / 100).toFixed(2)}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Button variant="destructive" onClick={handleResetStarterPackCounter}>
                  Reset Counter
                </Button>
                <div className="text-xs text-muted-foreground">
                  Last reset: {starterPackMetrics.reset_at ? new Date(starterPackMetrics.reset_at).toLocaleString() : "Never"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="gaming-card">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <a href="/admin/description" className="p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-center">
                <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
                <span className="text-sm font-medium">Edit Description</span>
              </a>
              <a href="/admin/downloads" className="p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-center">
                <Download className="w-8 h-8 mx-auto mb-2 text-primary" />
                <span className="text-sm font-medium">Manage Downloads</span>
              </a>
              <a href="/admin/settings" className="p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-center">
                <Settings className="w-8 h-8 mx-auto mb-2 text-primary" />
                <span className="text-sm font-medium">Server Settings</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
