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
import { Plus, Edit, Trash2, Users, Search, FileDown, FileText } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { exportToCSV, exportToPDF } from "@/lib/exportUtils";
import TablePagination from "@/components/admin/TablePagination";

interface Church {
  id: string;
  name: string;
  location: string;
}

interface ChurchMember {
  id: string;
  church_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  gender: string | null;
  membership_date: string;
  is_active: boolean;
  churches: { name: string; location: string };
}

const ChurchMembers = () => {
  const [members, setMembers] = useState<ChurchMember[]>([]);
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChurchFilter, setSelectedChurchFilter] = useState<string>("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<ChurchMember | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    church_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    marital_status: "",
    address: "",
    occupation: "",
    membership_date: new Date().toISOString().split("T")[0],
    baptism_date: "",
    notes: "",
  });

  useEffect(() => {
    fetchChurches();
    fetchMembers();
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

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("church_members")
        .select(`
          *,
          churches (
            name,
            location
          )
        `)
        .order("last_name");

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.church_id || !formData.first_name || !formData.last_name) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const { error } = await supabase.from("church_members").insert([formData]);

      if (error) throw error;

      toast.success("Member added successfully");
      setCreateDialogOpen(false);
      resetForm();
      fetchMembers();
    } catch (error) {
      console.error("Error creating member:", error);
      toast.error("Failed to add member");
    }
  };

  const handleEdit = async () => {
    if (!selectedMember) return;

    try {
      const { error } = await supabase
        .from("church_members")
        .update(formData)
        .eq("id", selectedMember.id);

      if (error) throw error;

      toast.success("Member updated successfully");
      setEditDialogOpen(false);
      resetForm();
      fetchMembers();
    } catch (error) {
      console.error("Error updating member:", error);
      toast.error("Failed to update member");
    }
  };

  const handleDelete = async () => {
    if (!selectedMember) return;

    try {
      const { error } = await supabase
        .from("church_members")
        .delete()
        .eq("id", selectedMember.id);

      if (error) throw error;

      toast.success("Member deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedMember(null);
      fetchMembers();
    } catch (error) {
      console.error("Error deleting member:", error);
      toast.error("Failed to delete member");
    }
  };

  const openEditDialog = (member: ChurchMember) => {
    setSelectedMember(member);
    setFormData({
      church_id: member.church_id,
      first_name: member.first_name,
      last_name: member.last_name,
      email: member.email || "",
      phone: member.phone || "",
      date_of_birth: "",
      gender: member.gender || "",
      marital_status: "",
      address: "",
      occupation: "",
      membership_date: member.membership_date,
      baptism_date: "",
      notes: "",
    });
    setEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      church_id: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      date_of_birth: "",
      gender: "",
      marital_status: "",
      address: "",
      occupation: "",
      membership_date: new Date().toISOString().split("T")[0],
      baptism_date: "",
      notes: "",
    });
    setSelectedMember(null);
  };

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone?.includes(searchTerm);

      const matchesChurch =
        selectedChurchFilter === "all" || member.church_id === selectedChurchFilter;

      return matchesSearch && matchesChurch;
    });
  }, [members, searchTerm, selectedChurchFilter]);

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredMembers.slice(startIndex, endIndex);
  }, [filteredMembers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  const handleExportCSV = () => {
    const exportData = filteredMembers.map(member => ({
      "First Name": member.first_name,
      "Last Name": member.last_name,
      Email: member.email || "",
      Phone: member.phone || "",
      Gender: member.gender || "",
      Church: member.churches.name,
      Location: member.churches.location,
      "Membership Date": member.membership_date,
      Status: member.is_active ? "Active" : "Inactive",
    }));
    exportToCSV(exportData, "church-members");
    toast.success("Exported to CSV successfully");
  };

  const handleExportPDF = () => {
    const exportData = filteredMembers.map(member => ({
      Name: `${member.first_name} ${member.last_name}`,
      Email: member.email || "",
      Phone: member.phone || "",
      Church: member.churches.name,
      "Membership Date": member.membership_date,
      Status: member.is_active ? "Active" : "Inactive",
    }));
    exportToPDF(exportData, "church-members", "Church Members Report");
    toast.success("Exported to PDF successfully");
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Church Members</h1>
          <p className="text-muted-foreground">Manage church membership records</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV} disabled={filteredMembers.length === 0}>
            <FileText className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={handleExportPDF} disabled={filteredMembers.length === 0}>
            <FileDown className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Member</DialogTitle>
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
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <Button onClick={handleCreate}>Add Member</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>All Members ({filteredMembers.length})</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full sm:w-[300px]"
                />
              </div>
              <Select value={selectedChurchFilter} onValueChange={setSelectedChurchFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Churches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Churches</SelectItem>
                  {churches.map((church) => (
                    <SelectItem key={church.id} value={church.id}>
                      {church.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-pulse">Loading members...</div>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="py-16 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-muted p-6">
                  <Users className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">No members found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {searchTerm || selectedChurchFilter !== "all"
                      ? "Try adjusting your search or filter"
                      : "Get started by adding your first church member"}
                  </p>
                  {!searchTerm && selectedChurchFilter === "all" && (
                    <Button onClick={() => setCreateDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Member
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Church</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Membership Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">
                          {member.first_name} {member.last_name}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{member.churches.name}</div>
                            <div className="text-sm text-muted-foreground">{member.churches.location}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {member.email && <div className="text-sm">{member.email}</div>}
                          {member.phone && <div className="text-sm text-muted-foreground">{member.phone}</div>}
                          {!member.email && !member.phone && "—"}
                        </TableCell>
                        <TableCell>
                          {new Date(member.membership_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={member.is_active ? "default" : "secondary"}>
                            {member.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(member)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => { setSelectedMember(member); setDeleteDialogOpen(true); }}>
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
                  totalItems={filteredMembers.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={(newSize) => {
                    setItemsPerPage(newSize);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog - Similar structure to Create Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            {/* Same form fields as create */}
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
                <Label>First Name *</Label>
                <Input value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} />
              </div>
            </div>
            <Button onClick={handleEdit}>Update Member</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedMember?.first_name} {selectedMember?.last_name}? This action cannot be undone.
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

export default ChurchMembers;