import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const LiveStream = () => {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    service_name: "",
    service_time: "",
    youtube_url: "",
    facebook_url: "",
    how_to_watch_title: "How to Watch",
    how_to_watch_steps: ["", "", ""],
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("live_stream_settings")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast.error("Failed to load settings");
    } else {
      setSettings(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSave = {
        ...formData,
        how_to_watch_steps: formData.how_to_watch_steps.filter(step => step.trim() !== ""),
      };

      if (editingItem) {
        const { error } = await supabase
          .from("live_stream_settings")
          .update(dataToSave)
          .eq("id", editingItem.id);

        if (error) throw error;
        toast.success("Settings updated successfully");
      } else {
        const { error } = await supabase
          .from("live_stream_settings")
          .insert([dataToSave]);

        if (error) throw error;
        toast.success("Settings created successfully");
      }

      setDialogOpen(false);
      resetForm();
      fetchSettings();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this setting?")) return;

    const { error } = await supabase
      .from("live_stream_settings")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete setting");
    } else {
      toast.success("Setting deleted successfully");
      fetchSettings();
    }
  };

  const resetForm = () => {
    setFormData({
      service_name: "",
      service_time: "",
      youtube_url: "",
      facebook_url: "",
      how_to_watch_title: "How to Watch",
      how_to_watch_steps: ["", "", ""],
      is_active: true,
      display_order: 0,
    });
    setEditingItem(null);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      service_name: item.service_name,
      service_time: item.service_time,
      youtube_url: item.youtube_url || "",
      facebook_url: item.facebook_url || "",
      how_to_watch_title: item.how_to_watch_title || "How to Watch",
      how_to_watch_steps: item.how_to_watch_steps || ["", "", ""],
      is_active: item.is_active,
      display_order: item.display_order,
    });
    setDialogOpen(true);
  };

  const updateStepAtIndex = (index: number, value: string) => {
    const newSteps = [...formData.how_to_watch_steps];
    newSteps[index] = value;
    setFormData({ ...formData, how_to_watch_steps: newSteps });
  };

  const addStep = () => {
    setFormData({ 
      ...formData, 
      how_to_watch_steps: [...formData.how_to_watch_steps, ""] 
    });
  };

  const removeStep = (index: number) => {
    const newSteps = formData.how_to_watch_steps.filter((_, i) => i !== index);
    setFormData({ ...formData, how_to_watch_steps: newSteps });
  };

  return (
    <div className="flex min-h-screen bg-muted/10">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Live Stream Settings</h1>
            <p className="text-muted-foreground">Manage service times and streaming links</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit Service" : "Create New Service"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="service_name">Service Name</Label>
                  <Input
                    id="service_name"
                    value={formData.service_name}
                    onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                    placeholder="Sunday Morning Service"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="service_time">Service Time</Label>
                  <Input
                    id="service_time"
                    value={formData.service_time}
                    onChange={(e) => setFormData({ ...formData, service_time: e.target.value })}
                    placeholder="Sundays at 10:00 AM EST"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="youtube_url">YouTube URL</Label>
                  <Input
                    id="youtube_url"
                    value={formData.youtube_url}
                    onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                    placeholder="https://youtube.com/@yourchannel/live"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook_url">Facebook URL</Label>
                  <Input
                    id="facebook_url"
                    value={formData.facebook_url}
                    onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                    placeholder="https://facebook.com/yourpage/live"
                  />
                </div>
                <div>
                  <Label htmlFor="how_to_watch_title">How to Watch Section Title</Label>
                  <Input
                    id="how_to_watch_title"
                    value={formData.how_to_watch_title}
                    onChange={(e) => setFormData({ ...formData, how_to_watch_title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>How to Watch Steps</Label>
                  <div className="space-y-2 mt-2">
                    {formData.how_to_watch_steps.map((step, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={step}
                          onChange={(e) => updateStepAtIndex(index, e.target.value)}
                          placeholder={`Step ${index + 1}`}
                        />
                        {formData.how_to_watch_steps.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeStep(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addStep}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Step
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingItem ? "Update Service" : "Create Service"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {settings.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-xl font-semibold">{item.service_name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{item.service_time}</p>
                    <div className="space-y-1 text-sm">
                      {item.youtube_url && (
                        <p className="text-muted-foreground">YouTube: {item.youtube_url}</p>
                      )}
                      {item.facebook_url && (
                        <p className="text-muted-foreground">Facebook: {item.facebook_url}</p>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Status: {item.is_active ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveStream;
