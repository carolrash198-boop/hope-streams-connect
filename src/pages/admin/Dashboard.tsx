import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Eye,
  Users,
  LogOut,
  Mail,
  Calendar,
  FileText,
  Image,
  Heart,
  MessageSquare,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import StatsCard from "@/components/admin/StatsCard";
import RecentSignups from "@/components/admin/RecentSignups";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalDonations: 0,
    totalEvents: 0,
    totalPrayers: 0,
  });

  useEffect(() => {
    checkAuth();
    fetchStats();
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
      await supabase.auth.signOut();
      toast.error("Unauthorized access");
      navigate("/admin/auth");
      return;
    }

    setUser(session.user);
  };

  const fetchStats = async () => {
    const [contacts, donations, events, prayers] = await Promise.all([
      supabase.from("contact_submissions").select("*", { count: "exact", head: true }),
      supabase.from("donations").select("*", { count: "exact", head: true }),
      supabase.from("events").select("*", { count: "exact", head: true }),
      supabase.from("prayer_requests").select("*", { count: "exact", head: true }),
    ]);

    setStats({
      totalContacts: contacts.count ?? 0,
      totalDonations: donations.count ?? 0,
      totalEvents: events.count ?? 0,
      totalPrayers: prayers.count ?? 0,
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/admin/auth");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/10">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Admin</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            title="Total Contacts"
            value={stats.totalContacts}
            icon={MessageSquare}
            trend="+12.5%"
            trendUp
          />
          <StatsCard
            title="Total Donations"
            value={`$${stats.totalDonations}`}
            icon={DollarSign}
            trend="+23.1%"
            trendUp
          />
          <StatsCard
            title="Active Events"
            value={stats.totalEvents}
            icon={Calendar}
            trend="+5.2%"
            trendUp
          />
          <StatsCard
            title="Prayer Requests"
            value={stats.totalPrayers}
            icon={Heart}
            trend="+8.3%"
            trendUp
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your church content</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Button variant="outline" className="justify-start">
                <Mail className="mr-2 h-4 w-4" />
                View Contact Submissions
              </Button>
              <Button variant="outline" className="justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Manage Events
              </Button>
              <Button variant="outline" className="justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Manage Sermons
              </Button>
              <Button variant="outline" className="justify-start">
                <Image className="mr-2 h-4 w-4" />
                Update Gallery
              </Button>
            </CardContent>
          </Card>

          <RecentSignups />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
