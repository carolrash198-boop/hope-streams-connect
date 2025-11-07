import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Trash2, Edit, Plus } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface OutreachProject {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  impact_metric: string | null;
  schedule: string | null;
  volunteers_needed: string | null;
  location: string | null;
  is_urgent: boolean;
  is_active: boolean;
  display_order: number;
  project_type: string;
}

const Outreach = () => {
  const [projects, setProjects] = useState<OutreachProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<OutreachProject | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon_name: "",
    impact_metric: "",
    schedule: "",
    volunteers_needed: "",
    location: "",
    is_urgent: false,
    is_active: true,
    display_order: 0,
    project_type: "current_project"
  });

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("outreach_projects")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch projects: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProject) {
        const { error } = await supabase
          .from("outreach_projects")
          .update(formData)
          .eq("id", editingProject.id);
        
        if (error) throw error;
        toast.success("Project updated successfully");
      } else {
        const { error } = await supabase
          .from("outreach_projects")
          .insert([formData]);
        
        if (error) throw error;
        toast.success("Project created successfully");
      }
      
      setDialogOpen(false);
      resetForm();
      fetchProjects();
    } catch (error: any) {
      toast.error("Failed to save project: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const { error } = await supabase
        .from("outreach_projects")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      toast.success("Project deleted successfully");
      fetchProjects();
    } catch (error: any) {
      toast.error("Failed to delete project: " + error.message);
    }
  };

  const handleEdit = (project: OutreachProject) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      icon_name: project.icon_name,
      impact_metric: project.impact_metric || "",
      schedule: project.schedule || "",
      volunteers_needed: project.volunteers_needed || "",
      location: project.location || "",
      is_urgent: project.is_urgent,
      is_active: project.is_active,
      display_order: project.display_order,
      project_type: project.project_type
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      description: "",
      icon_name: "",
      impact_metric: "",
      schedule: "",
      volunteers_needed: "",
      location: "",
      is_urgent: false,
      is_active: true,
      display_order: 0,
      project_type: "current_project"
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const currentProjects = projects.filter(p => p.project_type === "current_project");
  const impactStories = projects.filter(p => p.project_type === "impact_story");
  const volunteerOpportunities = projects.filter(p => p.project_type === "volunteer_opportunity");

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Manage Outreach Content</h1>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
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
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="project_type">Project Type</Label>
                    <Select
                      value={formData.project_type}
                      onValueChange={(value) => setFormData({ ...formData, project_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current_project">Current Project</SelectItem>
                        <SelectItem value="impact_story">Impact Story</SelectItem>
                        <SelectItem value="volunteer_opportunity">Volunteer Opportunity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="icon_name">Icon Name (Lucide icon name)</Label>
                    <Input
                      id="icon_name"
                      value={formData.icon_name}
                      onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                      placeholder="e.g., Utensils, Home, GraduationCap"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="impact_metric">Impact Metric</Label>
                    <Input
                      id="impact_metric"
                      value={formData.impact_metric}
                      onChange={(e) => setFormData({ ...formData, impact_metric: e.target.value })}
                      placeholder="e.g., 2,400 meals served this year"
                    />
                  </div>

                  <div>
                    <Label htmlFor="schedule">Schedule</Label>
                    <Input
                      id="schedule"
                      value={formData.schedule}
                      onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                      placeholder="e.g., Every Saturday, 10 AM - 2 PM"
                    />
                  </div>

                  <div>
                    <Label htmlFor="volunteers_needed">Volunteers Needed</Label>
                    <Input
                      id="volunteers_needed"
                      value={formData.volunteers_needed}
                      onChange={(e) => setFormData({ ...formData, volunteers_needed: e.target.value })}
                      placeholder="e.g., 15-20 volunteers needed weekly"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., Church Fellowship Hall"
                    />
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

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_urgent"
                      checked={formData.is_urgent}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_urgent: checked })}
                    />
                    <Label htmlFor="is_urgent">Urgent Need</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>

                  <Button type="submit" className="w-full">
                    {editingProject ? "Update" : "Create"} Project
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Current Projects ({currentProjects.length})</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {currentProjects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(project)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(project.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                      {project.is_urgent && (
                        <span className="inline-block px-2 py-1 text-xs font-semibold bg-destructive text-destructive-foreground rounded">
                          Urgent Need
                        </span>
                      )}
                      {!project.is_active && (
                        <span className="inline-block px-2 py-1 text-xs font-semibold bg-muted text-muted-foreground rounded ml-2">
                          Inactive
                        </span>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Impact Stories ({impactStories.length})</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {impactStories.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(project)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(project.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Volunteer Opportunities ({volunteerOpportunities.length})</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {volunteerOpportunities.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(project)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(project.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Outreach;
