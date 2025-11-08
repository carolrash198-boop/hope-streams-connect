import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
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

const resourceSchema = z.object({
  church_id: z.string().min(1, "Please select a church"),
  resource_name: z.string().min(1, "Resource name is required").max(100, "Resource name must be less than 100 characters"),
  resource_type: z.string().min(1, "Please select a resource type"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  quantity: z.number().min(1, "Quantity must be at least 1").int("Quantity must be a whole number"),
  condition: z.string().optional(),
  purchase_date: z.date().optional(),
  purchase_cost: z.number().positive("Cost must be positive").optional(),
  current_value: z.number().positive("Value must be positive").optional(),
  location: z.string().max(200, "Location must be less than 200 characters").optional(),
  assigned_to: z.string().max(100, "Assigned to must be less than 100 characters").optional(),
  maintenance_schedule: z.string().max(200, "Maintenance schedule must be less than 200 characters").optional(),
  last_maintenance_date: z.date().optional(),
  next_maintenance_date: z.date().optional(),
});

type ResourceFormData = z.infer<typeof resourceSchema>;

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

  const form = useForm<ResourceFormData>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      church_id: "",
      resource_name: "",
      resource_type: "",
      description: "",
      quantity: 1,
      condition: "",
      location: "",
      assigned_to: "",
      maintenance_schedule: "",
    },
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

  const handleCreate = async (data: ResourceFormData) => {
    try {
      const { error } = await supabase.from("church_resources").insert([{
        church_id: data.church_id,
        resource_name: data.resource_name,
        resource_type: data.resource_type,
        description: data.description || null,
        quantity: data.quantity,
        condition: data.condition || null,
        purchase_date: data.purchase_date?.toISOString().split('T')[0] || null,
        purchase_cost: data.purchase_cost || null,
        current_value: data.current_value || null,
        location: data.location || null,
        assigned_to: data.assigned_to || null,
        maintenance_schedule: data.maintenance_schedule || null,
        last_maintenance_date: data.last_maintenance_date?.toISOString().split('T')[0] || null,
        next_maintenance_date: data.next_maintenance_date?.toISOString().split('T')[0] || null,
      }]);

      if (error) throw error;

      toast.success("Resource added successfully");
      setCreateDialogOpen(false);
      form.reset();
      fetchResources();
    } catch (error) {
      console.error("Error creating resource:", error);
      toast.error("Failed to add resource");
    }
  };

  const handleEdit = async (data: ResourceFormData) => {
    if (!selectedResource) return;

    try {
      const { error } = await supabase
        .from("church_resources")
        .update({
          church_id: data.church_id,
          resource_name: data.resource_name,
          resource_type: data.resource_type,
          description: data.description || null,
          quantity: data.quantity,
          condition: data.condition || null,
          purchase_date: data.purchase_date?.toISOString().split('T')[0] || null,
          purchase_cost: data.purchase_cost || null,
          current_value: data.current_value || null,
          location: data.location || null,
          assigned_to: data.assigned_to || null,
          maintenance_schedule: data.maintenance_schedule || null,
          last_maintenance_date: data.last_maintenance_date?.toISOString().split('T')[0] || null,
          next_maintenance_date: data.next_maintenance_date?.toISOString().split('T')[0] || null,
        })
        .eq("id", selectedResource.id);

      if (error) throw error;

      toast.success("Resource updated successfully");
      setEditDialogOpen(false);
      form.reset();
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
    form.reset({
      church_id: resource.church_id,
      resource_name: resource.resource_name,
      resource_type: resource.resource_type,
      description: resource.description || "",
      quantity: resource.quantity,
      condition: resource.condition || "",
    });
    setEditDialogOpen(true);
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
          <Dialog open={createDialogOpen} onOpenChange={(open) => {
            setCreateDialogOpen(open);
            if (!open) form.reset();
          }}>
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="church_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Church *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select church" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {churches.map((church) => (
                              <SelectItem key={church.id} value={church.id}>
                                {church.name} - {church.location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="resource_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resource Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Sound System" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="resource_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {resourceTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="condition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Condition</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select condition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {conditions.map((condition) => (
                                <SelectItem key={condition.value} value={condition.value}>
                                  {condition.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe the resource..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Storage Room A" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="assigned_to"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assigned To</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="purchase_cost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purchase Cost</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="current_value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Value</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="purchase_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purchase Date</FormLabel>
                        <FormControl>
                          <DatePicker
                            date={field.value}
                            onSelect={field.onChange}
                            placeholder="Select purchase date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maintenance_schedule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maintenance Schedule</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Every 6 months" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="last_maintenance_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Maintenance</FormLabel>
                          <FormControl>
                            <DatePicker
                              date={field.value}
                              onSelect={field.onChange}
                              placeholder="Select last maintenance date"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="next_maintenance_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Next Maintenance</FormLabel>
                          <FormControl>
                            <DatePicker
                              date={field.value}
                              onSelect={field.onChange}
                              placeholder="Select next maintenance date"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full">Add Resource</Button>
                </form>
              </Form>
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
      <Dialog open={editDialogOpen} onOpenChange={(open) => {
        setEditDialogOpen(open);
        if (!open) form.reset();
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
              <FormField
                control={form.control}
                name="church_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Church *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select church" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {churches.map((church) => (
                          <SelectItem key={church.id} value={church.id}>
                            {church.name} - {church.location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="resource_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resource Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Sound System" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="resource_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {resourceTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condition</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {conditions.map((condition) => (
                            <SelectItem key={condition.value} value={condition.value}>
                              {condition.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the resource..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">Update Resource</Button>
            </form>
          </Form>
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