import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Heart, Copy, CheckCircle2, DollarSign } from "lucide-react";
import { AuthModal } from "@/components/auth/AuthModal";

interface Campaign {
  id: string;
  title: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  slug: string;
}

const Donate = () => {
  const [amount, setAmount] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [transactionCode, setTransactionCode] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [customCurrency, setCustomCurrency] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
    fetchPaymentMethods();
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchPaymentMethods = async () => {
    const { data, error } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("is_active", true)
      .order("display_order");

    if (error) {
      toast.error("Failed to load payment methods");
      return;
    }

    setPaymentMethods(data || []);
  };

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
    }).format(amount);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const maskAccountNumber = (account: string) => {
    if (account.length <= 4) return account;
    return account.slice(0, 2) + "*".repeat(account.length - 4) + account.slice(-2);
  };

  const handleProceedToPayment = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setShowPaymentForm(true);
  };

  const handleSubmitDonation = async () => {
    if (!transactionCode || !selectedPaymentMethod) {
      toast.error("Please fill in all required fields");
      return;
    }

    const finalCurrency = selectedCurrency === "other" ? customCurrency : selectedCurrency;

    const { error } = await supabase.from("donations").insert({
      user_id: user?.id,
      amount: parseFloat(amount),
      campaign_id: selectedCampaign || null,
      is_recurring: isRecurring,
      payment_method_id: selectedPaymentMethod,
      transaction_code: transactionCode,
      selected_currency: finalCurrency,
      verification_status: "pending",
      donor_email: user?.email,
    });

    if (error) {
      toast.error("Failed to submit donation");
      return;
    }

    toast.success("Donation submitted for verification!");
    setAmount("");
    setTransactionCode("");
    setShowPaymentForm(false);
  };

  const quickAmounts = [25, 50, 100, 250, 500, 1000];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Give a Gift
            </h1>
            <p className="text-xl text-muted-foreground">
              Your generosity helps us spread hope and serve our community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="group" onClick={() => document.getElementById('donate-now')?.scrollIntoView({ behavior: 'smooth' })}>
                <Heart className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Donate Now
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.getElementById('campaigns')?.scrollIntoView({ behavior: 'smooth' })}>
                View Campaigns
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Donation Section */}
      <section id="donate-now" className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="general" className="max-w-4xl mx-auto" onValueChange={(value) => {
            if (value === "general") setSelectedCampaign(null);
          }}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">General Giving</TabsTrigger>
              <TabsTrigger value="campaigns" id="campaigns">Specific Campaigns</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Fund Donation</CardTitle>
                  <CardDescription>Support our church's ongoing mission and ministry</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {quickAmounts.map((quickAmount) => (
                      <Button
                        key={quickAmount}
                        variant={amount === quickAmount.toString() ? "default" : "outline"}
                        onClick={() => setAmount(quickAmount.toString())}
                        size="sm"
                      >
                        ${quickAmount}
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Select Currency</Label>
                      <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                          <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                          <SelectItem value="other">Other (Type below)</SelectItem>
                        </SelectContent>
                      </Select>
                      {selectedCurrency === "other" && (
                        <Input
                          placeholder="Enter your currency code (e.g., JPY)"
                          value={customCurrency}
                          onChange={(e) => setCustomCurrency(e.target.value)}
                          className="mt-2"
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Enter Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        variant={!isRecurring ? "default" : "outline"}
                        onClick={() => setIsRecurring(false)}
                        className="flex-1"
                      >
                        One-time
                      </Button>
                      <Button
                        variant={isRecurring ? "default" : "outline"}
                        onClick={() => setIsRecurring(true)}
                        className="flex-1"
                      >
                        Monthly
                      </Button>
                    </div>
                  </div>

                  {!showPaymentForm ? (
                    <div className="pt-6 space-y-4">
                      <div className="bg-muted p-4 rounded-lg space-y-2">
                        <h3 className="font-semibold">Donation Summary</h3>
                        <div className="flex justify-between text-sm">
                          <span>Amount:</span>
                          <span className="font-medium">{selectedCurrency === "other" ? customCurrency : selectedCurrency} {amount || "0.00"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Frequency:</span>
                          <span className="font-medium">{isRecurring ? "Monthly" : "One-time"}</span>
                        </div>
                      </div>
                      <Button className="w-full" size="lg" onClick={handleProceedToPayment}>
                        Proceed to Payment
                      </Button>
                    </div>
                  ) : (
                    <div className="pt-6 space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">How to Pay</h3>
                        
                        {paymentMethods.map((method) => (
                          <Card key={method.id} className="p-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{method.provider_name}</h4>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(method.account_number)}
                                >
                                  <Copy className="h-4 w-4 mr-1" />
                                  Copy
                                </Button>
                              </div>
                              <p className="text-sm text-muted-foreground">{method.instructions}</p>
                              <div className="bg-muted p-2 rounded font-mono text-sm">
                                {method.account_name && <div>Name: {method.account_name}</div>}
                                <div>Account: {maskAccountNumber(method.account_number)}</div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>

                      <div className="space-y-4 border-t pt-6">
                        <h3 className="font-semibold text-lg">Submit Transaction Details</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="payment-method">Payment Method Used</Label>
                          <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                              {paymentMethods.map((method) => (
                                <SelectItem key={method.id} value={method.id}>
                                  {method.provider_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="transaction-code">Transaction Code/Reference</Label>
                          <Input
                            id="transaction-code"
                            placeholder="Enter your transaction code"
                            value={transactionCode}
                            onChange={(e) => setTransactionCode(e.target.value)}
                          />
                        </div>

                        <Button className="w-full" size="lg" onClick={handleSubmitDonation}>
                          <CheckCircle2 className="mr-2 h-5 w-5" />
                          Submit for Verification
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="campaigns" className="space-y-6">
              {loading ? (
                <div className="text-center py-12">Loading campaigns...</div>
              ) : campaigns.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No active campaigns at the moment.</p>
                  </CardContent>
                </Card>
              ) : (
                campaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardHeader>
                      <CardTitle>{campaign.title}</CardTitle>
                      <CardDescription>{campaign.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">
                            {formatAmount(campaign.current_amount)} of {formatAmount(campaign.goal_amount)}
                          </span>
                        </div>
                        <Progress 
                          value={(campaign.current_amount / campaign.goal_amount) * 100} 
                          className="h-2"
                        />
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => {
                          setSelectedCampaign(campaign.id);
                          handleProceedToPayment();
                        }}
                      >
                        <DollarSign className="mr-2 h-4 w-4" />
                        Support This Campaign
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
        onSuccess={checkUser}
      />
    </Layout>
  );
};

export default Donate;
