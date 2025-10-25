import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Mail, Phone, Trash2, Search, Eye, FileText, AlertCircle, CheckCircle, Clock } from "lucide-react";

interface ContactSubmission {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  inquiry_type: string | null;
  preferred_contact: string;
  status: string;
  is_urgent: boolean;
  follow_up_notes: string | null;
  created_at: string;
  updated_at: string;
}

const Contact = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [followUpNotes, setFollowUpNotes] = useState("");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load submissions");
    } else {
      setSubmissions(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;

    const { error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete submission");
    } else {
      toast.success("Submission deleted successfully");
      fetchSubmissions();
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success("Status updated");
      fetchSubmissions();
    }
  };

  const saveFollowUpNotes = async () => {
    if (!selectedSubmission) return;

    const { error } = await supabase
      .from("contact_submissions")
      .update({ follow_up_notes: followUpNotes })
      .eq("id", selectedSubmission.id);

    if (error) {
      toast.error("Failed to save notes");
    } else {
      toast.success("Notes saved successfully");
      setViewDialogOpen(false);
      fetchSubmissions();
    }
  };

  const handleViewSubmission = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setFollowUpNotes(submission.follow_up_notes || "");
    setViewDialogOpen(true);
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = searchTerm === "" || 
      submission.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || submission.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "in_progress":
        return <AlertCircle className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === "pending").length,
    inProgress: submissions.filter(s => s.status === "in_progress").length,
    resolved: submissions.filter(s => s.status === "resolved").length,
    urgent: submissions.filter(s => s.is_urgent).length,
  };

  return (
    <div className="flex min-h-screen bg-muted/10">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Contact Submissions</h1>
          <p className="text-muted-foreground">View and manage contact form submissions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Pending</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">In Progress</div>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Resolved</div>
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Urgent</div>
              <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, subject, or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredSubmissions.length} of {submissions.length} submissions
        </div>

        {/* Submissions List */}
        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-40 bg-muted rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Submissions Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your filters" 
                  : "No contact submissions yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredSubmissions.map((submission) => (
              <Card key={submission.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">
                          {submission.first_name} {submission.last_name}
                        </h3>
                        {submission.is_urgent && (
                          <Badge variant="destructive" className="text-xs">
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(submission.created_at).toLocaleString()}
                      </p>
                      {submission.inquiry_type && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {submission.inquiry_type}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className={`px-3 py-1 rounded-md border text-sm font-medium flex items-center gap-1 ${getStatusColor(submission.status)}`}>
                        {getStatusIcon(submission.status)}
                        <span className="capitalize">{submission.status.replace('_', ' ')}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewSubmission(submission)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(submission.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${submission.email}`} className="text-primary hover:underline">
                        {submission.email}
                      </a>
                    </div>
                    {submission.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${submission.phone}`} className="text-primary hover:underline">
                          {submission.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 space-y-1">
                    <p className="font-semibold text-sm">Subject: {submission.subject}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {submission.message}
                    </p>
                  </div>

                  {submission.preferred_contact && (
                    <div className="mt-3 text-xs text-muted-foreground">
                      Preferred contact method: <span className="font-medium capitalize">{submission.preferred_contact}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* View/Edit Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Contact Submission Details</DialogTitle>
            </DialogHeader>
            {selectedSubmission && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <p className="font-medium">
                      {selectedSubmission.first_name} {selectedSubmission.last_name}
                    </p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select 
                      value={selectedSubmission.status} 
                      onValueChange={(value) => {
                        updateStatus(selectedSubmission.id, value);
                        setSelectedSubmission({ ...selectedSubmission, status: value });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="font-medium">
                      <a href={`mailto:${selectedSubmission.email}`} className="text-primary hover:underline">
                        {selectedSubmission.email}
                      </a>
                    </p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p className="font-medium">
                      {selectedSubmission.phone ? (
                        <a href={`tel:${selectedSubmission.phone}`} className="text-primary hover:underline">
                          {selectedSubmission.phone}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">Not provided</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <Label>Inquiry Type</Label>
                    <p className="font-medium capitalize">
                      {selectedSubmission.inquiry_type || "General"}
                    </p>
                  </div>
                  <div>
                    <Label>Preferred Contact</Label>
                    <p className="font-medium capitalize">
                      {selectedSubmission.preferred_contact}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Label>Submitted On</Label>
                    <p className="font-medium">
                      {new Date(selectedSubmission.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <Label>Subject</Label>
                  <p className="font-medium mt-1">{selectedSubmission.subject}</p>
                </div>

                <div>
                  <Label>Message</Label>
                  <div className="mt-1 p-4 bg-muted rounded-md">
                    <p className="whitespace-pre-wrap">{selectedSubmission.message}</p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="follow_up_notes">Follow-up Notes</Label>
                  <Textarea
                    id="follow_up_notes"
                    value={followUpNotes}
                    onChange={(e) => setFollowUpNotes(e.target.value)}
                    placeholder="Add internal notes about follow-up actions, responses, etc."
                    rows={4}
                    className="mt-1"
                  />
                  <Button onClick={saveFollowUpNotes} className="mt-2">
                    Save Notes
                  </Button>
                </div>

                {selectedSubmission.is_urgent && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-semibold">This is marked as urgent</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Contact;
