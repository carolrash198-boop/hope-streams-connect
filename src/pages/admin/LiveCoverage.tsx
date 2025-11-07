import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Video } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

interface LiveCoverage {
  id: string;
  service_name: string;
  service_time: string;
  youtube_url: string | null;
  facebook_url: string | null;
  how_to_watch_title: string;
  how_to_watch_steps: string[];
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export default function LiveCoverage() {
  const [coverages, setCoverages] = useState<LiveCoverage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    service_name: "",
    service_time: "",
    youtube_url: "",
    facebook_url: "",
    how_to_watch_title: "How to Watch",
    how_to_watch_steps: ["Visit our website", "Click on the Watch Live button", "Enjoy the service"],
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    fetchCoverages();
  }, []);

  const fetchCoverages = async () => {
    try {
      const { data, error } = await supabase
        .from('live_stream_settings')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCoverages(data || []);
    } catch (error) {
      console.error('Error fetching live coverages:', error);
      toast.error('Failed to load live coverages');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const dataToSubmit = {
        ...formData,
        youtube_url: formData.youtube_url || null,
        facebook_url: formData.facebook_url || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from('live_stream_settings')
          .update(dataToSubmit)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Live coverage updated successfully');
      } else {
        const { error } = await supabase
          .from('live_stream_settings')
          .insert([dataToSubmit]);

        if (error) throw error;
        toast.success('Live coverage created successfully');
      }

      setDialogOpen(false);
      resetForm();
      fetchCoverages();
    } catch (error) {
      console.error('Error saving live coverage:', error);
      toast.error('Failed to save live coverage');
    }
  };

  const handleEdit = (coverage: LiveCoverage) => {
    setEditingId(coverage.id);
    setFormData({
      service_name: coverage.service_name,
      service_time: coverage.service_time,
      youtube_url: coverage.youtube_url || "",
      facebook_url: coverage.facebook_url || "",
      how_to_watch_title: coverage.how_to_watch_title,
      how_to_watch_steps: coverage.how_to_watch_steps,
      is_active: coverage.is_active,
      display_order: coverage.display_order,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this live coverage?')) return;

    try {
      const { error } = await supabase
        .from('live_stream_settings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Live coverage deleted successfully');
      fetchCoverages();
    } catch (error) {
      console.error('Error deleting live coverage:', error);
      toast.error('Failed to delete live coverage');
    }
  };

  const resetForm = () => {
    setFormData({
      service_name: "",
      service_time: "",
      youtube_url: "",
      facebook_url: "",
      how_to_watch_title: "How to Watch",
      how_to_watch_steps: ["Visit our website", "Click on the Watch Live button", "Enjoy the service"],
      is_active: true,
      display_order: 0,
    });
    setEditingId(null);
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...formData.how_to_watch_steps];
    newSteps[index] = value;
    setFormData({ ...formData, how_to_watch_steps: newSteps });
  };

  const addStep = () => {
    setFormData({
      ...formData,
      how_to_watch_steps: [...formData.how_to_watch_steps, ""],
    });
  };

  const removeStep = (index: number) => {
    const newSteps = formData.how_to_watch_steps.filter((_, i) => i !== index);
    setFormData({ ...formData, how_to_watch_steps: newSteps });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Live Coverage Management</h1>
          <p className="text-muted-foreground">Manage live stream settings and schedules</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Live Coverage
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit' : 'Add'} Live Coverage</DialogTitle>
              <DialogDescription>
                Configure live stream settings for your services
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="service_name">Service Name *</Label>
                  <Input
                    id="service_name"
                    value={formData.service_name}
                    onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="service_time">Service Time *</Label>
                  <Input
                    id="service_time"
                    value={formData.service_time}
                    onChange={(e) => setFormData({ ...formData, service_time: e.target.value })}
                    placeholder="e.g., Sunday 9:00 AM"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="youtube_url">YouTube URL</Label>
                <Input
                  id="youtube_url"
                  type="url"
                  value={formData.youtube_url}
                  onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                  placeholder="https://youtube.com/..."
                />
              </div>

              <div>
                <Label htmlFor="facebook_url">Facebook URL</Label>
                <Input
                  id="facebook_url"
                  type="url"
                  value={formData.facebook_url}
                  onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div>
                <Label htmlFor="how_to_watch_title">How to Watch Title</Label>
                <Input
                  id="how_to_watch_title"
                  value={formData.how_to_watch_title}
                  onChange={(e) => setFormData({ ...formData, how_to_watch_title: e.target.value })}
                />
              </div>

              <div>
                <Label>How to Watch Steps</Label>
                <div className="space-y-2 mt-2">
                  {formData.how_to_watch_steps.map((step, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={step}
                        onChange={(e) => handleStepChange(index, e.target.value)}
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
                  <Button type="button" variant="outline" onClick={addStep}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Step
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  />
                </div>
                <div className="flex items-center space-x-2 mt-8">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingId ? 'Update' : 'Create'} Live Coverage
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : coverages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Video className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Live Coverage Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start by adding your first live stream configuration
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coverages.map((coverage) => (
            <Card key={coverage.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {coverage.service_name}
                      {!coverage.is_active && (
                        <span className="text-xs bg-muted px-2 py-1 rounded">Inactive</span>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{coverage.service_time}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(coverage)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(coverage.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {coverage.youtube_url && (
                    <div>
                      <p className="text-sm font-medium">YouTube URL</p>
                      <p className="text-sm text-muted-foreground truncate">{coverage.youtube_url}</p>
                    </div>
                  )}
                  {coverage.facebook_url && (
                    <div>
                      <p className="text-sm font-medium">Facebook URL</p>
                      <p className="text-sm text-muted-foreground truncate">{coverage.facebook_url}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">{coverage.how_to_watch_title}</p>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      {coverage.how_to_watch_steps.map((step, index) => (
                        <li key={index}>• {step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
