import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Users, Home, Utensils, GraduationCap, Globe, Calendar, MapPin, Clock, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import * as LucideIcons from "lucide-react";

interface OutreachProject {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  impact_metric: string | null;
  schedule: string | null;
  volunteers_needed: string | null;
  location: string | null;
  is_urgent: boolean;
  project_type: string;
}

const Outreach = () => {
  const [currentProjects, setCurrentProjects] = useState<OutreachProject[]>([]);
  const [impactStories, setImpactStories] = useState<OutreachProject[]>([]);
  const [volunteerOpportunities, setVolunteerOpportunities] = useState<OutreachProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [volunteerDialogOpen, setVolunteerDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    areas_of_interest: [] as string[],
    availability: "",
    message: "",
    skills: ""
  });

  const areaOptions = [
    "Food Bank",
    "Homeless Shelter",
    "Affordable Housing",
    "Youth Programs",
    "Community Events",
    "Administrative Support",
    "Other"
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from("outreach_projects")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (error) throw error;

        const projects = data || [];
        setCurrentProjects(projects.filter(p => p.project_type === "current_project"));
        setImpactStories(projects.filter(p => p.project_type === "impact_story"));
        setVolunteerOpportunities(projects.filter(p => p.project_type === "volunteer_opportunity"));
      } catch (error) {
        console.error("Error fetching outreach projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("volunteer_submissions")
        .insert([{
          ...formData,
          user_id: user?.id || null
        }]);

      if (error) throw error;

      toast.success("Thank you for volunteering! We'll be in touch soon.");
      setVolunteerDialogOpen(false);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        areas_of_interest: [],
        availability: "",
        message: "",
        skills: ""
      });
    } catch (error: any) {
      toast.error("Failed to submit: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleAreaOfInterest = (area: string) => {
    setFormData(prev => ({
      ...prev,
      areas_of_interest: prev.areas_of_interest.includes(area)
        ? prev.areas_of_interest.filter(a => a !== area)
        : [...prev.areas_of_interest, area]
    }));
  };

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || Heart;
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-church-green to-church-green/80 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6">Community Outreach</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Serving our neighbors with God's love through practical acts of compassion, 
              support, and hope in our community and around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => setVolunteerDialogOpen(true)}
              >
                Volunteer Today
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:text-white hover:border-white/60">
                <Link to="/donate">Support Our Mission</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Current Projects */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="mb-6">Current Projects</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We're actively involved in these ongoing outreach initiatives that make a real difference in people's lives.
              </p>
            </div>

            {loading ? (
              <p className="text-center">Loading projects...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProjects.map((project) => {
                  const Icon = getIcon(project.icon_name);
                  return (
                    <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Icon className="h-8 w-8 text-accent" />
                          {project.is_urgent && (
                            <Badge variant="destructive" className="text-xs">
                              Urgent Need
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          {project.description}
                        </p>
                        
                        <div className="space-y-2 text-xs">
                          {project.impact_metric && (
                            <div className="flex items-center space-x-2">
                              <Heart className="h-3 w-3 text-accent" />
                              <span className="font-medium text-accent">{project.impact_metric}</span>
                            </div>
                          )}
                          {project.schedule && (
                            <div className="flex items-center space-x-2">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span>{project.schedule}</span>
                            </div>
                          )}
                          {project.volunteers_needed && (
                            <div className="flex items-center space-x-2">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span>{project.volunteers_needed}</span>
                            </div>
                          )}
                          {project.location && (
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span>{project.location}</span>
                            </div>
                          )}
                        </div>
                        
                        <Button asChild variant="outline" size="sm" className="w-full">
                          <Link to="#volunteer">
                            Join This Project
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Impact Stories */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="mb-6">Impact Stories</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Real stories of how God is working through our outreach efforts to transform lives and communities.
              </p>
            </div>

            {loading ? (
              <p className="text-center">Loading stories...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {impactStories.map((story) => {
                  const Icon = getIcon(story.icon_name);
                  return (
                    <Card key={story.id} className="overflow-hidden">
                      <div className="aspect-video bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                        <Icon className="h-12 w-12 text-accent" />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-3">{story.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-4">
                          {story.description}
                        </p>
                        {story.impact_metric && (
                          <div className="bg-accent/10 rounded-lg p-3">
                            <p className="text-xs font-medium text-accent">
                              Outcome: {story.impact_metric}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            <div className="text-center mt-12">
              <Button asChild variant="outline">
                <Link to="/gallery">
                  View More Stories in Our Gallery
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Volunteer Opportunities */}
        <section id="volunteer" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="mb-6">Volunteer Opportunities</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Find the perfect way to use your gifts and talents to serve others. 
                Every skill set and schedule can make a difference.
              </p>
            </div>

            {loading ? (
              <p className="text-center">Loading opportunities...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
                {volunteerOpportunities.map((opportunity) => {
                  const Icon = getIcon(opportunity.icon_name);
                  return (
                    <Card key={opportunity.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold mb-1">{opportunity.title}</h3>
                            <div className="text-sm text-muted-foreground space-y-1">
                              {opportunity.schedule && <p><span className="font-medium">Time:</span> {opportunity.schedule}</p>}
                              {opportunity.volunteers_needed && <p><span className="font-medium">Skills:</span> {opportunity.volunteers_needed}</p>}
                            </div>
                          </div>
                          <Icon className="h-6 w-6 text-accent" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          {opportunity.description}
                        </p>
                        <Button asChild variant="outline" size="sm" className="w-full">
                          <Link to="/contact">
                            Apply for This Role
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Volunteer Sign-up CTA */}
            <div className="bg-accent/10 rounded-2xl p-8 text-center max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold mb-4">Ready to Make a Difference?</h3>
              <p className="text-muted-foreground mb-6">
                Join our team of dedicated volunteers and experience the joy of serving others. 
                We provide training, support, and flexible scheduling to fit your life.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-sm">
                <div className="text-center">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <p className="font-medium">Flexible Schedule</p>
                  <p className="text-muted-foreground">Choose your availability</p>
                </div>
                <div className="text-center">
                  <GraduationCap className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <p className="font-medium">Full Training</p>
                  <p className="text-muted-foreground">We'll equip you for success</p>
                </div>
                <div className="text-center">
                  <Users className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <p className="font-medium">Great Community</p>
                  <p className="text-muted-foreground">Serve alongside friends</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => setVolunteerDialogOpen(true)}>
                  Volunteer Application
                </Button>
                <Button asChild variant="outline">
                  <a href="tel:+1234567890">Call (123) 456-7890</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Monthly Goals */}
        <section className="py-20 bg-church-warm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="mb-6">This Month's Goals</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Track our progress on current outreach goals and see how you can help us reach them.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6 text-center">
                  <Utensils className="h-8 w-8 mx-auto mb-4 text-accent" />
                  <h3 className="font-semibold mb-2">Feed 500 Families</h3>
                  <div className="space-y-2">
                    <Progress value={72} className="h-2" />
                    <p className="text-sm text-muted-foreground">360 of 500 families served</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <UserPlus className="h-8 w-8 mx-auto mb-4 text-accent" />
                  <h3 className="font-semibold mb-2">50 New Volunteers</h3>
                  <div className="space-y-2">
                    <Progress value={86} className="h-2" />
                    <p className="text-sm text-muted-foreground">43 of 50 volunteers recruited</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Globe className="h-8 w-8 mx-auto mb-4 text-accent" />
                  <h3 className="font-semibold mb-2">$10K Mission Fund</h3>
                  <div className="space-y-2">
                    <Progress value={45} className="h-2" />
                    <p className="text-sm text-muted-foreground">$4,500 of $10,000 raised</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Button asChild>
                <Link to="/donate">Help Us Reach Our Goals</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Volunteer Dialog */}
        <Dialog open={volunteerDialogOpen} onOpenChange={setVolunteerDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Volunteer Today</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleVolunteerSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <Label>Areas of Interest *</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {areaOptions.map((area) => (
                    <div key={area} className="flex items-center space-x-2">
                      <Checkbox
                        id={area}
                        checked={formData.areas_of_interest.includes(area)}
                        onCheckedChange={() => toggleAreaOfInterest(area)}
                      />
                      <label htmlFor={area} className="text-sm cursor-pointer">
                        {area}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="availability">Availability *</Label>
                <Select
                  value={formData.availability}
                  onValueChange={(value) => setFormData({ ...formData, availability: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekdays">Weekdays</SelectItem>
                    <SelectItem value="weekends">Weekends</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                    <SelectItem value="monthly">Once a month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="skills">Skills & Experience</Label>
                <Input
                  id="skills"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="e.g., Teaching, Cooking, Construction"
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us why you want to volunteer..."
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full" disabled={submitting || formData.areas_of_interest.length === 0}>
                {submitting ? "Submitting..." : "Submit Volunteer Application"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Outreach;