import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DollarSign, CheckCircle2, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Donations = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const { data, error } = await supabase
        .from("donations")
        .select(`
          *,
          payment_methods(provider_name),
          campaigns(title)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setDonations(data || []);
      
      // Calculate total amount
      const total = (data || []).reduce((sum, donation) => sum + Number(donation.amount), 0);
      setTotalAmount(total);
    } catch (error) {
      console.error("Error fetching donations:", error);
      toast.error("Failed to fetch donations");
    }
  };

  const handleVerifyDonation = async (id: string, status: 'verified' | 'rejected') => {
    // Get donation details first
    const { data: donation, error: fetchError } = await supabase
      .from("donations")
      .select("amount, campaign_id")
      .eq("id", id)
      .single();

    if (fetchError) {
      toast.error("Failed to fetch donation details");
      return;
    }

    // Update donation status
    const { error } = await supabase
      .from("donations")
      .update({ verification_status: status })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update donation status");
      return;
    }

    // If verified and donation is for a campaign, update campaign progress
    if (status === "verified" && donation.campaign_id) {
      const { data: campaign, error: campaignFetchError } = await supabase
        .from("campaigns")
        .select("current_amount")
        .eq("id", donation.campaign_id)
        .single();

      if (!campaignFetchError && campaign) {
        const newAmount = campaign.current_amount + donation.amount;
        
        await supabase
          .from("campaigns")
          .update({ current_amount: newAmount })
          .eq("id", donation.campaign_id);
      }
    }

    toast.success(`Donation ${status} successfully`);
    fetchDonations();
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      verified: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  return (
    <main className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Donations</h1>
          <p className="text-muted-foreground">Manage and verify donation submissions</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-6 w-6" />
              <span>Total Donations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">${totalAmount.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Donation Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Donor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Transaction Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations.map((donation: any) => (
                    <TableRow key={donation.id}>
                      <TableCell>
                        {new Date(donation.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {donation.is_anonymous
                          ? "Anonymous"
                          : donation.donor_email || "N/A"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {donation.amount}
                      </TableCell>
                      <TableCell>
                        {donation.selected_currency || "USD"}
                      </TableCell>
                      <TableCell>
                        {donation.campaigns?.title || "General Fund"}
                      </TableCell>
                      <TableCell>
                        {donation.payment_methods?.provider_name || "N/A"}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {donation.transaction_code || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(donation.verification_status)}>
                          {donation.verification_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {donation.verification_status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleVerifyDonation(donation.id, "verified")}
                            >
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleVerifyDonation(donation.id, "rejected")}
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
  );
};

export default Donations;
