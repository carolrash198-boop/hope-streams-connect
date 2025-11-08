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
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      setChurches(data || []);
    } catch (error) {
      console.error("Error fetching churches:", error);
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
    <div className="space-y-6">
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

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map((cond) => (
                          <SelectItem key={cond.value} value={cond.value}>
                            {cond.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Where is it stored?"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchase_date">Purchase Date</Label>
                    <Input
                      id="purchase_date"
                      type="date"
                      value={formData.purchase_date}
                      onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchase_cost">Purchase Cost</Label>
                    <Input
                      id="purchase_cost"
                      type="number"
                      step="0.01"
                      value={formData.purchase_cost}
                      onChange={(e) => setFormData({ ...formData, purchase_cost: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="current_value">Current Value</Label>
                    <Input
                      id="current_value"
                      type="number"
                      step="0.01"
                      value={formData.current_value}
                      onChange={(e) => setFormData({ ...formData, current_value: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assigned_to">Assigned To</Label>
                  <Input
                    id="assigned_to"
                    value={formData.assigned_to}
                    onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                    placeholder="Person or department"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maintenance_schedule">Maintenance Schedule</Label>
                  <Input
                    id="maintenance_schedule"
                    value={formData.maintenance_schedule}
                    onChange={(e) => setFormData({ ...formData, maintenance_schedule: e.target.value })}
                    placeholder="e.g., Monthly, Quarterly, Annual"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="last_maintenance">Last Maintenance</Label>
                    <Input
                      id="last_maintenance"
                      type="date"
                      value={formData.last_maintenance_date}
                      onChange={(e) => setFormData({ ...formData, last_maintenance_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="next_maintenance">Next Maintenance</Label>
                    <Input
                      id="next_maintenance"
                      type="date"
                      value={formData.next_maintenance_date}
                      onChange={(e) => setFormData({ ...formData, next_maintenance_date: e.target.value })}
                    />
                  </div>
                </div>

                <Button onClick={handleCreate}>Add Resource</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-8 text-center">Loading resources...</CardContent>
          </Card>
        ) : resources.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No resources found. Add your first resource to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Resources ({resources.length})</CardTitle>
            </CardHeader>
            <CardContent>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
    </div>
  );
};

export default ChurchResources;