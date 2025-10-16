import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Calendar, 
  User, 
  Send, 
  Heart,
  Users,
  BookOpen,
  Headphones
} from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "",
    isUrgent: false,
    preferredContact: "email"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real implementation, you would send this to your contact endpoint
      // For now, we'll simulate the submission
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        inquiryType: "",
        isUrgent: false,
        preferredContact: "email"
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["123 Faith Street", "Hope City, HC 12345"],
      action: "Get Directions",
      link: "https://maps.google.com"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["Main Office: (123) 456-7890", "Prayer Line: (123) 456-7891"],
      action: "Call Now",
      link: "tel:+1234567890"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["info@fpfchurch.or.ke", "pastor@fpfchurch.or.ke"],
      action: "Send Email",
      link: "mailto:info@fpfchurch.or.ke"
    }
  ];

  const serviceHours = [
    { day: "Sunday", times: "9:00 AM & 11:00 AM", service: "Worship Services" },
    { day: "Wednesday", times: "7:00 PM", service: "Bible Study" },
    { day: "Friday", times: "7:00 PM", service: "Youth Group" },
    { day: "Saturday", times: "10:00 AM - 2:00 PM", service: "Food Bank" }
  ];

  const officeHours = [
    { day: "Monday - Thursday", times: "9:00 AM - 5:00 PM" },
    { day: "Friday", times: "9:00 AM - 3:00 PM" },
    { day: "Saturday", times: "10:00 AM - 2:00 PM" },
    { day: "Sunday", times: "8:00 AM - 12:30 PM" }
  ];

  const pastoralStaff = [
    {
      name: "Pastor Michael Johnson",
      role: "Senior Pastor",
      email: "pastor@fpfchurch.or.ke",
      phone: "(123) 456-7892",
      specialties: ["Marriage Counseling", "Spiritual Guidance", "Leadership"]
    },
    {
      name: "Pastor Sarah Martinez",
      role: "Associate Pastor",
      email: "sarah@fpfchurch.or.ke", 
      phone: "(123) 456-7893",
      specialties: ["Women's Ministry", "Family Counseling", "Prayer Ministry"]
    },
    {
      name: "Pastor Mark Thompson",
      role: "Youth Pastor",
      email: "mark@fpfchurch.or.ke",
      phone: "(123) 456-7894",
      specialties: ["Youth Ministry", "Young Adults", "Discipleship"]
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6">Contact Us</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              We'd love to hear from you! Whether you have questions, need prayer, 
              or want to get involved, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <a href="#contact-form">Send a Message</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:text-white hover:border-white/60">
                <a href="tel:+1234567890">Call (123) 456-7890</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="mb-6">Get In Touch</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Multiple ways to connect with our church family and pastoral staff.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center">
                      <Icon className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold mb-4">{info.title}</h3>
                    <div className="space-y-2 text-sm text-muted-foreground mb-6">
                      {info.details.map((detail, idx) => (
                        <p key={idx}>{detail}</p>
                      ))}
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <a href={info.link} target="_blank" rel="noopener noreferrer">
                        {info.action}
                      </a>
                    </Button>
                  </Card>
                );
              })}
            </div>

            {/* Contact Information Table */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-6 w-6 text-accent" />
                  <span>Contact Directory</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Department</th>
                        <th className="text-left py-3 px-4 font-semibold">Contact Person</th>
                        <th className="text-left py-3 px-4 font-semibold">Phone</th>
                        <th className="text-left py-3 px-4 font-semibold">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">General Inquiries</td>
                        <td className="py-3 px-4">Church Office</td>
                        <td className="py-3 px-4">
                          <a href="tel:+1234567890" className="text-accent hover:underline">
                            (123) 456-7890
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          <a href="mailto:info@fpfchurch.or.ke" className="text-accent hover:underline">
                            info@fpfchurch.or.ke
                          </a>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">Senior Pastor</td>
                        <td className="py-3 px-4">Pastor Michael Johnson</td>
                        <td className="py-3 px-4">
                          <a href="tel:+1234567892" className="text-accent hover:underline">
                            (123) 456-7892
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          <a href="mailto:pastor@fpfchurch.or.ke" className="text-accent hover:underline">
                            pastor@fpfchurch.or.ke
                          </a>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">Prayer Line (24/7)</td>
                        <td className="py-3 px-4">Prayer Ministry</td>
                        <td className="py-3 px-4">
                          <a href="tel:+1234567891" className="text-accent hover:underline">
                            (123) 456-7891
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          <a href="mailto:prayer@fpfchurch.or.ke" className="text-accent hover:underline">
                            prayer@fpfchurch.or.ke
                          </a>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">Women's Ministry</td>
                        <td className="py-3 px-4">Pastor Sarah Martinez</td>
                        <td className="py-3 px-4">
                          <a href="tel:+1234567893" className="text-accent hover:underline">
                            (123) 456-7893
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          <a href="mailto:sarah@fpfchurch.or.ke" className="text-accent hover:underline">
                            sarah@fpfchurch.or.ke
                          </a>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">Youth Ministry</td>
                        <td className="py-3 px-4">Pastor Mark Thompson</td>
                        <td className="py-3 px-4">
                          <a href="tel:+1234567894" className="text-accent hover:underline">
                            (123) 456-7894
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          <a href="mailto:mark@fpfchurch.or.ke" className="text-accent hover:underline">
                            mark@fpfchurch.or.ke
                          </a>
                        </td>
                      </tr>
                      <tr className="hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">Mercy Ministry</td>
                        <td className="py-3 px-4">Outreach Coordinator</td>
                        <td className="py-3 px-4">
                          <a href="tel:+1234567895" className="text-accent hover:underline">
                            (123) 456-7895
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          <a href="mailto:outreach@fpfchurch.or.ke" className="text-accent hover:underline">
                            outreach@fpfchurch.or.ke
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-2">24 hrs</div>
                <p className="text-sm text-muted-foreground">Response Time</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-2">7 days</div>
                <p className="text-sm text-muted-foreground">Per Week Open</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-2">3</div>
                <p className="text-sm text-muted-foreground">Pastoral Staff</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-2">500+</div>
                <p className="text-sm text-muted-foreground">Families Served</p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Times & Office Hours */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Service Times */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-6 w-6 text-accent" />
                    <span>Service Times</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {serviceHours.map((service, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium">{service.day}</p>
                        <p className="text-sm text-muted-foreground">{service.service}</p>
                      </div>
                      <Badge variant="outline">
                        {service.times}
                      </Badge>
                    </div>
                  ))}
                  <div className="pt-4">
                    <Button asChild variant="outline" className="w-full">
                      <a href="/services">Learn More About Services</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Office Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-6 w-6 text-accent" />
                    <span>Office Hours</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {officeHours.map((hours, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <p className="font-medium">{hours.day}</p>
                      <Badge variant="outline">
                        {hours.times}
                      </Badge>
                    </div>
                  ))}
                  <div className="bg-accent/10 rounded-lg p-4 mt-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>Emergency Contact:</strong> For urgent pastoral care, 
                      call our 24/7 prayer line at (123) 456-7891
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pastoral Staff */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="mb-6">Pastoral Staff</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our dedicated pastoral team is here to provide spiritual guidance, counseling, and support.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pastoralStaff.map((pastor, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                        <User className="h-10 w-10 text-accent" />
                      </div>
                      <h3 className="font-semibold text-lg">{pastor.name}</h3>
                      <p className="text-accent font-medium">{pastor.role}</p>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${pastor.email}`} className="text-accent hover:underline">
                          {pastor.email}
                        </a>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${pastor.phone}`} className="text-accent hover:underline">
                          {pastor.phone}
                        </a>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Specialties:</p>
                      <div className="flex flex-wrap gap-1">
                        {pastor.specialties.map((specialty, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact-form" className="py-20 bg-accent/10">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="mb-6">Send Us a Message</h2>
                <p className="text-lg text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              <Card>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Contact Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Inquiry Type */}
                    <div className="space-y-2">
                      <Label>Inquiry Type</Label>
                      <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange("inquiryType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="What can we help you with?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Information</SelectItem>
                          <SelectItem value="prayer">Prayer Request</SelectItem>
                          <SelectItem value="pastoral">Pastoral Care</SelectItem>
                          <SelectItem value="volunteer">Volunteer Opportunities</SelectItem>
                          <SelectItem value="events">Events & Programs</SelectItem>
                          <SelectItem value="membership">Church Membership</SelectItem>
                          <SelectItem value="technical">Website/Technical Issue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        required
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        rows={6}
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        required
                        placeholder="Please share your message, question, or prayer request..."
                      />
                    </div>

                    {/* Preferred Contact Method */}
                    <div className="space-y-2">
                      <Label>Preferred Contact Method</Label>
                      <Select value={formData.preferredContact} onValueChange={(value) => handleInputChange("preferredContact", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                          <SelectItem value="either">Either is fine</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Urgent Checkbox */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="urgent"
                        checked={formData.isUrgent}
                        onCheckedChange={(checked) => handleInputChange("isUrgent", checked as boolean)}
                      />
                      <Label htmlFor="urgent" className="text-sm">
                        This is an urgent matter requiring immediate attention
                      </Label>
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      We typically respond within 24 hours. For urgent matters, 
                      please call our main office at (123) 456-7890.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="mb-6">Find Us</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Located in the heart of Hope City, easily accessible by car or public transportation.
              </p>
            </div>

            <div className="aspect-video bg-muted rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Interactive Map</h3>
                <p className="text-muted-foreground mb-4">
                  123 Faith Street, Hope City, HC 12345
                </p>
                <Button asChild>
                  <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
                    Open in Google Maps
                  </a>
                </Button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <h4 className="font-medium mb-2">Parking</h4>
                <p className="text-sm text-muted-foreground">
                  Free parking available in our lot and on surrounding streets
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Public Transit</h4>
                <p className="text-sm text-muted-foreground">
                  Bus routes 15 & 23 stop directly in front of the church
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Accessibility</h4>
                <p className="text-sm text-muted-foreground">
                  Wheelchair accessible with ramp entrance and elevator access
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Contact;