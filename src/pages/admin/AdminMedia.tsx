import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Pencil, Trash2, Star, Image, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MediaItem {
  id: string;
  title: string;
  media_type: string;
  url: string;
  thumbnail_url: string | null;
  description: string | null;
  sort_order: number;
  is_featured: boolean;
}

const mediaTypes = ["screenshot", "video"];

export default function AdminMedia() {
  const { isAdmin, isLoading: authLoading } = useAdminAuth();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    media_type: "screenshot",
    url: "",
    thumbnail_url: "",
    description: "",
    sort_order: 0,
    is_featured: false,
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchMedia = async () => {
    try {
      const { data, error } = await supabase
        .from("media")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setMedia(data || []);
    } catch (error) {
      console.error("Error fetching media:", error);
      toast({ title: "Error", description: "Failed to fetch media", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchMedia();
    }
  }, [isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingItem) {
        const { error } = await supabase
          .from("media")
          .update({
            title: formData.title,
            media_type: formData.media_type,
            url: formData.url,
            thumbnail_url: formData.thumbnail_url || null,
            description: formData.description || null,
            sort_order: formData.sort_order,
            is_featured: formData.is_featured,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingItem.id);

        if (error) throw error;
        toast({ title: "Success", description: "Media updated successfully" });
      } else {
        const { error } = await supabase.from("media").insert({
          title: formData.title,
          media_type: formData.media_type,
          url: formData.url,
          thumbnail_url: formData.thumbnail_url || null,
          description: formData.description || null,
          sort_order: formData.sort_order,
          is_featured: formData.is_featured,
        });

        if (error) throw error;
        toast({ title: "Success", description: "Media created successfully" });
      }

      setDialogOpen(false);
      setEditingItem(null);
      resetForm();
      fetchMedia();
    } catch (error) {
      console.error("Error saving media:", error);
      toast({ title: "Error", description: "Failed to save media", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      media_type: "screenshot",
      url: "",
      thumbnail_url: "",
      description: "",
      sort_order: 0,
      is_featured: false,
    });
  };

  const handleEdit = (item: MediaItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      media_type: item.media_type,
      url: item.url,
      thumbnail_url: item.thumbnail_url || "",
      description: item.description || "",
      sort_order: item.sort_order,
      is_featured: item.is_featured,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media item?")) return;

    try {
      const { error } = await supabase.from("media").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Success", description: "Media deleted successfully" });
      fetchMedia();
    } catch (error) {
      console.error("Error deleting media:", error);
      toast({ title: "Error", description: "Failed to delete media", variant: "destructive" });
    }
  };

  const openNewDialog = () => {
    setEditingItem(null);
    resetForm();
    setDialogOpen(true);
  };

  if (authLoading) {
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-gradient-gold">Media Gallery</h1>
            <p className="text-muted-foreground mt-1">Manage screenshots and videos</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-glow" onClick={openNewDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Media
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit Media" : "Add Media"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Epic Castle Siege"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="media_type">Type</Label>
                  <Select
                    value={formData.media_type}
                    onValueChange={(value) => setFormData({ ...formData, media_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mediaTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">
                    {formData.media_type === "video" ? "Video URL (YouTube/Embed)" : "Image URL"}
                  </Label>
                  <Input
                    id="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://..."
                    required
                  />
                </div>
                {formData.media_type === "video" && (
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail_url">Thumbnail URL (optional)</Label>
                    <Input
                      id="thumbnail_url"
                      value={formData.thumbnail_url}
                      onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sort_order">Sort Order</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Checkbox
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_featured: !!checked })}
                    />
                    <Label htmlFor="is_featured">Featured</Label>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {editingItem ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Media Grid */}
        <Card className="gaming-card">
          <CardContent className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : media.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No media yet. Add your first screenshot or video!
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {media.map((item) => (
                  <div
                    key={item.id}
                    className="relative group rounded-lg overflow-hidden bg-muted aspect-video"
                  >
                    {item.media_type === "screenshot" ? (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Play className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <p className="text-sm font-medium text-center px-2">{item.title}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => handleEdit(item)}>
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Featured badge */}
                    {item.is_featured && (
                      <div className="absolute top-2 right-2">
                        <Star className="w-4 h-4 text-primary fill-primary" />
                      </div>
                    )}

                    {/* Type badge */}
                    <div className="absolute top-2 left-2">
                      {item.media_type === "video" ? (
                        <Play className="w-4 h-4 text-white bg-black/50 rounded p-0.5" />
                      ) : (
                        <Image className="w-4 h-4 text-white bg-black/50 rounded p-0.5" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
