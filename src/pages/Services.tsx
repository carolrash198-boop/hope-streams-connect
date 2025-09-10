import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users, Heart, Calendar, Music, BookOpen, Coffee } from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
  const serviceSchedule = [
    {
      time: "9:00 AM",
      title: "Morning Worship",
      description: "Traditional service with hymns, prayer, and biblical teaching",
      audience: "All Ages",
      duration: "75 minutes",
      style: "Traditional"
    },
    {
      time: "11:00 AM", 
      title: "Contemporary Worship",
      description: "Modern worship with contemporary music and relevant teaching",
      audience: "All Ages",
      duration: "90 minutes",
      style: "Contemporary"
    }
  ];

  const whatToExpect = [
    {
      icon: Music,
      title: "Worship Music",
      description: "Uplifting songs that draw hearts to God, both traditional hymns and contemporary praise"
    },
    {
      icon: BookOpen,
      title: "Biblical Teaching",
      description: "Practical, life-changing messages rooted in Scripture and relevant to daily life"
    },
    {
      icon: Heart,
      title: "Prayer Time",
      description: "Moments of personal and corporate prayer for healing, guidance, and thanksgiving"
    },
    {
      icon: Coffee,
      title: "Fellowship",
      description: "Connect with others before and after service over coffee and light refreshments"
    }
  ];

  const kidsFamilyInfo = [
    {
      ageGroup: "Nursery",
      ages: "0-2 years",
      description: "Safe, loving care with age-appropriate activities and Bible stories",
      time: "Both Services"
    },
    {
      ageGroup: "Preschool",
      ages: "3-5 years", 
      description: "Interactive lessons, songs, and crafts that introduce children to Jesus",
      time: "Both Services"
    },
    {
      ageGroup: "Elementary",
      ages: "6-12 years",
      description: "Engaging Bible lessons with games, worship, and small group discussions",
      time: "Both Services"
    },
    {
      ageGroup: "Youth",
      ages: "13-18 years",
      description: "Relevant teaching, worship, and community building for teenagers",
      time: "11:00 AM Service"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6">Sunday Services</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join us for worship, prayer, and biblical teaching every Sunday. 
              Come as you are — we're excited to meet you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/contact">Plan Your Visit</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <Link to="/bible-studies">Watch Online</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Service Times */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="mb-6">Service Times</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We offer two distinct worship experiences each Sunday to accommodate different preferences and schedules.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {serviceSchedule.map((service, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="bg-accent/10">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl">{service.time}</CardTitle>
                      <Badge variant="secondary">{service.style}</Badge>
                    </div>
                    <h3 className="text-xl">{service.title}</h3>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-accent" />
                        <span>{service.audience}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-accent" />
                        <span>{service.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-accent" />
                        <span>Main Sanctuary</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What to Expect */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="mb-6">What to Expect</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Every Sunday service includes these meaningful elements designed to help you connect with God and community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whatToExpect.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center">
                      <Icon className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Kids & Family */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="mb-6">Kids & Family</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We believe children are a gift from God. Our kids' programs provide age-appropriate teaching in a safe, fun environment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {kidsFamilyInfo.map((group, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold">{group.ageGroup}</h3>
                      <Badge variant="outline">{group.ages}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-3 text-sm">
                      {group.description}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-accent">
                      <Calendar className="h-4 w-4" />
                      <span>{group.time}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <div className="bg-accent/10 rounded-2xl p-8 max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold mb-4">First Time with Kids?</h3>
                <p className="text-muted-foreground mb-6">
                  Our kids' ministry team will be happy to show you around and help your children feel comfortable. 
                  All volunteers are background-checked and trained in child safety.
                </p>
                <Button asChild>
                  <Link to="/sunday-school">Learn More About Kids' Programs</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Dress Code & Practical Info */}
        <section className="py-20 bg-church-warm">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="mb-6">Come As You Are</h2>
                <p className="text-lg text-muted-foreground">
                  We believe church should be accessible to everyone, regardless of background or dress.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="text-center p-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">Dress Code</h3>
                  <p className="text-sm text-muted-foreground">
                    Casual attire is perfectly fine. Come comfortable and ready to worship!
                  </p>
                </Card>

                <Card className="text-center p-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">Parking</h3>
                  <p className="text-sm text-muted-foreground">
                    Free parking available in our lot and on surrounding streets.
                  </p>
                </Card>

                <Card className="text-center p-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">Accessibility</h3>
                  <p className="text-sm text-muted-foreground">
                    Wheelchair accessible with assisted listening devices available.
                  </p>
                </Card>
              </div>

              <div className="text-center mt-12">
                <h3 className="text-xl font-semibold mb-4">Questions?</h3>
                <p className="text-muted-foreground mb-6">
                  We'd love to help you plan your visit and answer any questions you might have.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild>
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <a href="tel:+1234567890">Call (123) 456-7890</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Services;