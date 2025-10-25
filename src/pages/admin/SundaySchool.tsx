import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface SundaySchoolClass {
  id: string;
  name: string;
  age_range: string;
  time_start: string;
  time_end: string;
  description: string | null;
  teacher_name: string | null;
  location: string | null;
  curriculum: string | null;
  current_enrollment: number;
  max_capacity: number | null;
  is_active: boolean;
}

const SundaySchool = () => {
  const [classes, setClasses] = useState<SundaySchoolClass[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<SundaySchoolClass | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    age_range: "",
    time_start: "",
    time_end: "",
    description: "",
    teacher_name: "",
    location: "",
    curriculum: "",
    current_enrollment: 0,
    max_capacity: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const { data, error } = await supabase
      .from("sunday_school_classes")
      .select("*")
      .order("time_start", { ascending: true });

    if (error) {
      toast.error("Failed to load classes");
    } else {
      setClasses(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingClass) {
        const { error } = await supabase
          .from("sunday_school_classes")
          .update(formData)
          .eq("id", editingClass.id);

        if (error) throw error;
        toast.success("Class updated successfully");
      } else {
        const { error } = await supabase
          .from("sunday_school_classes")
          .insert([formData]);

        if (error) throw error;
        toast.success("Class created successfully");
      }

      setDialogOpen(false);
      resetForm();
      fetchClasses();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;

    const { error } = await supabase
      .from("sunday_school_classes")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete class");
    } else {
      toast.success("Class deleted successfully");
      fetchClasses();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      age_range: "",
      time_start: "",
      time_end: "",
      description: "",
      teacher_name: "",
      location: "",
      curriculum: "",
      current_enrollment: 0,
      max_capacity: 0,
      is_active: true,
    });
    setEditingClass(null);
  };

  const handleEdit = (classItem: SundaySchoolClass) => {
    setEditingClass(classItem);
    setFormData({
      name: classItem.name,
      age_range: classItem.age_range,
      time_start: classItem.time_start,
      time_end: classItem.time_end,
      description: classItem.description || "",
      teacher_name: classItem.teacher_name || "",
      location: classItem.location || "",
      curriculum: classItem.curriculum || "",
      current_enrollment: classItem.current_enrollment,
      max_capacity: classItem.max_capacity || 0,
      is_active: classItem.is_active,
    });
    setDialogOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-muted/10">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Sunday School Management</h1>
            <p className="text-muted-foreground">Manage Sunday school classes and enrollment</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Add Class
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingClass ? "Edit Class" : "Add New Class"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Class Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Little Lambs (Ages 2-4)"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="age_range">Age Range</Label>
                    <Input
                      id="age_range"
                      value={formData.age_range}
                      onChange={(e) => setFormData({ ...formData, age_range: e.target.value })}
                      placeholder="e.g., Ages 2-4"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="time_start">Start Time</Label>
                    <Input
                      id="time_start"
                      type="time"
                      value={formData.time_start}
                      onChange={(e) => setFormData({ ...formData, time_start: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="time_end">End Time</Label>
                    <Input
                      id="time_end"
                      type="time"
                      value={formData.time_end}
                      onChange={(e) => setFormData({ ...formData, time_end: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="teacher_name">Teacher Name</Label>
                    <Input
                      id="teacher_name"
                      value={formData.teacher_name}
                      onChange={(e) => setFormData({ ...formData, teacher_name: e.target.value })}
                      placeholder="e.g., Sarah Johnson"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., Room 101"
                    />
                  </div>

                  <div>
                    <Label htmlFor="current_enrollment">Current Enrollment</Label>
                    <Input
                      id="current_enrollment"
                      type="number"
                      min="0"
                      value={formData.current_enrollment}
                      onChange={(e) => setFormData({ ...formData, current_enrollment: parseInt(e.target.value) || 0 })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="max_capacity">Max Capacity</Label>
                    <Input
                      id="max_capacity"
                      type="number"
                      min="0"
                      value={formData.max_capacity}
                      onChange={(e) => setFormData({ ...formData, max_capacity: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the class"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="curriculum">Curriculum</Label>
                  <Textarea
                    id="curriculum"
                    value={formData.curriculum}
                    onChange={(e) => setFormData({ ...formData, curriculum: e.target.value })}
                    placeholder="e.g., Bible stories, memory verses, worship songs"
                    rows={2}
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
                  {loading ? "Saving..." : editingClass ? "Update Class" : "Add Class"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <Card key={classItem.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{classItem.name}</h3>
                  {!classItem.is_active && (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                      Inactive
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <p className="text-muted-foreground">
                    <strong>Age:</strong> {classItem.age_range}
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Time:</strong> {classItem.time_start} - {classItem.time_end}
                  </p>
                  {classItem.teacher_name && (
                    <p className="text-muted-foreground">
                      <strong>Teacher:</strong> {classItem.teacher_name}
                    </p>
                  )}
                  {classItem.location && (
                    <p className="text-muted-foreground">
                      <strong>Location:</strong> {classItem.location}
                    </p>
                  )}
                  <div className="flex items-center gap-2 pt-2">
                    <Users className="h-4 w-4 text-accent" />
                    <span className="font-medium">
                      {classItem.current_enrollment}
                      {classItem.max_capacity ? `/${classItem.max_capacity}` : ""} enrolled
                    </span>
                  </div>
                </div>

                {classItem.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {classItem.description}
                  </p>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(classItem)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(classItem.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SundaySchool;
