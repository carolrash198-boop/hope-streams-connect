import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Calendar, Mail, Phone, User, MessageSquare, AlertCircle, Search, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ClassVisit {
  id: string;
  class_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  child_name: string;
  child_age: number | null;
  visit_date: string | null;
  message: string | null;
  status: string;
  created_at: string;
  sunday_school_classes?: {
    name: string;
  };
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  completed: number;
}

const ClassVisits = () => {
  const [visits, setVisits] = useState<ClassVisit[]>([]);
  const [filteredVisits, setFilteredVisits] = useState<ClassVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedVisit, setSelectedVisit] = useState<ClassVisit | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
  });

  useEffect(() => {
    fetchVisits();
  }, []);

  useEffect(() => {
    filterVisits();
  }, [visits, searchTerm, statusFilter]);

  const fetchVisits = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("class_visits")
      .select(`
        *,
        sunday_school_classes (
          name
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load visits");
      console.error(error);
    } else {
      setVisits(data || []);
      calculateStats(data || []);
    }
    setLoading(false);
  };

  const calculateStats = (data: ClassVisit[]) => {
    const stats = {
      total: data.length,
      pending: data.filter((v) => v.status === "pending").length,
      approved: data.filter((v) => v.status === "approved").length,
      completed: data.filter((v) => v.status === "completed").length,
    };
    setStats(stats);
  };

  const filterVisits = () => {
    let filtered = visits;

    if (statusFilter !== "all") {
      filtered = filtered.filter((visit) => visit.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (visit) =>
          visit.first_name.toLowerCase().includes(term) ||
          visit.last_name.toLowerCase().includes(term) ||
          visit.email.toLowerCase().includes(term) ||
          visit.child_name.toLowerCase().includes(term) ||
          (visit.sunday_school_classes?.name || "").toLowerCase().includes(term)
      );
    }

    setFilteredVisits(filtered);
  };

  const handleStatusUpdate = async (visitId: string, newStatus: string) => {
    const { error } = await supabase
      .from("class_visits")
      .update({ status: newStatus })
      .eq("id", visitId);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success("Status updated successfully");
      fetchVisits();
      if (selectedVisit?.id === visitId) {
        setSelectedVisit({ ...selectedVisit, status: newStatus });
      }
    }
  };

  const handleDelete = async (visitId: string) => {
    if (!confirm("Are you sure you want to delete this visit request?")) return;

    const { error } = await supabase
      .from("class_visits")
      .delete()
      .eq("id", visitId);

    if (error) {
      toast.error("Failed to delete visit request");
    } else {
      toast.success("Visit request deleted successfully");
      fetchVisits();
      setDialogOpen(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      pending: { variant: "secondary", label: "Pending" },
      approved: { variant: "default", label: "Approved" },
      completed: { variant: "outline", label: "Completed" },
      cancelled: { variant: "destructive", label: "Cancelled" },
    };

    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Class Visit Requests</h1>
          <p className="text-muted-foreground">Manage and respond to Sunday School class visit requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, child name, or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Visit Requests List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading visits...</p>
          </div>
        ) : filteredVisits.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No visit requests found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredVisits.map((visit) => (
              <Card
                key={visit.id}
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => {
                  setSelectedVisit(visit);
                  setDialogOpen(true);
                }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">
                            {visit.first_name} {visit.last_name}
                          </h3>
                          {getStatusBadge(visit.status)}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(visit.created_at)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>{visit.email}</span>
                        </div>
                        {visit.phone && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{visit.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>Child: {visit.child_name} ({visit.child_age} years)</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Class: {visit.sunday_school_classes?.name || "N/A"}</span>
                        </div>
                      </div>

                      {visit.visit_date && (
                        <div className="flex items-center gap-2 text-sm">
                          <AlertCircle className="h-4 w-4 text-accent" />
                          <span className="font-medium">Requested visit date: {formatDate(visit.visit_date)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Visit Details Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Visit Request Details</DialogTitle>
            </DialogHeader>
            {selectedVisit && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {selectedVisit.first_name} {selectedVisit.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Submitted on {formatDate(selectedVisit.created_at)}
                    </p>
                  </div>
                  {getStatusBadge(selectedVisit.status)}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{selectedVisit.email}</p>
                  </div>

                  {selectedVisit.phone && (
                    <div>
                      <Label className="text-muted-foreground">Phone</Label>
                      <p className="font-medium">{selectedVisit.phone}</p>
                    </div>
                  )}

                  <div>
                    <Label className="text-muted-foreground">Child Information</Label>
                    <p className="font-medium">
                      {selectedVisit.child_name}, {selectedVisit.child_age} years old
                    </p>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Class</Label>
                    <p className="font-medium">{selectedVisit.sunday_school_classes?.name || "N/A"}</p>
                  </div>

                  {selectedVisit.visit_date && (
                    <div>
                      <Label className="text-muted-foreground">Requested Visit Date</Label>
                      <p className="font-medium">{formatDate(selectedVisit.visit_date)}</p>
                    </div>
                  )}

                  {selectedVisit.message && (
                    <div>
                      <Label className="text-muted-foreground">Message</Label>
                      <div className="mt-1 p-4 bg-muted rounded-md">
                        <p className="whitespace-pre-wrap">{selectedVisit.message}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label>Update Status</Label>
                  <Select
                    value={selectedVisit.status}
                    onValueChange={(value) => handleStatusUpdate(selectedVisit.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(selectedVisit.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Request
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
  );
};

export default ClassVisits;
