import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Heart, CreditCard, Calendar, Target, Users, Church, Globe, GraduationCap, Shield } from "lucide-react";

const Donate = () => {
  const [amount, setAmount] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data } = await supabase
        .from('campaigns')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const quickAmounts = [25, 50, 100, 250, 500, 1000];

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-accent to-accent/80 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6">Give a Gift</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Your generous giving helps us serve our community, support families in need, 
              and spread God's love. Every gift makes a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <a href="#donate-now">Give Now</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-accent">
                <a href="#campaigns">View Campaigns</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Donation Form */}
        <section id="donate-now" className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="general">General Giving</TabsTrigger>
                  <TabsTrigger value="campaigns">Specific Campaigns</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Heart className="h-6 w-6 text-accent" />
                        <span>General Fund Donation</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Quick Amount Buttons */}
                      <div>
                        <Label className="text-base font-medium mb-4 block">Select Amount</Label>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                          {quickAmounts.map((quickAmount) => (
                            <Button
                              key={quickAmount}
                              variant={amount === quickAmount.toString() ? "default" : "outline"}
                              onClick={() => setAmount(quickAmount.toString())}
                              className="h-12"
                            >
                              ${quickAmount}
                            </Button>
                          ))}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">$</span>
                          <Input
                            type="number"
                            placeholder="Enter custom amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="text-lg"
                          />
                        </div>
                      </div>

                      {/* Frequency */}
                      <div>
                        <Label className="text-base font-medium mb-4 block">Frequency</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <Button
                            variant={!isRecurring ? "default" : "outline"}
                            onClick={() => setIsRecurring(false)}
                            className="h-12"
                          >
                            One-Time Gift
                          </Button>
                          <Button
                            variant={isRecurring ? "default" : "outline"}
                            onClick={() => setIsRecurring(true)}
                            className="h-12"
                          >
                            Monthly Giving
                          </Button>
                        </div>
                      </div>

                      {/* Summary */}
                      {amount && (
                        <div className="bg-accent/10 rounded-lg p-4">
                          <h3 className="font-semibold mb-2">Donation Summary</h3>
                          <p className="text-lg">
                            <span className="font-bold text-accent">${amount}</span>
                            {isRecurring ? " per month" : " one-time"}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Supporting Deliverance Church General Fund
                          </p>
                        </div>
                      )}

                      <Button 
                        className="w-full h-12 text-lg"
                        disabled={!amount || parseFloat(amount) <= 0}
                      >
                        <CreditCard className="h-5 w-5 mr-2" />
                        Proceed to Payment
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="campaigns" className="mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {campaigns.map((campaign) => {
                      const progress = campaign.goal_amount ? 
                        (campaign.current_amount / campaign.goal_amount) * 100 : 0;
                      
                      return (
                        <Card key={campaign.id}>
                          <CardContent className="p-6">
                            <h3 className="font-semibold mb-2">{campaign.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              {campaign.description}
                            </p>
                            
                            {campaign.goal_amount && (
                              <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                  <span>Progress</span>
                                  <span>
                                    {formatAmount(campaign.current_amount)} of {formatAmount(campaign.goal_amount)}
                                  </span>
                                </div>
                                <Progress value={progress} className="h-2" />
                                <p className="text-xs text-muted-foreground text-right">
                                  {progress.toFixed(0)}% complete
                                </p>
                              </div>
                            )}
                            
                            <Button className="w-full">
                              <Heart className="h-4 w-4 mr-2" />
                              Support This Campaign
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Security & Trust */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="mb-6">Safe & Secure Giving</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Your generosity is protected by industry-leading security measures.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-accent" />
                <h3 className="font-semibold mb-2">SSL Encrypted</h3>
                <p className="text-sm text-muted-foreground">Bank-level security</p>
              </div>
              <div className="text-center">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-accent" />
                <h3 className="font-semibold mb-2">Multiple Options</h3>
                <p className="text-sm text-muted-foreground">Credit, debit, ACH</p>
              </div>
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-accent" />
                <h3 className="font-semibold mb-2">Flexible Giving</h3>
                <p className="text-sm text-muted-foreground">One-time or recurring</p>
              </div>
              <div className="text-center">
                <Target className="h-12 w-12 mx-auto mb-4 text-accent" />
                <h3 className="font-semibold mb-2">Tax Receipts</h3>
                <p className="text-sm text-muted-foreground">Instant confirmation</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Donate;