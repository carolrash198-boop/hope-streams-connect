import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, DollarSign, TrendingUp } from "lucide-react";
import TablePagination from "@/components/admin/TablePagination";
import { formatKES, convertToKES } from "@/lib/currencyUtils";

interface Tithe {
  id: string;
  church_id: string;
  member_id: string | null;
  amount: number;
  currency: string;
  amount_in_kes: number;
  payment_method: string | null;
  payment_date: string;
  transaction_reference: string | null;
  notes: string | null;
  created_at: string;
}

interface Church {
  id: string;
  name: string;
}

interface Member {
  id: string;
  first_name: string;
  last_name: string;
}

const Tithes = () => {
  const navigate = useNavigate();
  const [tithes, setTithes] = useState<Tithe[]>([]);
  const [churches, setChurches] = useState<Church[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTithe, setEditingTithe] = useState<Tithe | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state
  const [formData, setFormData] = useState({
    church_id: "",
    member_id: "",
    amount: "",
    currency: "KES",
    payment_method: "",
    payment_date: new Date().toISOString().split('T')[0],
    transaction_reference: "",
    notes: "",
  });

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/admin/auth");
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      toast.error("Unauthorized access");
      navigate("/admin/auth");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tithesRes, churchesRes, membersRes] = await Promise.all([
        supabase.from("tithes").select("*").order("payment_date", { ascending: false }),
        supabase.from("churches").select("id, name").order("name"),
        supabase.from("church_members").select("id, first_name, last_name").order("first_name"),
      ]);

      if (tithesRes.error) {
        console.error("Error fetching tithes:", tithesRes.error);
        toast.error("Failed to load tithes: " + tithesRes.error.message);
      } else {
        setTithes(tithesRes.data || []);
      }

      if (churchesRes.error) {
        console.error("Error fetching churches:", churchesRes.error);
        toast.error("Failed to load churches: " + churchesRes.error.message);
      } else {
        setChurches(churchesRes.data || []);
        if (!churchesRes.data || churchesRes.data.length === 0) {
          toast.info("No churches found. Please add a church first.");
        }
      }

      if (membersRes.error) {
        console.error("Error fetching members:", membersRes.error);
        toast.error("Failed to load members: " + membersRes.error.message);
      } else {
        setMembers(membersRes.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalTithes = () => {
    return tithes.reduce((sum, tithe) => sum + Number(tithe.amount_in_kes), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.church_id) {
      toast.error("Please select a church");
      return;
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (!formData.payment_date) {
      toast.error("Please select a payment date");
      return;
    }
    
    try {
      const amount = parseFloat(formData.amount);
      const amountInKes = await convertToKES(amount, formData.currency);

      const titheData = {
        church_id: formData.church_id,
        member_id: formData.member_id || null,
        amount,
        currency: formData.currency,
        amount_in_kes: amountInKes,
        payment_method: formData.payment_method || null,
        payment_date: formData.payment_date,
        transaction_reference: formData.transaction_reference || null,
        notes: formData.notes || null,
      };

      if (editingTithe) {
        const { error } = await supabase
          .from("tithes")
          .update(titheData)
          .eq("id", editingTithe.id);

        if (error) {
          console.error("Error updating tithe:", error);
          toast.error("Failed to update tithe: " + error.message);
          return;
        }
        toast.success("Tithe updated successfully");
      } else {
        const { error } = await supabase
          .from("tithes")
          .insert([titheData]);

        if (error) {
          console.error("Error adding tithe:", error);
          toast.error("Failed to add tithe: " + error.message);
          return;
        }
        toast.success("Tithe added successfully");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error processing tithe:", error);
      toast.error("An error occurred while processing the tithe");
    }
  };

  const handleEdit = (tithe: Tithe) => {
    setEditingTithe(tithe);
    setFormData({
      church_id: tithe.church_id,
      member_id: tithe.member_id || "",
      amount: tithe.amount.toString(),
      currency: tithe.currency,
      payment_method: tithe.payment_method || "",
      payment_date: tithe.payment_date,
      transaction_reference: tithe.transaction_reference || "",
      notes: tithe.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tithe record?")) return;

    const { error } = await supabase.from("tithes").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete tithe");
      return;
    }

    toast.success("Tithe deleted successfully");
    fetchData();
  };

  const resetForm = () => {
    setFormData({
      church_id: "",
      member_id: "",
      amount: "",
      currency: "KES",
      payment_method: "",
      payment_date: new Date().toISOString().split('T')[0],
      transaction_reference: "",
      notes: "",
    });
    setEditingTithe(null);
  };

  const getChurchName = (churchId: string) => {
    const church = churches.find(c => c.id === churchId);
    return church?.name || "Unknown";
  };

  const getMemberName = (memberId: string | null) => {
    if (!memberId) return "Anonymous";
    const member = members.find(m => m.id === memberId);
    return member ? `${member.first_name} ${member.last_name}` : "Unknown";
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tithes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tithes.length / itemsPerPage);

  return (
    <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Tithe Management</h1>
            <p className="text-muted-foreground">Manage church tithes and offerings</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Add Tithe
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingTithe ? "Edit Tithe" : "Add New Tithe"}</DialogTitle>
                <DialogDescription>
                  Enter tithe details. All amounts will be converted to KES.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="church_id">Church *</Label>
                    <Select
                      value={formData.church_id}
                      onValueChange={(value) => setFormData({ ...formData, church_id: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select church" />
                      </SelectTrigger>
                      <SelectContent>
                        {churches.map((church) => (
                          <SelectItem key={church.id} value={church.id}>
                            {church.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="member_id">Member (Optional)</Label>
                    <Select
                      value={formData.member_id}
                      onValueChange={(value) => setFormData({ ...formData, member_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select member" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Anonymous</SelectItem>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.first_name} {member.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency *</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => setFormData({ ...formData, currency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KES">KES (Kenyan Shilling)</SelectItem>
                        <SelectItem value="USD">USD (US Dollar)</SelectItem>
                        <SelectItem value="EUR">EUR (Euro)</SelectItem>
                        <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                        <SelectItem value="ZAR">ZAR (South African Rand)</SelectItem>
                        <SelectItem value="UGX">UGX (Ugandan Shilling)</SelectItem>
                        <SelectItem value="TZS">TZS (Tanzanian Shilling)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment_method">Payment Method</Label>
                    <Input
                      id="payment_method"
                      value={formData.payment_method}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                      placeholder="e.g., M-Pesa, Bank Transfer"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment_date">Payment Date *</Label>
                    <Input
                      id="payment_date"
                      type="date"
                      value={formData.payment_date}
                      onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="transaction_reference">Transaction Reference</Label>
                    <Input
                      id="transaction_reference"
                      value={formData.transaction_reference}
                      onChange={(e) => setFormData({ ...formData, transaction_reference: e.target.value })}
                      placeholder="e.g., Transaction ID"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Additional notes"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingTithe ? "Update" : "Add"} Tithe
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tithes (KES)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatKES(calculateTotalTithes())}</div>
              <p className="text-xs text-muted-foreground">All time total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tithes.length}</div>
              <p className="text-xs text-muted-foreground">Tithe transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Churches</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{churches.length}</div>
              <p className="text-xs text-muted-foreground">Contributing churches</p>
            </CardContent>
          </Card>
        </div>

        {/* Tithes Table */}
        <Card>
          <CardHeader>
            <CardTitle>Tithe Records</CardTitle>
            <CardDescription>View and manage all tithe transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Church</TableHead>
                      <TableHead>Member</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Amount (KES)</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((tithe) => (
                      <TableRow key={tithe.id}>
                        <TableCell>{new Date(tithe.payment_date).toLocaleDateString()}</TableCell>
                        <TableCell>{getChurchName(tithe.church_id)}</TableCell>
                        <TableCell>{getMemberName(tithe.member_id)}</TableCell>
                        <TableCell>
                          {tithe.currency} {Number(tithe.amount).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatKES(Number(tithe.amount_in_kes))}
                        </TableCell>
                        <TableCell>{tithe.payment_method || "-"}</TableCell>
                        <TableCell className="text-xs">{tithe.transaction_reference || "-"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(tithe)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(tithe.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  totalItems={tithes.length}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
  );
};

export default Tithes;
