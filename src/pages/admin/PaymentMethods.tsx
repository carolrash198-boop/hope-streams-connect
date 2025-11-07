import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const PaymentMethods = () => {
  const [methods, setMethods] = useState<any[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingMethod, setEditingMethod] = useState<any>(null);
  const [formData, setFormData] = useState({
    method_type: "mpesa",
    provider_name: "",
    account_number: "",
    account_name: "",
    instructions: "",
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    const { data, error } = await supabase
      .from("payment_methods")
      .select("*")
      .order("display_order");

    if (error) {
      toast.error("Failed to load payment methods");
      return;
    }

    setMethods(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingMethod) {
      const { error } = await supabase
        .from("payment_methods")
        .update(formData)
        .eq("id", editingMethod.id);

      if (error) {
        toast.error("Failed to update payment method");
        return;
      }
      toast.success("Payment method updated successfully");
    } else {
      const { error } = await supabase
        .from("payment_methods")
        .insert(formData);

      if (error) {
        toast.error("Failed to create payment method");
        return;
      }
      toast.success("Payment method created successfully");
    }

    setShowDialog(false);
    setEditingMethod(null);
    resetForm();
    fetchMethods();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment method?")) return;

    const { error } = await supabase
      .from("payment_methods")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete payment method");
      return;
    }

    toast.success("Payment method deleted successfully");
    fetchMethods();
  };

  const resetForm = () => {
    setFormData({
      method_type: "mpesa",
      provider_name: "",
      account_number: "",
      account_name: "",
      instructions: "",
      is_active: true,
      display_order: 0,
    });
  };

  const handleEdit = (method: any) => {
    setEditingMethod(method);
    setFormData(method);
    setShowDialog(true);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Payment Methods</h1>
            <p className="text-muted-foreground">Manage donation payment options</p>
          </div>
          <Button onClick={() => {
            resetForm();
            setEditingMethod(null);
            setShowDialog(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Method
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {methods.map((method) => (
            <Card key={method.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {method.provider_name}
                  <span className={`text-xs px-2 py-1 rounded ${method.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {method.is_active ? 'Active' : 'Inactive'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Type:</span> {method.method_type}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Account:</span> {method.account_number}
                </div>
                {method.account_name && (
                  <div className="text-sm">
                    <span className="font-medium">Name:</span> {method.account_name}
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  {method.instructions}
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(method)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(method.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingMethod ? 'Edit' : 'Add'} Payment Method</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="method_type">Method Type</Label>
                <Select
                  value={formData.method_type}
                  onValueChange={(value) => setFormData({ ...formData, method_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mpesa">M-Pesa</SelectItem>
                    <SelectItem value="remitly">Remitly</SelectItem>
                    <SelectItem value="bank">Bank Account</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider_name">Provider Name</Label>
                <Input
                  id="provider_name"
                  value={formData.provider_name}
                  onChange={(e) => setFormData({ ...formData, provider_name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account_number">Account Number</Label>
                <Input
                  id="account_number"
                  value={formData.account_number}
                  onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account_name">Account Name (Optional)</Label>
                <Input
                  id="account_name"
                  value={formData.account_name}
                  onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <Button type="submit" className="w-full">
                {editingMethod ? 'Update' : 'Create'} Payment Method
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default PaymentMethods;
