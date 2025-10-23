import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

const Prayers = () => {
  const [prayers, setPrayers] = useState<any[]>([]);

  useEffect(() => {
    fetchPrayers();
  }, []);

  const fetchPrayers = async () => {
    const { data, error } = await supabase
      .from("prayer_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load prayer requests");
    } else {
      setPrayers(data || []);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this prayer request?")) return;

    const { error } = await supabase
      .from("prayer_requests")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete prayer request");
    } else {
      toast.success("Prayer request deleted successfully");
      fetchPrayers();
    }
  };

  const updateStatus = async (id: string, status: "pending" | "public" | "confidential" | "follow_up_needed") => {
    const { error } = await supabase
      .from("prayer_requests")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success("Status updated");
      fetchPrayers();
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/10">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Prayer Requests</h1>
          <p className="text-muted-foreground">View and manage prayer requests</p>
        </div>

        <div className="grid gap-4">
          {prayers.map((prayer) => (
            <Card key={prayer.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{prayer.first_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(prayer.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <select
                      value={prayer.status}
                      onChange={(e) => updateStatus(prayer.id, e.target.value as "pending" | "public" | "confidential" | "follow_up_needed")}
                      className="px-3 py-1 rounded border"
                    >
                      <option value="pending">Pending</option>
                      <option value="public">Public</option>
                      <option value="confidential">Confidential</option>
                      <option value="follow_up_needed">Follow Up Needed</option>
                    </select>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(prayer.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="font-semibold">{prayer.subject}</p>
                  <p className="text-muted-foreground mt-2">{prayer.message}</p>
                </div>

                {prayer.is_urgent && (
                  <Badge variant="destructive" className="mt-4">Urgent</Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Prayers;
