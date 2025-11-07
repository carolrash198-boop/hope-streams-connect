import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Sermons = () => {
  const [sermons, setSermons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSermon, setEditingSermon] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    preacher: "",
    date: "",
    slug: "",
    video_url: "",
    audio_url: "",
    show_notes: "",
    is_published: true,
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    const { data, error } = await supabase
      .from("sermons")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      toast.error("Failed to load sermons");
    } else {
      setSermons(data || []);
    }
  };

  const uploadFile = async (file: File, type: 'video' | 'audio') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${type}s/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('sermon-media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('sermon-media')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let videoUrl = formData.video_url;
      let audioUrl = formData.audio_url;

      // Upload video file if selected
      if (videoFile) {
        setUploadingVideo(true);
        videoUrl = await uploadFile(videoFile, 'video');
        setUploadingVideo(false);
      }

      // Upload audio file if selected
      if (audioFile) {
        setUploadingAudio(true);
        audioUrl = await uploadFile(audioFile, 'audio');
        setUploadingAudio(false);
      }

      const dataToSave = {
        ...formData,
        video_url: videoUrl,
        audio_url: audioUrl,
      };

      if (editingSermon) {
        const { error } = await supabase
          .from("sermons")
          .update(dataToSave)
          .eq("id", editingSermon.id);

        if (error) throw error;
        toast.success("Sermon updated successfully");
      } else {
        const { error } = await supabase
          .from("sermons")
          .insert([dataToSave]);

        if (error) throw error;
        toast.success("Sermon created successfully");
      }

      setDialogOpen(false);
      resetForm();
      fetchSermons();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      setUploadingVideo(false);
      setUploadingAudio(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sermon?")) return;

    const { error } = await supabase
      .from("sermons")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete sermon");
    } else {
      toast.success("Sermon deleted successfully");
      fetchSermons();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      preacher: "",
      date: "",
      slug: "",
      video_url: "",
      audio_url: "",
      show_notes: "",
      is_published: true,
    });
    setEditingSermon(null);
    setVideoFile(null);
    setAudioFile(null);
  };

  const handleEdit = (sermon: any) => {
    setEditingSermon(sermon);
    setFormData({
      title: sermon.title,
      preacher: sermon.preacher,
      date: sermon.date,
      slug: sermon.slug,
      video_url: sermon.video_url || "",
      audio_url: sermon.audio_url || "",
      show_notes: sermon.show_notes || "",
      is_published: sermon.is_published,
    });
    setDialogOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-muted/10">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Sermons Management</h1>
            <p className="text-muted-foreground">Create and manage sermons</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Add Sermon
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingSermon ? "Edit Sermon" : "Create New Sermon"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="preacher">Preacher</Label>
                  <Input
                    id="preacher"
                    value={formData.preacher}
                    onChange={(e) => setFormData({ ...formData, preacher: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Video</Label>
                  <Tabs defaultValue="url" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="url">Enter URL</TabsTrigger>
                      <TabsTrigger value="upload">Upload File</TabsTrigger>
                    </TabsList>
                    <TabsContent value="url">
                      <Input
                        placeholder="https://youtube.com/watch?v=..."
                        value={formData.video_url}
                        onChange={(e) => {
                          setFormData({ ...formData, video_url: e.target.value });
                          setVideoFile(null);
                        }}
                      />
                    </TabsContent>
                    <TabsContent value="upload">
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="video/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setVideoFile(file);
                              setFormData({ ...formData, video_url: "" });
                            }
                          }}
                        />
                        {videoFile && (
                          <span className="text-sm text-muted-foreground">
                            {videoFile.name}
                          </span>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                  {uploadingVideo && (
                    <p className="text-sm text-muted-foreground mt-2">Uploading video...</p>
                  )}
                </div>
                <div>
                  <Label>Audio</Label>
                  <Tabs defaultValue="url" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="url">Enter URL</TabsTrigger>
                      <TabsTrigger value="upload">Upload File</TabsTrigger>
                    </TabsList>
                    <TabsContent value="url">
                      <Input
                        placeholder="https://example.com/audio.mp3"
                        value={formData.audio_url}
                        onChange={(e) => {
                          setFormData({ ...formData, audio_url: e.target.value });
                          setAudioFile(null);
                        }}
                      />
                    </TabsContent>
                    <TabsContent value="upload">
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setAudioFile(file);
                              setFormData({ ...formData, audio_url: "" });
                            }
                          }}
                        />
                        {audioFile && (
                          <span className="text-sm text-muted-foreground">
                            {audioFile.name}
                          </span>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                  {uploadingAudio && (
                    <p className="text-sm text-muted-foreground mt-2">Uploading audio...</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="show_notes">Show Notes</Label>
                  <Textarea
                    id="show_notes"
                    value={formData.show_notes}
                    onChange={(e) => setFormData({ ...formData, show_notes: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  />
                  <Label htmlFor="is_published">Published</Label>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingSermon ? "Update Sermon" : "Create Sermon"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {sermons.map((sermon) => (
            <Card key={sermon.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{sermon.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      By {sermon.preacher} • {new Date(sermon.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Status: {sermon.is_published ? "Published" : "Draft"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(sermon)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(sermon.id)}>
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

export default Sermons;
