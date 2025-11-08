import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DollarSign, TrendingUp, Users, Target } from "lucide-react";

interface DonationTrend {
  date: string;
  amount: number;
  count: number;
}

interface TopDonor {
  name: string;
  email: string;
  total: number;
  donations: number;
}

interface CampaignMetric {
  id: string;
  title: string;
  goal: number;
  raised: number;
  donors: number;
  percentage: number;
}

const FundraisingAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30");
  const [totalRaised, setTotalRaised] = useState(0);
  const [totalDonors, setTotalDonors] = useState(0);
  const [averageDonation, setAverageDonation] = useState(0);
  const [donationTrends, setDonationTrends] = useState<DonationTrend[]>([]);
  const [topDonors, setTopDonors] = useState<TopDonor[]>([]);
  const [campaignMetrics, setCampaignMetrics] = useState<CampaignMetric[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const days = parseInt(timeRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Fetch verified donations within time range
      const { data: donations, error } = await supabase
        .from("donations")
        .select("*")
        .eq("verification_status", "verified")
        .gte("created_at", startDate.toISOString());

      if (error) throw error;

      // Calculate summary metrics
      const total = donations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0;
      const uniqueDonors = new Set(donations?.map(d => d.donor_email || d.user_id)).size;
      const average = donations && donations.length > 0 ? total / donations.length : 0;

      setTotalRaised(total);
      setTotalDonors(uniqueDonors);
      setAverageDonation(average);

      // Calculate daily trends
      const trendMap = new Map<string, { amount: number; count: number }>();
      donations?.forEach(d => {
        const date = new Date(d.created_at).toLocaleDateString();
        const existing = trendMap.get(date) || { amount: 0, count: 0 };
        trendMap.set(date, {
          amount: existing.amount + Number(d.amount),
          count: existing.count + 1,
        });
      });

      const trends = Array.from(trendMap.entries())
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setDonationTrends(trends);

      // Calculate top donors
      const donorMap = new Map<string, { name: string; total: number; count: number }>();
      donations?.forEach(d => {
        const key = d.donor_email || d.user_id || "Anonymous";
        const name = d.donor_email 
          ? `${d.donor_first_name || ""} ${d.donor_last_name || ""}`.trim() || d.donor_email
          : "Anonymous";
        
        const existing = donorMap.get(key) || { name, total: 0, count: 0 };
        donorMap.set(key, {
          name,
          total: existing.total + Number(d.amount),
          count: existing.count + 1,
        });
      });

      const topDonorsList = Array.from(donorMap.entries())
        .map(([email, data]) => ({
          email,
          name: data.name,
          total: data.total,
          donations: data.count,
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);

      setTopDonors(topDonorsList);

      // Fetch campaign performance
      const { data: campaigns } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (campaigns) {
        const metrics = await Promise.all(
          campaigns.map(async (campaign) => {
            const { count } = await supabase
              .from("donations")
              .select("*", { count: "exact", head: true })
              .eq("campaign_id", campaign.id)
              .eq("verification_status", "verified");

            return {
              id: campaign.id,
              title: campaign.title,
              goal: Number(campaign.goal_amount),
              raised: Number(campaign.current_amount),
              donors: count || 0,
              percentage: (Number(campaign.current_amount) / Number(campaign.goal_amount)) * 100,
            };
          })
        );

        setCampaignMetrics(metrics);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return <div className="p-6">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fundraising Analytics</h1>
          <p className="text-muted-foreground">Track donation trends and campaign performance</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRaised)}</div>
            <p className="text-xs text-muted-foreground">Verified donations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDonors}</div>
            <p className="text-xs text-muted-foreground">Unique contributors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Donation</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageDonation)}</div>
            <p className="text-xs text-muted-foreground">Per donation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignMetrics.length}</div>
            <p className="text-xs text-muted-foreground">Fundraising campaigns</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Donation Trends</TabsTrigger>
          <TabsTrigger value="donors">Top Donors</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Donation Trends Over Time</CardTitle>
              <CardDescription>Daily donation amounts and frequency</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={donationTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value: any, name: string) => {
                      if (name === "amount") return formatCurrency(Number(value));
                      return value;
                    }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="amount" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Amount"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="count" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={2}
                    name="Donations"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Donors</CardTitle>
              <CardDescription>Highest contributing donors in the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topDonors.map((donor, index) => (
                  <div key={donor.email} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{donor.name}</p>
                        <p className="text-sm text-muted-foreground">{donor.donations} donation(s)</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(donor.total)}</p>
                    </div>
                  </div>
                ))}
                {topDonors.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No donor data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Progress and metrics for all fundraising campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {campaignMetrics.map((campaign) => (
                  <div key={campaign.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{campaign.title}</h4>
                        <p className="text-sm text-muted-foreground">{campaign.donors} donors</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(campaign.raised)}</p>
                        <p className="text-sm text-muted-foreground">
                          of {formatCurrency(campaign.goal)}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Progress value={Math.min(campaign.percentage, 100)} className="h-2" />
                      <p className="text-xs text-muted-foreground text-right">
                        {campaign.percentage.toFixed(1)}% reached
                      </p>
                    </div>
                  </div>
                ))}
                {campaignMetrics.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No campaign data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FundraisingAnalytics;
