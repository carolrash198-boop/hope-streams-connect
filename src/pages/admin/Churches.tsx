import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Church } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Church {
  id: string;
  name: string;
  location: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  pastor_name: string | null;
  established_date: string | null;
  member_count: number;
  is_active: boolean;
}

const Churches = () => {
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    address: "",
    phone: "",
    email: "",
    pastor_name: "",
    established_date: "",
  });

  useEffect(() => {
    fetchChurches();
  }, []);

  const fetchChurches = async () => {
    try {
      const { data, error } = await supabase
        .from("churches")
        .select("*")
        .order("name");

      if (error) throw error;
      setChurches(data || []);
    } catch (error) {
      console.error("Error fetching churches:", error);
      toast.error("Failed to load churches");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const { error } = await supabase.from("churches").insert([formData]);

      if (error) throw error;

      toast.success("Church created successfully");
      setCreateDialogOpen(false);
      resetForm();
      fetchChurches();
    } catch (error) {
      console.error("Error creating church:", error);
      toast.error("Failed to create church");
    }
  };

  const handleEdit = async () => {
    if (!selectedChurch) return;

    try {
      const { error } = await supabase
        .from("churches")
        .update(formData)
        .eq("id", selectedChurch.id);

      if (error) throw error;

      toast.success("Church updated successfully");
      setEditDialogOpen(false);
      resetForm();
      fetchChurches();
    } catch (error) {
      console.error("Error updating church:", error);
      toast.error("Failed to update church");
    }
  };

  const handleDelete = async () => {
    if (!selectedChurch) return;

    try {
      const { error } = await supabase
        .from("churches")
        .delete()
        .eq("id", selectedChurch.id);

      if (error) throw error;

      toast.success("Church deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedChurch(null);
      fetchChurches();
    } catch (error) {
      console.error("Error deleting church:", error);
      toast.error("Failed to delete church");
    }
  };

  const openEditDialog = (church: Church) => {
    setSelectedChurch(church);
    setFormData({
      name: church.name,
      location: church.location,
      address: church.address || "",
      phone: church.phone || "",
      email: church.email || "",
      pastor_name: church.pastor_name || "",
      established_date: church.established_date || "",
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (church: Church) => {
    setSelectedChurch(church);
    setDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      address: "",
      phone: "",
      email: "",
      pastor_name: "",
      established_date: "",
    });
    setSelectedChurch(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Churches</h1>
            <p className="text-muted-foreground">Manage churches across Baringo</p>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Church
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Church</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Church Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Main Sanctuary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., Kabarnet"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Full address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+254 ..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="church@example.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pastor_name">Pastor Name</Label>
                    <Input
                      id="pastor_name"
                      value={formData.pastor_name}
                      onChange={(e) => setFormData({ ...formData, pastor_name: e.target.value })}
                      placeholder="Pastor's name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="established_date">Established Date</Label>
                    <Input
                      id="established_date"
                      type="date"
                      value={formData.established_date}
                      onChange={(e) => setFormData({ ...formData, established_date: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleCreate} disabled={!formData.name || !formData.location}>
                  Create Church
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-8 text-center">Loading churches...</CardContent>
          </Card>
        ) : churches.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Church className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No churches found. Add your first church to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Churches ({churches.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Pastor</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {churches.map((church) => (
                    <TableRow key={church.id}>
                      <TableCell className="font-medium">{church.name}</TableCell>
                      <TableCell>{church.location}</TableCell>
                      <TableCell>{church.pastor_name || "—"}</TableCell>
                      <TableCell>
                        {church.phone && <div>{church.phone}</div>}
                        {church.email && <div className="text-sm text-muted-foreground">{church.email}</div>}
                        {!church.phone && !church.email && "—"}
                      </TableCell>
                      <TableCell>{church.member_count}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(church)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(church)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Church</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Church Name *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Location *</Label>
                  <Input
                    id="edit-location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Textarea
                  id="edit-address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-pastor">Pastor Name</Label>
                  <Input
                    id="edit-pastor"
                    value={formData.pastor_name}
                    onChange={(e) => setFormData({ ...formData, pastor_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-established">Established Date</Label>
                  <Input
                    id="edit-established"
                    type="date"
                    value={formData.established_date}
                    onChange={(e) => setFormData({ ...formData, established_date: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleEdit}>Update Church</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Church</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{selectedChurch?.name}"? This will also delete all associated members and resources. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default Churches;