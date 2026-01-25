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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, Pencil, Trash2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DownloadItem {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_size: string | null;
  icon: string | null;
  download_type: string;
  is_primary: boolean;
  sort_order: number;
}

const downloadTypes = ["client", "patch", "updater", "addon", "other"];

export default function AdminDownloads() {
  const { isAdmin, isLoading: authLoading } = useAdminAuth();
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DownloadItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file_url: "",
    file_size: "",
    download_type: "client",
    is_primary: false,
    sort_order: 0,
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchDownloads = async () => {
    try {
      const { data, error } = await supabase
        .from("downloads")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setDownloads(data || []);
    } catch (error) {
      console.error("Error fetching downloads:", error);
      toast({ title: "Error", description: "Failed to fetch downloads", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchDownloads();
    }
  }, [isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingItem) {
        const { error } = await supabase
          .from("downloads")
          .update({
            title: formData.title,
            description: formData.description || null,
            file_url: formData.file_url,
            file_size: formData.file_size || null,
            download_type: formData.download_type,
            is_primary: formData.is_primary,
            sort_order: formData.sort_order,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingItem.id);

        if (error) throw error;
        toast({ title: "Success", description: "Download updated successfully" });
      } else {
        const { error } = await supabase.from("downloads").insert({
          title: formData.title,
          description: formData.description || null,
          file_url: formData.file_url,
          file_size: formData.file_size || null,
          download_type: formData.download_type,
          is_primary: formData.is_primary,
          sort_order: formData.sort_order,
        });

        if (error) throw error;
        toast({ title: "Success", description: "Download created successfully" });
      }

      setDialogOpen(false);
      setEditingItem(null);
      resetForm();
      fetchDownloads();
    } catch (error) {
      console.error("Error saving download:", error);
      toast({ title: "Error", description: "Failed to save download", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      file_url: "",
      file_size: "",
      download_type: "client",
      is_primary: false,
      sort_order: 0,
    });
  };

  const handleEdit = (item: DownloadItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      file_url: item.file_url,
      file_size: item.file_size || "",
      download_type: item.download_type,
      is_primary: item.is_primary,
      sort_order: item.sort_order,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this download?")) return;

    try {
      const { error } = await supabase.from("downloads").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Success", description: "Download deleted successfully" });
      fetchDownloads();
    } catch (error) {
      console.error("Error deleting download:", error);
      toast({ title: "Error", description: "Failed to delete download", variant: "destructive" });
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
            <h1 className="font-display text-3xl font-bold text-gradient-gold">Downloads Management</h1>
            <p className="text-muted-foreground mt-1">Manage client, patch, and updater downloads</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-glow" onClick={openNewDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Download
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit Download" : "Add Download"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Full Game Client"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Complete High Five client with all game files"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="file_url">Download URL</Label>
                    <Input
                      id="file_url"
                      value={formData.file_url}
                      onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                      placeholder="https://..."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file_size">File Size</Label>
                    <Input
                      id="file_size"
                      value={formData.file_size}
                      onChange={(e) => setFormData({ ...formData, file_size: e.target.value })}
                      placeholder="4.2 GB"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="download_type">Type</Label>
                    <Select
                      value={formData.download_type}
                      onValueChange={(value) => setFormData({ ...formData, download_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {downloadTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sort_order">Sort Order</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_primary"
                    checked={formData.is_primary}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_primary: !!checked })}
                  />
                  <Label htmlFor="is_primary">Primary Download (highlighted)</Label>
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

        {/* Downloads Table */}
        <Card className="gaming-card">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : downloads.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No downloads yet. Add your first download link!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Primary</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {downloads.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded text-xs bg-secondary text-secondary-foreground">
                          {item.download_type}
                        </span>
                      </TableCell>
                      <TableCell>{item.file_size || "-"}</TableCell>
                      <TableCell>
                        {item.is_primary && <Star className="w-4 h-4 text-primary fill-primary" />}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
