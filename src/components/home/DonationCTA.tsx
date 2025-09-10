import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart, Target, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";

interface Campaign {
  id: string;
  title: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  slug: string;
}

export const DonationCTA = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveCampaigns();
  }, []);

  const fetchActiveCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, title, description, goal_amount, current_amount, slug')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(2);

      if (error) {
        console.error('Error fetching campaigns:', error);
        return;
      }

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
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="mb-6">Support Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your generous giving helps us serve our community, support families in need, 
              and spread God's love throughout our city.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Give Section */}
            <div className="lg:col-span-1">
              <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center">
                    <Heart className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="mb-4">Quick Give</h3>
                  <p className="text-muted-foreground mb-6 text-sm">
                    Make a one-time gift to support our general ministry and operations.
                  </p>
                  <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link to="/donate">
                      Give Now
                    </Link>
                  </Button>
                  
                  <div className="mt-6 pt-6 border-t">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <Zap className="h-5 w-5 mx-auto mb-1 text-accent" />
                        <p className="text-xs text-muted-foreground">Secure</p>
                      </div>
                      <div>
                        <Target className="h-5 w-5 mx-auto mb-1 text-accent" />
                        <p className="text-xs text-muted-foreground">Direct Impact</p>
                      </div>
                      <div>
                        <Users className="h-5 w-5 mx-auto mb-1 text-accent" />
                        <p className="text-xs text-muted-foreground">Community</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Campaigns */}
            <div className="lg:col-span-2">
              {loading ? (
                <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-32 bg-muted rounded-xl"></div>
                    </div>
                  ))}
                </div>
              ) : campaigns.length > 0 ? (
                <div className="space-y-6">
                  {campaigns.map((campaign) => {
                    const progressPercentage = getProgressPercentage(
                      campaign.current_amount,
                      campaign.goal_amount
                    );

                    return (
                      <Card key={campaign.id} className="overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                            <div className="flex-1 mb-4 sm:mb-0">
                              <h4 className="text-lg font-semibold mb-2">{campaign.title}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {campaign.description}
                              </p>
                            </div>
                            <Button asChild variant="outline" size="sm" className="shrink-0">
                              <Link to={`/donate/campaigns/${campaign.slug}`}>
                                Support
                              </Link>
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">
                                {formatAmount(campaign.current_amount)} of {formatAmount(campaign.goal_amount)}
                              </span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                            <div className="text-right">
                              <span className="text-xs text-muted-foreground">
                                {progressPercentage.toFixed(0)}% complete
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Target className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h4 className="text-lg font-semibold mb-2">No Active Campaigns</h4>
                    <p className="text-muted-foreground mb-6">
                      Check back soon for special fundraising campaigns and ministry initiatives.
                    </p>
                    <Button asChild variant="outline">
                      <Link to="/donate">
                        Give to General Fund
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground mb-4">
              "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." - 2 Corinthians 9:7
            </p>
            <Button asChild variant="outline" size="lg">
              <Link to="/donate">
                View All Giving Options
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};