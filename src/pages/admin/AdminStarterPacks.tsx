import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, Package, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { defaultServerSettings, type StarterPackConfig, type StarterPackItemConfig } from "@/lib/serverSettings";
import { ITEM_ICON_REGISTRY, VALUE_COLOR_OPTIONS, getItemIconSrc, getBadgeSrc } from "@/lib/starterPackIcons";

const PACK_LABELS: Record<string, string> = {
  basic: "BASIC",
  improved: "IMPROVED",
  premium: "PREMIUM",
  elite: "ELITE",
};

const PACK_ACCENT: Record<string, string> = {
  basic: "border-zinc-500/50",
  improved: "border-amber-600/50",
  premium: "border-yellow-500/50",
  elite: "border-red-500/50",
};

export default function AdminStarterPacks() {
  const { isAdmin, isLoading: authLoading } = useAdminAuth();
  const [packs, setPacks] = useState<StarterPackConfig[]>(defaultServerSettings.starter_packs);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin) fetchPacks();
  }, [isAdmin]);

  const fetchPacks = async () => {
    try {
      const { data, error } = await supabase
        .from("server_settings")
        .select("value")
        .eq("key", "starter_packs")
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data?.value && Array.isArray(data.value)) {
        setPacks(data.value as unknown as StarterPackConfig[]);
      }
    } catch (error) {
      console.error("Error fetching starter packs:", error);
    } finally {
      setLoading(false);
    }
  };

  const savePacks = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("server_settings")
        .upsert({
          key: "starter_packs",
          value: packs as any,
          updated_at: new Date().toISOString(),
        }, { onConflict: "key" });

      if (error) throw error;
      toast({ title: "Success", description: "Starter Packs saved successfully!" });
    } catch (error) {
      console.error("Error saving starter packs:", error);
      toast({ title: "Error", description: "Failed to save starter packs", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const updatePack = (packIndex: number, updates: Partial<StarterPackConfig>) => {
    setPacks(prev => prev.map((p, i) => i === packIndex ? { ...p, ...updates } : p));
  };

  const updateItem = (packIndex: number, itemIndex: number, updates: Partial<StarterPackItemConfig>) => {
    setPacks(prev => prev.map((p, i) => {
      if (i !== packIndex) return p;
      const newItems = [...p.items];
      newItems[itemIndex] = { ...newItems[itemIndex], ...updates };
      return { ...p, items: newItems };
    }));
  };

  const addItem = (packIndex: number) => {
    setPacks(prev => prev.map((p, i) => {
      if (i !== packIndex) return p;
      return {
        ...p,
        items: [...p.items, { iconKey: "weapon", name: "New Item", value: "x1", valueColor: "text-primary" }],
      };
    }));
  };

  const removeItem = (packIndex: number, itemIndex: number) => {
    setPacks(prev => prev.map((p, i) => {
      if (i !== packIndex) return p;
      return { ...p, items: p.items.filter((_, j) => j !== itemIndex) };
    }));
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-gradient-gold">Starter Packs</h1>
            <p className="text-muted-foreground mt-1">Manage items, icons, and prices for each starter pack</p>
          </div>
          <Button onClick={savePacks} disabled={saving} size="lg">
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <Save className="w-4 h-4 mr-2" />
            Save All Changes
          </Button>
        </div>

        {packs.map((pack, packIndex) => (
          <Card key={pack.id} className={`gaming-card border-2 ${PACK_ACCENT[pack.id] || "border-border"}`}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <img src={getBadgeSrc(pack.id)} alt="" className="w-10 h-10 object-contain" />
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    {PACK_LABELS[pack.id] || pack.id.toUpperCase()} Pack
                  </CardTitle>
                  <CardDescription>Configure items and pricing</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pricing Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Original Price</Label>
                  <Input
                    value={pack.originalPrice}
                    onChange={(e) => updatePack(packIndex, { originalPrice: e.target.value })}
                    placeholder="€20.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sale Price</Label>
                  <Input
                    value={pack.salePrice}
                    onChange={(e) => updatePack(packIndex, { salePrice: e.target.value })}
                    placeholder="€9.99"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price (cents)</Label>
                  <Input
                    type="number"
                    value={pack.priceAmount}
                    onChange={(e) => updatePack(packIndex, { priceAmount: parseInt(e.target.value) || 0 })}
                    placeholder="999"
                  />
                </div>
                <div className="space-y-2">
                  <Label>L2 Item ID</Label>
                  <Input
                    type="number"
                    value={pack.itemId}
                    onChange={(e) => updatePack(packIndex, { itemId: parseInt(e.target.value) || 0 })}
                    placeholder="600623"
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Items</Label>
                  <Button variant="outline" size="sm" onClick={() => addItem(packIndex)}>
                    <Plus className="w-4 h-4 mr-1" /> Add Item
                  </Button>
                </div>

                {pack.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="grid grid-cols-[auto_1fr_1fr_auto_auto_auto] gap-3 items-center p-3 rounded-lg bg-muted/30 border border-border/50"
                  >
                    {/* Icon Preview */}
                    <img src={getItemIconSrc(item.iconKey)} alt="" className="w-8 h-8 object-contain" />

                    {/* Item Name */}
                    <Input
                      value={item.name}
                      onChange={(e) => updateItem(packIndex, itemIndex, { name: e.target.value })}
                      placeholder="Item name"
                      className="h-9"
                    />

                    {/* Value */}
                    <Input
                      value={item.value}
                      onChange={(e) => updateItem(packIndex, itemIndex, { value: e.target.value })}
                      placeholder="+16 or 7 Days"
                      className="h-9"
                    />

                    {/* Icon Select */}
                    <Select
                      value={item.iconKey}
                      onValueChange={(val) => updateItem(packIndex, itemIndex, { iconKey: val })}
                    >
                      <SelectTrigger className="w-[130px] h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ITEM_ICON_REGISTRY).map(([key, { label, src }]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <img src={src} alt="" className="w-4 h-4 object-contain" />
                              {label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Color Select */}
                    <Select
                      value={item.valueColor}
                      onValueChange={(val) => updateItem(packIndex, itemIndex, { valueColor: val })}
                    >
                      <SelectTrigger className="w-[120px] h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VALUE_COLOR_OPTIONS.map((opt) => (
                          <SelectItem key={opt.key} value={opt.key}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Delete */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-destructive hover:text-destructive"
                      onClick={() => removeItem(packIndex, itemIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
