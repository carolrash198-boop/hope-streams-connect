import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Package, FileDown, FileText } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { exportToCSV, exportToPDF } from "@/lib/exportUtils";
import TablePagination from "@/components/admin/TablePagination";

interface Church {
  id: string;
  name: string;
  location: string;
}

interface ChurchResource {
  id: string;
  church_id: string;
  resource_name: string;
  resource_type: string;
  description: string | null;
  quantity: number;
  condition: string | null;
  is_available: boolean;
  churches: { name: string };
}

const ChurchResources = () => {
  const [resources, setResources] = useState<ChurchResource[]>([]);
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<ChurchResource | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    church_id: "",
    resource_name: "",
    resource_type: "",
    description: "",
    quantity: 1,
    condition: "",
    purchase_date: "",
    purchase_cost: "",
    current_value: "",
    location: "",
    assigned_to: "",
    maintenance_schedule: "",
    last_maintenance_date: "",
    next_maintenance_date: "",
  });

  const paginatedResources = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return resources.slice(startIndex, endIndex);
  }, [resources, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(resources.length / itemsPerPage);

  useEffect(() => {
    fetchChurches();
    fetchResources();
  }, []);

  const fetchChurches = async () => {
    try {
      const { data, error } = await supabase
        .from("churches")
        .select("id, name, location")
        .order("name");

      if (error) {
        console.error("Error fetching churches:", error);
        toast.error("Failed to load churches: " + error.message);
        return;
      }
      
      setChurches(data || []);
      
      if (!data || data.length === 0) {
        toast.info("No churches found. Please add a church first.");
      }
    } catch (error) {
      console.error("Error fetching churches:", error);
      toast.error("Failed to load churches");
    }
  };

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from("church_resources")
        .select(`
          *,
          churches (
            name
          )
        `)
        .order("resource_name");

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.church_id || !formData.resource_name || !formData.resource_type) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const { error } = await supabase.from("church_resources").insert([{
        ...formData,
        purchase_cost: formData.purchase_cost ? parseFloat(formData.purchase_cost) : null,
        current_value: formData.current_value ? parseFloat(formData.current_value) : null,
        purchase_date: formData.purchase_date || null,
        last_maintenance_date: formData.last_maintenance_date || null,
        next_maintenance_date: formData.next_maintenance_date || null,
      }]);

      if (error) throw error;

      toast.success("Resource added successfully");
      setCreateDialogOpen(false);
      resetForm();
      fetchResources();
    } catch (error) {
      console.error("Error creating resource:", error);
      toast.error("Failed to add resource");
    }
  };

  const handleEdit = async () => {
    if (!selectedResource) return;

    try {
      const { error } = await supabase
        .from("church_resources")
        .update({
          ...formData,
          purchase_cost: formData.purchase_cost ? parseFloat(formData.purchase_cost) : null,
          current_value: formData.current_value ? parseFloat(formData.current_value) : null,
        })
        .eq("id", selectedResource.id);

      if (error) throw error;

      toast.success("Resource updated successfully");
      setEditDialogOpen(false);
      resetForm();
      fetchResources();
    } catch (error) {
      console.error("Error updating resource:", error);
      toast.error("Failed to update resource");
    }
  };

  const handleDelete = async () => {
    if (!selectedResource) return;

    try {
      const { error } = await supabase
        .from("church_resources")
        .delete()
        .eq("id", selectedResource.id);

      if (error) throw error;

      toast.success("Resource deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedResource(null);
      fetchResources();
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast.error("Failed to delete resource");
    }
  };

  const openEditDialog = (resource: ChurchResource) => {
    setSelectedResource(resource);
    setFormData({
      church_id: resource.church_id,
      resource_name: resource.resource_name,
      resource_type: resource.resource_type,
      description: resource.description || "",
      quantity: resource.quantity,
      condition: resource.condition || "",
      purchase_date: "",
      purchase_cost: "",
      current_value: "",
      location: "",
      assigned_to: "",
      maintenance_schedule: "",
      last_maintenance_date: "",
      next_maintenance_date: "",
    });
    setEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      church_id: "",
      resource_name: "",
      resource_type: "",
      description: "",
      quantity: 1,
      condition: "",
      purchase_date: "",
      purchase_cost: "",
      current_value: "",
      location: "",
      assigned_to: "",
      maintenance_schedule: "",
      last_maintenance_date: "",
      next_maintenance_date: "",
    });
    setSelectedResource(null);
  };

  const resourceTypes = [
    { value: "equipment", label: "Equipment" },
    { value: "facility", label: "Facility" },
    { value: "vehicle", label: "Vehicle" },
    { value: "furniture", label: "Furniture" },
    { value: "technology", label: "Technology" },
    { value: "other", label: "Other" },
  ];

  const conditions = [
    { value: "excellent", label: "Excellent" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
    { value: "poor", label: "Poor" },
  ];

  const handleExportCSV = () => {
    const exportData = resources.map(resource => ({
      "Resource Name": resource.resource_name,
      Type: resource.resource_type,
      Description: resource.description || "",
      Quantity: resource.quantity,
      Condition: resource.condition || "",
      Church: resource.churches.name,
      Status: resource.is_available ? "Available" : "Not Available",
    }));
    exportToCSV(exportData, "church-resources");
    toast.success("Exported to CSV successfully");
  };

  const handleExportPDF = () => {
    const exportData = resources.map(resource => ({
      "Resource Name": resource.resource_name,
      Type: resource.resource_type,
      Quantity: resource.quantity,
      Condition: resource.condition || "",
      Church: resource.churches.name,
      Status: resource.is_available ? "Available" : "Not Available",
    }));
    exportToPDF(exportData, "church-resources", "Church Resources Report");
    toast.success("Exported to PDF successfully");
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Church Resources</h1>
          <p className="text-muted-foreground">Manage equipment, facilities, and assets</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV} disabled={resources.length === 0}>
            <FileText className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={handleExportPDF} disabled={resources.length === 0}>
            <FileDown className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Resource</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="church">Church *</Label>
                  <Select value={formData.church_id} onValueChange={(value) => setFormData({ ...formData, church_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select church" />
                    </SelectTrigger>
                    <SelectContent>
                      {churches.map((church) => (
                        <SelectItem key={church.id} value={church.id}>
                          {church.name} - {church.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="resource_name">Resource Name *</Label>
                    <Input
                      id="resource_name"
                      value={formData.resource_name}
                      onChange={(e) => setFormData({ ...formData, resource_name: e.target.value })}
                      placeholder="e.g., Sound System"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resource_type">Type *</Label>
                    <Select value={formData.resource_type} onValueChange={(value) => setFormData({ ...formData, resource_type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {resourceTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the resource..."
                  />
                </div>

                <Button onClick={handleCreate}>Add Resource</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="animate-pulse">Loading resources...</div>
          </CardContent>
        </Card>
      ) : resources.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-full bg-primary/10 p-6">
                <Package className="h-12 w-12 text-primary" />
              </div>
              <div className="max-w-md">
                <h3 className="font-semibold text-lg mb-2">No resources yet</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Start tracking your church equipment, facilities, and assets by adding your first resource.
                </p>
                <Button onClick={() => setCreateDialogOpen(true)} size="lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Resource
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Resources ({resources.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Church</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{resource.resource_name}</div>
                          {resource.description && (
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {resource.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{resource.resource_type}</TableCell>
                      <TableCell>{resource.churches.name}</TableCell>
                      <TableCell>{resource.quantity}</TableCell>
                      <TableCell>
                        {resource.condition && (
                          <Badge
                            variant={
                              resource.condition === "excellent"
                                ? "default"
                                : resource.condition === "good"
                                ? "secondary"
                                : "outline"
                            }
                            className="capitalize"
                          >
                            {resource.condition}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={resource.is_available ? "default" : "secondary"}>
                          {resource.is_available ? "Available" : "In Use"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(resource)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedResource(resource);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4">
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={resources.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(newSize) => {
                  setItemsPerPage(newSize);
                  setCurrentPage(1);
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Church *</Label>
              <Select value={formData.church_id} onValueChange={(value) => setFormData({ ...formData, church_id: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {churches.map((church) => (
                    <SelectItem key={church.id} value={church.id}>
                      {church.name} - {church.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Resource Name *</Label>
                <Input
                  value={formData.resource_name}
                  onChange={(e) => setFormData({ ...formData, resource_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select value={formData.resource_type} onValueChange={(value) => setFormData({ ...formData, resource_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {resourceTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleEdit}>Update Resource</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resource</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedResource?.resource_name}"? This action cannot be undone.
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
  );
};

export default ChurchResources;