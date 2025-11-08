import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DollarSign,
  Users,
  LogOut,
  Mail,
  Calendar,
  FileText,
  Image,
  Heart,
  MessageSquare,
  BookOpen,
  Church,
  UsersRound,
  Package,
  TrendingUp,
  Video,
  Baby,
} from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalDonations: 0,
    donationAmount: 0,
    totalEvents: 0,
    totalPrayers: 0,
    totalChurches: 0,
    totalMembers: 0,
    totalResources: 0,
    totalSermons: 0,
    totalVolunteers: 0,
    totalUsers: 0,
  });
  const [donationTrend, setDonationTrend] = useState<any[]>([]);
  const [membershipGrowth, setMembershipGrowth] = useState<any[]>([]);
  const [churchDistribution, setChurchDistribution] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

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
    const [
      contacts,
      donations,
      events,
      prayers,
      churches,
      members,
      resources,
      sermons,
      volunteers,
      users,
    ] = await Promise.all([
      supabase.from("contact_submissions").select("*", { count: "exact", head: true }),
      supabase.from("donations").select("amount"),
      supabase.from("events").select("*", { count: "exact", head: true }),
      supabase.from("prayer_requests").select("*", { count: "exact", head: true }),
      supabase.from("churches").select("*", { count: "exact", head: true }),
      supabase.from("church_members").select("*", { count: "exact", head: true }),
      supabase.from("church_resources").select("*", { count: "exact", head: true }),
      supabase.from("sermons").select("*", { count: "exact", head: true }),
      supabase.from("volunteer_submissions").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
    ]);

    const donationAmount = donations.data?.reduce((sum, d) => sum + (Number(d.amount) || 0), 0) || 0;

    setStats({
      totalContacts: contacts.count ?? 0,
      totalDonations: donations.data?.length ?? 0,
      donationAmount,
      totalEvents: events.count ?? 0,
      totalPrayers: prayers.count ?? 0,
      totalChurches: churches.count ?? 0,
      totalMembers: members.count ?? 0,
      totalResources: resources.count ?? 0,
      totalSermons: sermons.count ?? 0,
      totalVolunteers: volunteers.count ?? 0,
      totalUsers: users.count ?? 0,
    });

    // Fetch donation trend (last 6 months)
    await fetchDonationTrend();
    await fetchMembershipGrowth();
    await fetchChurchDistribution();
    await fetchRecentActivity();
  };

  const fetchDonationTrend = async () => {
    const { data } = await supabase
      .from("donations")
      .select("created_at, amount")
      .order("created_at", { ascending: true });

    if (data) {
      const monthlyData: Record<string, number> = {};
      data.forEach((donation) => {
        const month = new Date(donation.created_at).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        monthlyData[month] = (monthlyData[month] || 0) + Number(donation.amount);
      });

      const trend = Object.entries(monthlyData).map(([month, amount]) => ({
        month,
        amount,
      }));
      setDonationTrend(trend.slice(-6));
    }
  };

  const fetchMembershipGrowth = async () => {
    const { data } = await supabase
      .from("church_members")
      .select("membership_date")
      .order("membership_date", { ascending: true });

    if (data) {
      const monthlyData: Record<string, number> = {};
      data.forEach((member) => {
        const month = new Date(member.membership_date).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        monthlyData[month] = (monthlyData[month] || 0) + 1;
      });

      let cumulative = 0;
      const growth = Object.entries(monthlyData).map(([month, count]) => {
        cumulative += count;
        return { month, members: cumulative };
      });
      setMembershipGrowth(growth.slice(-6));
    }
  };

  const fetchChurchDistribution = async () => {
    const { data } = await supabase
      .from("churches")
      .select("name, member_count");

    if (data) {
      setChurchDistribution(data.slice(0, 5));
    }
  };

  const fetchRecentActivity = async () => {
    const [newMembers, newDonations, newEvents] = await Promise.all([
      supabase.from("church_members").select("first_name, last_name, created_at").order("created_at", { ascending: false }).limit(3),
      supabase.from("donations").select("amount, created_at").order("created_at", { ascending: false }).limit(3),
      supabase.from("events").select("title, created_at").order("created_at", { ascending: false }).limit(3),
    ]);

    const activities = [];
    if (newMembers.data) {
      activities.push(...newMembers.data.map(m => ({
        type: "member",
        text: `New member: ${m.first_name} ${m.last_name}`,
        time: new Date(m.created_at).toLocaleDateString(),
      })));
    }
    if (newDonations.data) {
      activities.push(...newDonations.data.map(d => ({
        type: "donation",
        text: `Donation received: $${d.amount}`,
        time: new Date(d.created_at).toLocaleDateString(),
      })));
    }
    if (newEvents.data) {
      activities.push(...newEvents.data.map(e => ({
        type: "event",
        text: `New event: ${e.title}`,
        time: new Date(e.created_at).toLocaleDateString(),
      })));
    }

    setRecentActivity(activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10));
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

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Admin</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Main Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Churches"
            value={stats.totalChurches}
            icon={Church}
            trend="+12.5%"
            trendUp
          />
          <StatsCard
            title="Church Members"
            value={stats.totalMembers}
            icon={UsersRound}
            trend="+18.2%"
            trendUp
          />
          <StatsCard
            title="Total Donations"
            value={`$${stats.donationAmount.toLocaleString()}`}
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
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Resources"
            value={stats.totalResources}
            icon={Package}
            trend="+8.5%"
            trendUp
          />
          <StatsCard
            title="Sermons"
            value={stats.totalSermons}
            icon={Video}
            trend="+15.3%"
            trendUp
          />
          <StatsCard
            title="Volunteers"
            value={stats.totalVolunteers}
            icon={Users}
            trend="+6.7%"
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

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Donation Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Donation Trend</CardTitle>
              <CardDescription>Monthly donation amounts (Last 6 months)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={donationTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Amount ($)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Membership Growth */}
          <Card>
            <CardHeader>
              <CardTitle>Membership Growth</CardTitle>
              <CardDescription>Cumulative member count over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={membershipGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="members" fill="hsl(var(--chart-2))" name="Total Members" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Church Distribution & Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Church Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Church Distribution</CardTitle>
              <CardDescription>Members by church (Top 5)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={churchDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={80}
                    fill="hsl(var(--chart-1))"
                    dataKey="member_count"
                  >
                    {churchDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates across the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                      <div className={`p-2 rounded-full ${
                        activity.type === "member" ? "bg-blue-100 dark:bg-blue-900" :
                        activity.type === "donation" ? "bg-green-100 dark:bg-green-900" :
                        "bg-purple-100 dark:bg-purple-900"
                      }`}>
                        {activity.type === "member" && <UsersRound className="h-4 w-4" />}
                        {activity.type === "donation" && <DollarSign className="h-4 w-4" />}
                        {activity.type === "event" && <Calendar className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.text}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your church content</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button variant="outline" className="justify-start" onClick={() => navigate("/admin/churches")}>
                <Church className="mr-2 h-4 w-4" />
                Manage Churches
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate("/admin/church-members")}>
                <UsersRound className="mr-2 h-4 w-4" />
                Manage Members
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate("/admin/donations")}>
                <DollarSign className="mr-2 h-4 w-4" />
                View Donations
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate("/admin/events")}>
                <Calendar className="mr-2 h-4 w-4" />
                Manage Events
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Update website content</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button variant="outline" className="justify-start" onClick={() => navigate("/admin/sermons")}>
                <Video className="mr-2 h-4 w-4" />
                Manage Sermons
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate("/admin/gallery")}>
                <Image className="mr-2 h-4 w-4" />
                Update Gallery
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate("/admin/blog")}>
                <BookOpen className="mr-2 h-4 w-4" />
                Blog Posts
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate("/admin/prayers")}>
                <Heart className="mr-2 h-4 w-4" />
                Prayer Requests
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
