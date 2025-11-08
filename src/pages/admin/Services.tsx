import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Trash2, Edit, Plus } from "lucide-react";

const Services = () => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);
  const [kidsPrograms, setKidsPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("schedules");
  const [editingItem, setEditingItem] = useState<any>(null);

  const [scheduleForm, setScheduleForm] = useState({
    time: "",
    title: "",
    description: "",
    audience: "",
    duration: "",
    style: "",
    location: "Main Sanctuary"
  });

  const [featureForm, setFeatureForm] = useState({
    icon_name: "",
    title: "",
    description: ""
  });

  const [kidsForm, setKidsForm] = useState({
    age_group: "",
    ages: "",
    description: "",
    service_time: ""
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [schedulesRes, featuresRes, kidsRes] = await Promise.all([
        supabase.from("service_schedules").select("*").order("display_order"),
        supabase.from("service_features").select("*").order("display_order"),
        supabase.from("kids_programs").select("*").order("display_order")
      ]);

      if (schedulesRes.error) throw schedulesRes.error;
      if (featuresRes.error) throw featuresRes.error;
      if (kidsRes.error) throw kidsRes.error;

      setSchedules(schedulesRes.data || []);
      setFeatures(featuresRes.data || []);
      setKidsPrograms(kidsRes.data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const { error } = await supabase
          .from("service_schedules")
          .update(scheduleForm)
          .eq("id", editingItem.id);
        if (error) throw error;
        toast.success("Schedule updated");
      } else {
        const { error } = await supabase
          .from("service_schedules")
          .insert([scheduleForm]);
        if (error) throw error;
        toast.success("Schedule added");
      }
      setDialogOpen(false);
      resetForms();
      fetchAllData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleFeatureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const { error } = await supabase
          .from("service_features")
          .update(featureForm)
          .eq("id", editingItem.id);
        if (error) throw error;
        toast.success("Feature updated");
      } else {
        const { error } = await supabase
          .from("service_features")
          .insert([featureForm]);
        if (error) throw error;
        toast.success("Feature added");
      }
      setDialogOpen(false);
      resetForms();
      fetchAllData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleKidsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const { error } = await supabase
          .from("kids_programs")
          .update(kidsForm)
          .eq("id", editingItem.id);
        if (error) throw error;
        toast.success("Program updated");
      } else {
        const { error } = await supabase
          .from("kids_programs")
          .insert([kidsForm]);
        if (error) throw error;
        toast.success("Program added");
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
    setScheduleForm({ time: "", title: "", description: "", audience: "", duration: "", style: "", location: "Main Sanctuary" });
    setFeatureForm({ icon_name: "", title: "", description: "" });
    setKidsForm({ age_group: "", ages: "", description: "", service_time: "" });
    setEditingItem(null);
  };

  const handleEdit = (item: any, type: string) => {
    setEditingItem(item);
    if (type === "schedule") {
      setScheduleForm(item);
      setActiveTab("schedules");
    } else if (type === "feature") {
      setFeatureForm(item);
      setActiveTab("features");
    } else if (type === "kids") {
      setKidsForm(item);
      setActiveTab("kids");
    }
    setDialogOpen(true);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="overflow-auto">
      <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Services Management</h1>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForms()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Edit" : "Add"} Service Content</DialogTitle>
                </DialogHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="schedules">Schedule</TabsTrigger>
                    <TabsTrigger value="features">Feature</TabsTrigger>
                    <TabsTrigger value="kids">Kids Program</TabsTrigger>
                  </TabsList>

                  <TabsContent value="schedules">
                    <form onSubmit={handleScheduleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Time *</Label>
                          <Input value={scheduleForm.time} onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})} required />
                        </div>
                        <div>
                          <Label>Duration</Label>
                          <Input value={scheduleForm.duration || ""} onChange={(e) => setScheduleForm({...scheduleForm, duration: e.target.value})} />
                        </div>
                      </div>
                      <div>
                        <Label>Title *</Label>
                        <Input value={scheduleForm.title} onChange={(e) => setScheduleForm({...scheduleForm, title: e.target.value})} required />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea value={scheduleForm.description || ""} onChange={(e) => setScheduleForm({...scheduleForm, description: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Audience</Label>
                        <Input value={scheduleForm.audience || ""} onChange={(e) => setScheduleForm({...scheduleForm, audience: e.target.value})} />
                      </div>
                        <div>
                          <Label>Style</Label>
                          <Input value={scheduleForm.style || ""} onChange={(e) => setScheduleForm({...scheduleForm, style: e.target.value})} />
                        </div>
                      </div>
                      <div>
                        <Label>Location</Label>
                        <Input value={scheduleForm.location || ""} onChange={(e) => setScheduleForm({...scheduleForm, location: e.target.value})} />
                      </div>
                      <Button type="submit" className="w-full">{editingItem ? "Update" : "Add"} Schedule</Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="features">
                    <form onSubmit={handleFeatureSubmit} className="space-y-4">
                      <div>
                        <Label>Icon Name * (e.g., Music, BookOpen, Heart, Coffee)</Label>
                        <Input value={featureForm.icon_name} onChange={(e) => setFeatureForm({...featureForm, icon_name: e.target.value})} required />
                      </div>
                      <div>
                        <Label>Title *</Label>
                        <Input value={featureForm.title} onChange={(e) => setFeatureForm({...featureForm, title: e.target.value})} required />
                      </div>
                      <div>
                        <Label>Description *</Label>
                        <Textarea value={featureForm.description || ""} onChange={(e) => setFeatureForm({...featureForm, description: e.target.value})} required />
                      </div>
                      <Button type="submit" className="w-full">{editingItem ? "Update" : "Add"} Feature</Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="kids">
                    <form onSubmit={handleKidsSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Age Group *</Label>
                          <Input value={kidsForm.age_group} onChange={(e) => setKidsForm({...kidsForm, age_group: e.target.value})} required />
                        </div>
                        <div>
                          <Label>Ages *</Label>
                          <Input value={kidsForm.ages} onChange={(e) => setKidsForm({...kidsForm, ages: e.target.value})} required />
                        </div>
                      </div>
                      <div>
                        <Label>Description *</Label>
                        <Textarea value={kidsForm.description || ""} onChange={(e) => setKidsForm({...kidsForm, description: e.target.value})} required />
                      </div>
                      <div>
                        <Label>Service Time *</Label>
                        <Input value={kidsForm.service_time} onChange={(e) => setKidsForm({...kidsForm, service_time: e.target.value})} required />
                      </div>
                      <Button type="submit" className="w-full">{editingItem ? "Update" : "Add"} Program</Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="schedules">Service Schedules ({schedules.length})</TabsTrigger>
              <TabsTrigger value="features">Features ({features.length})</TabsTrigger>
              <TabsTrigger value="kids">Kids Programs ({kidsPrograms.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="schedules" className="space-y-4">
              {schedules.map((schedule) => (
                <Card key={schedule.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{schedule.time} - {schedule.title}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(schedule, "schedule")}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete("service_schedules", schedule.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{schedule.description}</p>
                    <div className="text-sm space-y-1">
                      <div><strong>Style:</strong> {schedule.style}</div>
                      <div><strong>Audience:</strong> {schedule.audience}</div>
                      <div><strong>Duration:</strong> {schedule.duration}</div>
                      <div><strong>Location:</strong> {schedule.location}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="features" className="grid md:grid-cols-2 gap-4">
              {features.map((feature) => (
                <Card key={feature.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center text-base">
                      <span>{feature.title}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(feature, "feature")}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete("service_features", feature.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
                    <p className="text-xs text-muted-foreground">Icon: {feature.icon_name}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="kids" className="grid md:grid-cols-2 gap-4">
              {kidsPrograms.map((program) => (
                <Card key={program.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center text-base">
                      <span>{program.age_group}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(program, "kids")}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete("kids_programs", program.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-1">
                      <div><strong>Ages:</strong> {program.ages}</div>
                      <div><strong>Time:</strong> {program.service_time}</div>
                      <p className="text-muted-foreground mt-2">{program.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
  );
};

export default Services;