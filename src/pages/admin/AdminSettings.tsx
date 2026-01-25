import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, Swords, Settings, MessageCircle, Castle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ServerSettings {
  rates: {
    xp: number;
    sp: number;
    adena: number;
    drop: number;
    spoil: number;
    quest_drop: number;
    seal_stones: number;
    raid_drop: number;
    epic_drop: number;
  };
  features: {
    max_enchant: string;
    safe_enchant: string;
    max_level: number;
    subclass_without_quest: boolean;
    free_teleport: boolean;
    global_gk: boolean;
    auto_learn_skills: boolean;
    custom_weapons: boolean;
    custom_armors: boolean;
  };
  discord: {
    invite_url: string;
    widget_id: string;
  };
  siege: {
    schedule: string;
  };
}

const defaultSettings: ServerSettings = {
  rates: {
    xp: 50, sp: 50, adena: 50, drop: 5, spoil: 5,
    quest_drop: 5, seal_stones: 5, raid_drop: 1, epic_drop: 1,
  },
  features: {
    max_enchant: "+25", safe_enchant: "+4", max_level: 85,
    subclass_without_quest: true, free_teleport: true, global_gk: true,
    auto_learn_skills: true, custom_weapons: true, custom_armors: true,
  },
  discord: { invite_url: "", widget_id: "" },
  siege: { schedule: "Every Sunday 20:00 GMT+2" },
};

export default function AdminSettings() {
  const { isAdmin, isLoading: authLoading } = useAdminAuth();
  const [settings, setSettings] = useState<ServerSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from("server_settings").select("*");
      if (error) throw error;

      const loadedSettings = { ...defaultSettings };
      data?.forEach((setting) => {
        if (setting.key in loadedSettings) {
          (loadedSettings as any)[setting.key] = setting.value;
        }
      });
      setSettings(loadedSettings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast({ title: "Error", description: "Failed to fetch settings", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchSettings();
    }
  }, [isAdmin]);

  const saveSettings = async (key: string, value: any) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("server_settings")
        .upsert({
          key,
          value,
          updated_at: new Date().toISOString(),
        }, { onConflict: "key" });

      if (error) throw error;
      toast({ title: "Success", description: `${key} settings saved successfully` });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({ title: "Error", description: "Failed to save settings", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-gradient-gold">Server Settings</h1>
          <p className="text-muted-foreground mt-1">Configure rates, features, and site settings</p>
        </div>

        {/* Rates Section */}
        <Card className="gaming-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Swords className="w-5 h-5 text-primary" />
              <CardTitle>Server Rates</CardTitle>
            </div>
            <CardDescription>Experience, drop, and adena rates displayed on the website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(settings.rates).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key} className="capitalize">{key.replace("_", " ")}</Label>
                  <Input
                    id={key}
                    type="number"
                    value={value}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        rates: { ...settings.rates, [key]: parseInt(e.target.value) || 0 },
                      })
                    }
                  />
                </div>
              ))}
            </div>
            <Button onClick={() => saveSettings("rates", settings.rates)} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Save className="w-4 h-4 mr-2" />
              Save Rates
            </Button>
          </CardContent>
        </Card>

        {/* Features Section */}
        <Card className="gaming-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              <CardTitle>Server Features</CardTitle>
            </div>
            <CardDescription>Toggle features and settings displayed on the website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max_enchant">Max Enchant</Label>
                <Input
                  id="max_enchant"
                  value={settings.features.max_enchant}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      features: { ...settings.features, max_enchant: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="safe_enchant">Safe Enchant</Label>
                <Input
                  id="safe_enchant"
                  value={settings.features.safe_enchant}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      features: { ...settings.features, safe_enchant: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_level">Max Level</Label>
                <Input
                  id="max_level"
                  type="number"
                  value={settings.features.max_level}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      features: { ...settings.features, max_level: parseInt(e.target.value) || 85 },
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
              {[
                { key: "subclass_without_quest", label: "Subclass Without Quest" },
                { key: "free_teleport", label: "Free Teleport" },
                { key: "global_gk", label: "Global Gatekeeper" },
                { key: "auto_learn_skills", label: "Auto Learn Skills" },
                { key: "custom_weapons", label: "Custom Weapons" },
                { key: "custom_armors", label: "Custom Armors" },
              ].map((feature) => (
                <div key={feature.key} className="flex items-center space-x-2">
                  <Switch
                    id={feature.key}
                    checked={(settings.features as any)[feature.key]}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        features: { ...settings.features, [feature.key]: checked },
                      })
                    }
                  />
                  <Label htmlFor={feature.key}>{feature.label}</Label>
                </div>
              ))}
            </div>
            <Button onClick={() => saveSettings("features", settings.features)} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Save className="w-4 h-4 mr-2" />
              Save Features
            </Button>
          </CardContent>
        </Card>

        {/* Discord Section */}
        <Card className="gaming-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <CardTitle>Discord Integration</CardTitle>
            </div>
            <CardDescription>Configure Discord invite link and widget</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discord_invite">Discord Invite URL</Label>
                <Input
                  id="discord_invite"
                  value={settings.discord.invite_url}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      discord: { ...settings.discord, invite_url: e.target.value },
                    })
                  }
                  placeholder="https://discord.gg/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discord_widget">Discord Widget ID (optional)</Label>
                <Input
                  id="discord_widget"
                  value={settings.discord.widget_id}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      discord: { ...settings.discord, widget_id: e.target.value },
                    })
                  }
                  placeholder="Server ID for widget"
                />
              </div>
            </div>
            <Button onClick={() => saveSettings("discord", settings.discord)} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Save className="w-4 h-4 mr-2" />
              Save Discord Settings
            </Button>
          </CardContent>
        </Card>

        {/* Siege Section */}
        <Card className="gaming-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Castle className="w-5 h-5 text-primary" />
              <CardTitle>Siege Settings</CardTitle>
            </div>
            <CardDescription>Configure castle siege schedule displayed on the website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siege_schedule">Siege Schedule</Label>
              <Input
                id="siege_schedule"
                value={settings.siege.schedule}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    siege: { ...settings.siege, schedule: e.target.value },
                  })
                }
                placeholder="Every Sunday 20:00 GMT+2"
              />
            </div>
            <Button onClick={() => saveSettings("siege", settings.siege)} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Save className="w-4 h-4 mr-2" />
              Save Siege Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
