import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Save, Plus, Trash2, FileText, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TreasureReward {
  item: string;
  chance: string;
}

interface CardItem {
  title: string;
  items: string[];
}

interface DescriptionSection {
  id: string;
  type: "table" | "cards" | "treasure";
  title: string;
  highlight: string;
  icon: string;
  headers?: string[];
  rows?: string[][];
  cards?: CardItem[];
  footer_notes?: string[];
  // Treasure-specific
  description?: string;
  chest_name?: string;
  rewards?: TreasureReward[];
}

interface DescriptionContent {
  hero_title: string;
  hero_highlight: string;
  sections: DescriptionSection[];
  bottom_note: string;
}

const defaultContent: DescriptionContent = {
  hero_title: "DESCRIPTION",
  hero_highlight: "L2 ALLSTARS",
  sections: [],
  bottom_note: "Until and after the server opening some changes can be made. Stay tuned.",
};

export default function AdminDescription() {
  const { isAdmin, isLoading: authLoading } = useAdminAuth();
  const [content, setContent] = useState<DescriptionContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin) fetchContent();
  }, [isAdmin]);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from("server_settings")
        .select("value")
        .eq("key", "description_content")
        .single();
      if (error) throw error;
      if (data?.value) {
        setContent(data.value as unknown as DescriptionContent);
      }
    } catch (error) {
      console.error("Error fetching description content:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("server_settings")
        .upsert({
          key: "description_content",
          value: content as any,
          updated_at: new Date().toISOString(),
        }, { onConflict: "key" });
      if (error) throw error;
      toast({ title: "Success", description: "Description page saved successfully" });
    } catch (error) {
      console.error("Error saving:", error);
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (sectionId: string, updates: Partial<DescriptionSection>) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === sectionId ? { ...s, ...updates } : s),
    }));
  };

  const updateTableCell = (sectionId: string, rowIdx: number, colIdx: number, value: string) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id !== sectionId || !s.rows) return s;
        const newRows = s.rows.map((row, ri) =>
          ri === rowIdx ? row.map((cell, ci) => (ci === colIdx ? value : cell)) : [...row]
        );
        return { ...s, rows: newRows };
      }),
    }));
  };

  const addTableRow = (sectionId: string) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id !== sectionId || !s.rows || !s.headers) return s;
        return { ...s, rows: [...s.rows, s.headers.map(() => "")] };
      }),
    }));
  };

  const removeTableRow = (sectionId: string, rowIdx: number) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id !== sectionId || !s.rows) return s;
        return { ...s, rows: s.rows.filter((_, i) => i !== rowIdx) };
      }),
    }));
  };

  const updateCardItem = (sectionId: string, cardIdx: number, itemIdx: number, value: string) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id !== sectionId || !s.cards) return s;
        const newCards = s.cards.map((card, ci) =>
          ci === cardIdx
            ? { ...card, items: card.items.map((item, ii) => (ii === itemIdx ? value : item)) }
            : card
        );
        return { ...s, cards: newCards };
      }),
    }));
  };

  const addCardItem = (sectionId: string, cardIdx: number) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id !== sectionId || !s.cards) return s;
        const newCards = s.cards.map((card, ci) =>
          ci === cardIdx ? { ...card, items: [...card.items, ""] } : card
        );
        return { ...s, cards: newCards };
      }),
    }));
  };

  const removeCardItem = (sectionId: string, cardIdx: number, itemIdx: number) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id !== sectionId || !s.cards) return s;
        const newCards = s.cards.map((card, ci) =>
          ci === cardIdx ? { ...card, items: card.items.filter((_, ii) => ii !== itemIdx) } : card
        );
        return { ...s, cards: newCards };
      }),
    }));
  };

  const updateFooterNote = (sectionId: string, idx: number, value: string) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id !== sectionId) return s;
        const notes = [...(s.footer_notes || [])];
        notes[idx] = value;
        return { ...s, footer_notes: notes };
      }),
    }));
  };

  const addFooterNote = (sectionId: string) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId ? { ...s, footer_notes: [...(s.footer_notes || []), ""] } : s
      ),
    }));
  };

  const removeFooterNote = (sectionId: string, idx: number) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? { ...s, footer_notes: (s.footer_notes || []).filter((_, i) => i !== idx) }
          : s
      ),
    }));
  };

  const updateTreasureReward = (sectionId: string, idx: number, field: keyof TreasureReward, value: string) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id !== sectionId || !s.rewards) return s;
        const newRewards = s.rewards.map((r, i) => (i === idx ? { ...r, [field]: value } : r));
        return { ...s, rewards: newRewards };
      }),
    }));
  };

  const addTreasureReward = (sectionId: string) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? { ...s, rewards: [...(s.rewards || []), { item: "", chance: "Low chance" }] }
          : s
      ),
    }));
  };

  const removeTreasureReward = (sectionId: string, idx: number) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId ? { ...s, rewards: (s.rewards || []).filter((_, i) => i !== idx) } : s
      ),
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
            <h1 className="font-display text-3xl font-bold text-gradient-gold">Description Page</h1>
            <p className="text-muted-foreground mt-1">Edit all content displayed on the /description page</p>
          </div>
          <Button onClick={saveContent} disabled={saving} size="lg" className="btn-glow">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save All Changes
          </Button>
        </div>

        {/* Hero Section */}
        <Card className="gaming-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Hero Section
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={content.hero_title}
                  onChange={(e) => setContent(prev => ({ ...prev, hero_title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Highlighted Text (gold)</Label>
                <Input
                  value={content.hero_highlight}
                  onChange={(e) => setContent(prev => ({ ...prev, hero_highlight: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Bottom Page Note</Label>
              <Input
                value={content.bottom_note}
                onChange={(e) => setContent(prev => ({ ...prev, bottom_note: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        {content.sections.map((section) => (
          <Card key={section.id} className="gaming-card">
            <CardHeader
              className="cursor-pointer hover:bg-muted/20 transition-colors"
              onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <span>{section.title} {section.highlight}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary font-sans">
                    {section.type}
                  </span>
                </CardTitle>
                <span className="text-muted-foreground text-sm">
                  {expandedSection === section.id ? "▲ Collapse" : "▼ Expand"}
                </span>
              </div>
              <CardDescription>
                {section.type === "table" && `${section.rows?.length || 0} rows`}
                {section.type === "cards" && `${section.cards?.length || 0} cards`}
                {section.type === "treasure" && `${section.rewards?.length || 0} rewards`}
              </CardDescription>
            </CardHeader>

            {expandedSection === section.id && (
              <CardContent className="space-y-4">
                {/* Title editing */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Section Title</Label>
                    <Input
                      value={section.title}
                      onChange={(e) => updateSection(section.id, { title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Highlighted Text (gold)</Label>
                    <Input
                      value={section.highlight}
                      onChange={(e) => updateSection(section.id, { highlight: e.target.value })}
                    />
                  </div>
                </div>

                {/* TABLE type */}
                {section.type === "table" && section.rows && (
                  <div className="space-y-3">
                    <Label className="text-primary">Table Content</Label>
                    {/* Headers */}
                    <div className="flex gap-2 items-center">
                      {section.headers?.map((h, hi) => (
                        <Input
                          key={hi}
                          value={h}
                          onChange={(e) => {
                            const newHeaders = [...(section.headers || [])];
                            newHeaders[hi] = e.target.value;
                            updateSection(section.id, { headers: newHeaders });
                          }}
                          className="font-bold text-xs"
                          placeholder={`Header ${hi + 1}`}
                        />
                      ))}
                    </div>
                    {/* Rows */}
                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                      {section.rows.map((row, ri) => (
                        <div key={ri} className="flex gap-2 items-center">
                          <span className="text-xs text-muted-foreground w-6 text-right flex-shrink-0">{ri + 1}</span>
                          {row.map((cell, ci) => (
                            <Input
                              key={ci}
                              value={cell}
                              onChange={(e) => updateTableCell(section.id, ri, ci, e.target.value)}
                              className="text-xs"
                            />
                          ))}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="flex-shrink-0 text-destructive hover:text-destructive"
                            onClick={() => removeTableRow(section.id, ri)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => addTableRow(section.id)}>
                      <Plus className="w-3 h-3 mr-1" /> Add Row
                    </Button>
                  </div>
                )}

                {/* CARDS type */}
                {section.type === "cards" && section.cards && (
                  <div className="space-y-4">
                    <Label className="text-primary">Cards Content</Label>
                    {section.cards.map((card, ci) => (
                      <div key={ci} className="border border-border rounded-lg p-4 space-y-3">
                        <div className="space-y-2">
                          <Label>Card Title</Label>
                          <Input
                            value={card.title}
                            onChange={(e) => {
                              const newCards = section.cards!.map((c, i) =>
                                i === ci ? { ...c, title: e.target.value } : c
                              );
                              updateSection(section.id, { cards: newCards });
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Items</Label>
                          {card.items.map((item, ii) => (
                            <div key={ii} className="flex gap-2 items-center">
                              <Input
                                value={item}
                                onChange={(e) => updateCardItem(section.id, ci, ii, e.target.value)}
                                className="text-xs"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="flex-shrink-0 text-destructive hover:text-destructive"
                                onClick={() => removeCardItem(section.id, ci, ii)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                          <Button variant="outline" size="sm" onClick={() => addCardItem(section.id, ci)}>
                            <Plus className="w-3 h-3 mr-1" /> Add Item
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TREASURE type */}
                {section.type === "treasure" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Description Text</Label>
                      <Textarea
                        value={section.description || ""}
                        onChange={(e) => updateSection(section.id, { description: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Chest Name</Label>
                      <Input
                        value={section.chest_name || ""}
                        onChange={(e) => updateSection(section.id, { chest_name: e.target.value })}
                      />
                    </div>
                    <Label className="text-primary">Rewards</Label>
                    {section.rewards?.map((reward, ri) => (
                      <div key={ri} className="flex gap-2 items-center">
                        <Input
                          value={reward.item}
                          onChange={(e) => updateTreasureReward(section.id, ri, "item", e.target.value)}
                          placeholder="Item name"
                        />
                        <select
                          value={reward.chance}
                          onChange={(e) => updateTreasureReward(section.id, ri, "chance", e.target.value)}
                          className="px-3 py-2 rounded-md bg-input border border-border text-foreground text-sm font-sans"
                        >
                          <option value="Low chance">Low chance</option>
                          <option value="Average chance">Average chance</option>
                          <option value="High chance">High chance</option>
                        </select>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0 text-destructive hover:text-destructive"
                          onClick={() => removeTreasureReward(section.id, ri)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => addTreasureReward(section.id)}>
                      <Plus className="w-3 h-3 mr-1" /> Add Reward
                    </Button>
                  </div>
                )}

                {/* Footer Notes */}
                <div className="space-y-2 pt-4 border-t border-border">
                  <Label className="text-muted-foreground">Footer Notes (shown below section)</Label>
                  {(section.footer_notes || []).map((note, ni) => (
                    <div key={ni} className="flex gap-2 items-center">
                      <Input
                        value={note}
                        onChange={(e) => updateFooterNote(section.id, ni, e.target.value)}
                        className="text-xs"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0 text-destructive hover:text-destructive"
                        onClick={() => removeFooterNote(section.id, ni)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => addFooterNote(section.id)}>
                    <Plus className="w-3 h-3 mr-1" /> Add Note
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        {/* Save button bottom */}
        <div className="flex justify-end pt-4">
          <Button onClick={saveContent} disabled={saving} size="lg" className="btn-glow">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save All Changes
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
