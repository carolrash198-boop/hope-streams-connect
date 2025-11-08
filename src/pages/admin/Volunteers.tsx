import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, Edit, Mail, Phone } from "lucide-react";

interface VolunteerSubmission {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  areas_of_interest: string[];
  availability: string;
  message: string | null;
  skills: string | null;
  status: string;
  follow_up_notes: string | null;
  created_at: string;
}

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState<VolunteerSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState<VolunteerSubmission | null>(null);
  
  const [formData, setFormData] = useState({
    status: "pending",
    follow_up_notes: ""
  });

  const fetchVolunteers = async () => {
    try {
      const { data, error } = await supabase
        .from("volunteer_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVolunteers(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch volunteers: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingVolunteer) return;

    try {
      const { error } = await supabase
        .from("volunteer_submissions")
        .update(formData)
        .eq("id", editingVolunteer.id);
      
      if (error) throw error;
      toast.success("Volunteer updated successfully");
      
      setDialogOpen(false);
      resetForm();
      fetchVolunteers();
    } catch (error: any) {
      toast.error("Failed to update volunteer: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this volunteer submission?")) return;
    
    try {
      const { error } = await supabase
        .from("volunteer_submissions")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      toast.success("Volunteer deleted successfully");
      fetchVolunteers();
    } catch (error: any) {
      toast.error("Failed to delete volunteer: " + error.message);
    }
  };

  const handleEdit = (volunteer: VolunteerSubmission) => {
    setEditingVolunteer(volunteer);
    setFormData({
      status: volunteer.status,
      follow_up_notes: volunteer.follow_up_notes || ""
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingVolunteer(null);
    setFormData({
      status: "pending",
      follow_up_notes: ""
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "contacted": return "bg-blue-500";
      case "active": return "bg-green-500";
      case "inactive": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Volunteer Management</h1>
              <p className="text-muted-foreground mt-1">
                Manage volunteer applications and track engagement
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {volunteers.map((volunteer) => (
              <Card key={volunteer.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {volunteer.first_name} {volunteer.last_name}
                      </CardTitle>
                      <Badge className={`mt-2 ${getStatusColor(volunteer.status)}`}>
                        {volunteer.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(volunteer)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(volunteer.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${volunteer.email}`} className="hover:underline">
                        {volunteer.email}
                      </a>
                    </div>
                    {volunteer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${volunteer.phone}`} className="hover:underline">
                          {volunteer.phone}
                        </a>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold mt-3 mb-1">Interests:</p>
                      <div className="flex flex-wrap gap-1">
                        {volunteer.areas_of_interest.map((area) => (
                          <Badge key={area} variant="outline" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold">Availability:</p>
                      <p className="text-muted-foreground capitalize">{volunteer.availability}</p>
                    </div>
                    {volunteer.skills && (
                      <div>
                        <p className="font-semibold">Skills:</p>
                        <p className="text-muted-foreground">{volunteer.skills}</p>
                      </div>
                    )}
                    {volunteer.message && (
                      <div>
                        <p className="font-semibold">Message:</p>
                        <p className="text-muted-foreground text-xs">{volunteer.message}</p>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-3">
                      Submitted: {new Date(volunteer.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {volunteers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No volunteer submissions yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Volunteer Status</DialogTitle>
          </DialogHeader>
          {editingVolunteer && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Volunteer</Label>
                <p className="text-lg font-semibold">
                  {editingVolunteer.first_name} {editingVolunteer.last_name}
                </p>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="follow_up_notes">Follow-up Notes</Label>
                <Textarea
                  id="follow_up_notes"
                  value={formData.follow_up_notes}
                  onChange={(e) => setFormData({ ...formData, follow_up_notes: e.target.value })}
                  placeholder="Add notes about communication, meetings, assignments..."
                  rows={5}
                />
              </div>

              <Button type="submit" className="w-full">
                Update Volunteer
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Volunteers;
