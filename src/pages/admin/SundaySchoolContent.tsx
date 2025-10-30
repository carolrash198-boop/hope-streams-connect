import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AdminSidebar from "@/components/admin/AdminSidebar";

const SundaySchoolContent = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [curriculum, setCurriculum] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("teachers");
  const [editingItem, setEditingItem] = useState<any>(null);

  const [teacherForm, setTeacherForm] = useState({
    name: "",
    role: "",
    experience: "",
    background: "",
    bio: "",
    photo_url: ""
  });

  const [curriculumForm, setCurriculumForm] = useState({
    quarter: "",
    theme: "",
    focus: "",
    key_verses: ""
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [teachersRes, curriculumRes] = await Promise.all([
        supabase.from("sunday_school_teachers").select("*").order("display_order"),
        supabase.from("curriculum_items").select("*").order("display_order")
      ]);

      if (teachersRes.error) throw teachersRes.error;
      if (curriculumRes.error) throw curriculumRes.error;

      setTeachers(teachersRes.data || []);
      setCurriculum(curriculumRes.data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const { error } = await supabase
          .from("sunday_school_teachers")
          .update(teacherForm)
          .eq("id", editingItem.id);
        if (error) throw error;
        toast.success("Teacher updated");
      } else {
        const { error } = await supabase
          .from("sunday_school_teachers")
          .insert([teacherForm]);
        if (error) throw error;
        toast.success("Teacher added");
      }
      setDialogOpen(false);
      resetForms();
      fetchAllData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleCurriculumSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const verses = curriculumForm.key_verses.split(",").map(v => v.trim());
      const data = { ...curriculumForm, key_verses: verses };

      if (editingItem) {
        const { error } = await supabase
          .from("curriculum_items")
          .update(data)
          .eq("id", editingItem.id);
        if (error) throw error;
        toast.success("Curriculum updated");
      } else {
        const { error } = await supabase
          .from("curriculum_items")
          .insert([data]);
        if (error) throw error;
        toast.success("Curriculum added");
      }
      setDialogOpen(false);
      resetForms();
      fetchAllData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (table: string, id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const { error } = await supabase.from(table as any).delete().eq("id", id);
      if (error) throw error;
      toast.success("Item deleted");
      fetchAllData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const resetForms = () => {
    setTeacherForm({ name: "", role: "", experience: "", background: "", bio: "", photo_url: "" });
    setCurriculumForm({ quarter: "", theme: "", focus: "", key_verses: "" });
    setEditingItem(null);
  };

  const handleEdit = (item: any, type: string) => {
    setEditingItem(item);
    if (type === "teacher") {
      setTeacherForm(item);
      setActiveTab("teachers");
    } else if (type === "curriculum") {
      setCurriculumForm({ ...item, key_verses: item.key_verses?.join(", ") || "" });
      setActiveTab("curriculum");
    }
    setDialogOpen(true);
  };

  if (loading) return <div className="flex"><AdminSidebar /><div className="flex-1 p-8">Loading...</div></div>;

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Sunday School Content</h1>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForms()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Edit" : "Add"} Content</DialogTitle>
                </DialogHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="teachers">Teacher</TabsTrigger>
                    <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  </TabsList>

                  <TabsContent value="teachers">
                    <form onSubmit={handleTeacherSubmit} className="space-y-4">
                      <div>
                        <Label>Name *</Label>
                        <Input value={teacherForm.name} onChange={(e) => setTeacherForm({...teacherForm, name: e.target.value})} required />
                      </div>
                      <div>
                        <Label>Role *</Label>
                        <Input value={teacherForm.role} onChange={(e) => setTeacherForm({...teacherForm, role: e.target.value})} required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Experience</Label>
                          <Input value={teacherForm.experience || ""} onChange={(e) => setTeacherForm({...teacherForm, experience: e.target.value})} />
                        </div>
                        <div>
                          <Label>Background</Label>
                          <Input value={teacherForm.background || ""} onChange={(e) => setTeacherForm({...teacherForm, background: e.target.value})} />
                        </div>
                      </div>
                      <div>
                        <Label>Bio</Label>
                        <Textarea value={teacherForm.bio || ""} onChange={(e) => setTeacherForm({...teacherForm, bio: e.target.value})} rows={4} />
                      </div>
                      <div>
                        <Label>Photo URL</Label>
                        <Input value={teacherForm.photo_url || ""} onChange={(e) => setTeacherForm({...teacherForm, photo_url: e.target.value})} />
                      </div>
                      <Button type="submit" className="w-full">{editingItem ? "Update" : "Add"} Teacher</Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="curriculum">
                    <form onSubmit={handleCurriculumSubmit} className="space-y-4">
                      <div>
                        <Label>Quarter * (e.g., Winter (Jan-Mar))</Label>
                        <Input value={curriculumForm.quarter} onChange={(e) => setCurriculumForm({...curriculumForm, quarter: e.target.value})} required />
                      </div>
                      <div>
                        <Label>Theme *</Label>
                        <Input value={curriculumForm.theme} onChange={(e) => setCurriculumForm({...curriculumForm, theme: e.target.value})} required />
                      </div>
                      <div>
                        <Label>Focus *</Label>
                        <Input value={curriculumForm.focus} onChange={(e) => setCurriculumForm({...curriculumForm, focus: e.target.value})} required />
                      </div>
                      <div>
                        <Label>Key Verses (comma-separated)</Label>
                        <Input 
                          value={curriculumForm.key_verses} 
                          onChange={(e) => setCurriculumForm({...curriculumForm, key_verses: e.target.value})} 
                          placeholder="e.g., John 3:16, Romans 3:23"
                        />
                      </div>
                      <Button type="submit" className="w-full">{editingItem ? "Update" : "Add"} Curriculum</Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="teachers">Teachers ({teachers.length})</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum ({curriculum.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="teachers" className="grid md:grid-cols-2 gap-4">
              {teachers.map((teacher) => (
                <Card key={teacher.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center text-base">
                      <span>{teacher.name}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(teacher, "teacher")}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete("sunday_school_teachers", teacher.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div><strong>Role:</strong> {teacher.role}</div>
                      {teacher.experience && <div><strong>Experience:</strong> {teacher.experience}</div>}
                      {teacher.background && <div><strong>Background:</strong> {teacher.background}</div>}
                      {teacher.bio && <p className="text-muted-foreground mt-2">{teacher.bio}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="curriculum" className="grid md:grid-cols-2 gap-4">
              {curriculum.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center text-base">
                      <span>{item.quarter}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(item, "curriculum")}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete("curriculum_items", item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div><strong>Theme:</strong> {item.theme}</div>
                      <div><strong>Focus:</strong> {item.focus}</div>
                      {item.key_verses && item.key_verses.length > 0 && (
                        <div><strong>Key Verses:</strong> {item.key_verses.join(", ")}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SundaySchoolContent;