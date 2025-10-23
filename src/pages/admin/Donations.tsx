import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const Donations = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    const { data, error } = await supabase
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load donations");
    } else {
      setDonations(data || []);
      const total = data?.reduce((sum, d) => sum + parseFloat(d.amount.toString()), 0) || 0;
      setTotalAmount(total);
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/10">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Donations</h1>
          <p className="text-muted-foreground">View donation history</p>
          <p className="text-2xl font-bold mt-4">Total: ${totalAmount.toFixed(2)}</p>
        </div>

        <div className="grid gap-4">
          {donations.map((donation) => (
            <Card key={donation.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {donation.is_anonymous ? "Anonymous" : `${donation.donor_first_name} ${donation.donor_last_name}`}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(donation.created_at).toLocaleString()}
                    </p>
                    {!donation.is_anonymous && donation.donor_email && (
                      <p className="text-sm text-muted-foreground">{donation.donor_email}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${parseFloat(donation.amount.toString()).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{donation.status}</p>
                    {donation.is_recurring && (
                      <p className="text-xs text-primary">Recurring: {donation.recurrence_interval}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Donations;
