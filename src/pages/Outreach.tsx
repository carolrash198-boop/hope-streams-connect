import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Users, Home, Utensils, GraduationCap, Globe, Calendar, MapPin, Clock, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const Outreach = () => {
  const currentProjects = [
    {
      title: "Community Food Bank",
      icon: Utensils,
      description: "Providing groceries and hot meals to families in need throughout our community.",
      impact: "2,400 meals served this year",
      frequency: "Every Saturday, 10 AM - 2 PM",
      volunteers: "15-20 volunteers needed weekly",
      location: "Church Fellowship Hall",
      urgentNeed: true
    },
    {
      title: "Homeless Shelter Support", 
      icon: Home,
      description: "Monthly dinners and care packages for residents at Hope Valley Shelter.",
      impact: "180 residents served monthly",
      frequency: "Third Saturday of each month",
      volunteers: "8-12 volunteers needed monthly",
      location: "Hope Valley Shelter",
      urgentNeed: false
    },
    {
      title: "After School Tutoring",
      icon: GraduationCap, 
      description: "Free tutoring and mentorship for elementary students in our neighborhood.",
      impact: "25 students helped weekly",
      frequency: "Tuesdays & Thursdays, 3-5 PM",
      volunteers: "5-8 tutors needed",
      location: "Lincoln Elementary School",
      urgentNeed: true
    },
    {
      title: "Senior Care Ministry",
      icon: Heart,
      description: "Visits, grocery shopping, and companionship for elderly community members.",
      impact: "40 seniors supported regularly",
      frequency: "Ongoing, flexible scheduling",
      volunteers: "Always accepting new volunteers",
      location: "Various homes & care facilities",
      urgentNeed: false
    },
    {
      title: "International Missions",
      icon: Globe,
      description: "Supporting missionaries and funding clean water projects in developing countries.",
      impact: "3 wells funded, 4 missionaries supported",
      frequency: "Ongoing financial support",
      volunteers: "Prayer team and fundraising help",
      location: "Guatemala, Kenya, Philippines",
      urgentNeed: false
    }
  ];

  const impactStories = [
    {
      title: "Maria's New Beginning", 
      category: "Food Bank",
      story: "After losing her job during the pandemic, Maria struggled to feed her three children. Our food bank provided groceries for six months while she found new employment. Today, she volunteers with us every weekend.",
      outcome: "Now employed and giving back",
      image: "/placeholder-impact-1.jpg"
    },
    {
      title: "Tommy's Academic Success",
      category: "Tutoring Program", 
      story: "Tommy was failing math when he joined our after-school program. With consistent tutoring and mentorship, he raised his grade from F to B+ and gained confidence in all subjects.",
      outcome: "Honor roll student for 2 semesters",
      image: "/placeholder-impact-2.jpg"
    },
    {
      title: "Clean Water in Kenya",
      category: "International Missions",
      story: "Our church raised $15,000 to build a well in rural Kenya, providing clean water to over 500 people. The community now has access to safe drinking water for the first time.",
      outcome: "500+ people with clean water access",
      image: "/placeholder-impact-3.jpg"
    }
  ];

  const volunteerOpportunities = [
    {
      role: "Food Bank Coordinator",
      commitment: "4 hours/week",
      skills: "Organization, people skills",
      description: "Help organize food distribution and coordinate with local suppliers."
    },
    {
      role: "Tutor/Mentor", 
      commitment: "2 hours/week",
      skills: "Patience, elementary education background helpful",
      description: "Work one-on-one with students on homework and reading skills."
    },
    {
      role: "Senior Companion",
      commitment: "2-3 hours/week",
      skills: "Compassion, good listener",
      description: "Visit elderly community members for conversation and light assistance."
    },
    {
      role: "Event Volunteer",
      commitment: "Flexible",
      skills: "Varies by event",
      description: "Help with special outreach events, setup, cleanup, and logistics."
    }
  ];

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
              <Button asChild size="lg" variant="secondary">
                <Link to="#volunteer">Volunteer Today</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-church-green">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProjects.map((project, index) => {
                const Icon = project.icon;
                return (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Icon className="h-8 w-8 text-accent" />
                        {project.urgentNeed && (
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
                        <div className="flex items-center space-x-2">
                          <Heart className="h-3 w-3 text-accent" />
                          <span className="font-medium text-accent">{project.impact}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>{project.frequency}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span>{project.volunteers}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span>{project.location}</span>
                        </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {impactStories.map((story, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                    <Heart className="h-12 w-12 text-accent" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{story.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {story.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-4">
                      {story.story}
                    </p>
                    <div className="bg-accent/10 rounded-lg p-3">
                      <p className="text-xs font-medium text-accent">
                        Outcome: {story.outcome}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
              {volunteerOpportunities.map((opportunity, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold mb-1">{opportunity.role}</h3>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p><span className="font-medium">Time:</span> {opportunity.commitment}</p>
                          <p><span className="font-medium">Skills:</span> {opportunity.skills}</p>
                        </div>
                      </div>
                      <UserPlus className="h-6 w-6 text-accent" />
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
              ))}
            </div>

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
                <Button asChild>
                  <Link to="/contact">Volunteer Application</Link>
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
      </div>
    </Layout>
  );
};

export default Outreach;