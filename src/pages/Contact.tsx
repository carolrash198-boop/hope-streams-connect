import { useState, useEffect } from "react";
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
import { Phone, Mail, MapPin, Clock, Users, Heart, AlertCircle, Calendar, User, Send } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageSettings, setPageSettings] = useState({
    hero_heading: "Contact Us",
    hero_subtitle: "We'd love to hear from you! Whether you have questions, need prayer, or want to get involved, we're here to help.",
    address_line1: "123 Faith Street",
    address_line2: "Hope City, HC 12345",
    main_phone: "(123) 456-7890",
    prayer_line_phone: "(123) 456-7891",
    main_email: "info@fpfchurch.or.ke",
    pastor_email: "pastor@fpfchurch.or.ke",
    maps_url: "https://maps.google.com",
    response_time: "24 hrs",
    days_per_week: "7 days",
    pastoral_staff_count: "3",
    families_served: "500+",
    service_hours: [] as Array<{ day: string; times: string; service: string }>,
    office_hours: [] as Array<{ day: string; times: string }>,
    pastoral_staff: [] as Array<{ name: string; role: string; email: string; phone: string; specialties: string[] }>,
    church_locations: [] as Array<{ name: string; address: string; latitude: number; longitude: number; map_embed_url: string; phone?: string; email?: string }>,
    emergency_contact_text: "For urgent pastoral care, call our 24/7 prayer line at"
  });

  const [selectedLocation, setSelectedLocation] = useState<{ name: string; address: string; latitude: number; longitude: number; map_embed_url: string; phone?: string; email?: string } | null>(null);
  const [userLocation, setUserLocation] = useState("");
  const [showDirections, setShowDirections] = useState(false);
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
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject,
          message: formData.message,
          inquiry_type: formData.inquiryType || null,
          preferred_contact: formData.preferredContact,
          is_urgent: formData.isUrgent,
          status: 'pending'
        });

      if (error) throw error;

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
      console.error('Error submitting contact form:', error);
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

  useEffect(() => {
    const fetchPageSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('contact_page_settings')
          .select('*')
          .eq('is_active', true)
          .maybeSingle();

        if (!error && data) {
          setPageSettings({
            ...data,
            service_hours: data.service_hours as unknown as Array<{ day: string; times: string; service: string }>,
            office_hours: data.office_hours as unknown as Array<{ day: string; times: string }>,
            pastoral_staff: data.pastoral_staff as unknown as Array<{ name: string; role: string; email: string; phone: string; specialties: string[] }>,
            church_locations: (data.church_locations as unknown as Array<{ name: string; address: string; latitude: number; longitude: number; map_embed_url: string; phone?: string; email?: string }>) || []
          });
        }
      } catch (error) {
        console.error('Error fetching page settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPageSettings();
  }, []);

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: [pageSettings.address_line1, pageSettings.address_line2],
      action: "Get Directions",
      link: pageSettings.maps_url
    },
    {
      icon: Phone,
      title: "Call Us",
      details: [`Main Office: ${pageSettings.main_phone}`, `Prayer Line: ${pageSettings.prayer_line_phone}`],
      action: "Call Now",
      link: `tel:${pageSettings.main_phone.replace(/[^\d+]/g, '')}`
    },
    {
      icon: Mail,
      title: "Email Us",
      details: [pageSettings.main_email, pageSettings.pastor_email],
      action: "Send Email",
      link: `mailto:${pageSettings.main_email}`
    }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6">{pageSettings.hero_heading}</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              {pageSettings.hero_subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <a href="#contact-form">Send a Message</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:text-white hover:border-white/60">
                <a href={`tel:${pageSettings.main_phone.replace(/[^\d+]/g, '')}`}>Call {pageSettings.main_phone}</a>
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

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-2">{pageSettings.response_time}</div>
                <p className="text-sm text-muted-foreground">Response Time</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-2">{pageSettings.days_per_week}</div>
                <p className="text-sm text-muted-foreground">Per Week Open</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-2">{pageSettings.pastoral_staff_count}</div>
                <p className="text-sm text-muted-foreground">Pastoral Staff</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-2">{pageSettings.families_served}</div>
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
                  {pageSettings.service_hours.map((service, index) => (
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
                  {pageSettings.office_hours.map((hours, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <p className="font-medium">{hours.day}</p>
                      <Badge variant="outline">
                        {hours.times}
                      </Badge>
                    </div>
                  ))}
                  <div className="bg-accent/10 rounded-lg p-4 mt-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>Emergency Contact:</strong> {pageSettings.emergency_contact_text} {pageSettings.prayer_line_phone}
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
              {pageSettings.pastoral_staff.map((pastor, index) => (
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
              <h2 className="mb-6">Our Church Locations</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {pageSettings.church_locations.length > 0 
                  ? `Visit any of our ${pageSettings.church_locations.length} location${pageSettings.church_locations.length > 1 ? 's' : ''}. All are welcome!`
                  : "Located in the heart of the community, easily accessible by car or public transportation."}
              </p>
            </div>

            {pageSettings.church_locations.length > 0 ? (
                <div className="space-y-8">
                {/* Single Map with All Locations */}
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <iframe
                        src={`https://maps.google.com/maps?q=${pageSettings.church_locations
                          .map(loc => `${loc.latitude},${loc.longitude}`)
                          .join('+')}&output=embed&z=10`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Map showing all church locations"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Location Cards with click to view details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pageSettings.church_locations.map((location, index) => (
                    <Card 
                      key={index} 
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setSelectedLocation(location)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold mb-1">{location.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {location.address}
                            </p>
                            {location.phone && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                                <Phone className="h-3 w-3" />
                                {location.phone}
                              </p>
                            )}
                            {location.email && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                                <Mail className="h-3 w-3" />
                                {location.email}
                              </p>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full mt-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`, '_blank');
                              }}
                            >
                              <MapPin className="h-3 w-3 mr-1" />
                              Get Directions
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card className="overflow-hidden">
                <CardContent className="p-12 text-center">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No locations configured yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Location Details Dialog */}
        <Dialog open={!!selectedLocation} onOpenChange={(open) => !open && setSelectedLocation(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {selectedLocation?.name}
              </DialogTitle>
              <DialogDescription>{selectedLocation?.address}</DialogDescription>
            </DialogHeader>
            {selectedLocation && (
              <div className="space-y-4">
                {/* Map Preview */}
                <div className="rounded-lg overflow-hidden border">
                  {selectedLocation.map_embed_url ? (
                    <iframe
                      src={selectedLocation.map_embed_url}
                      width="100%"
                      height="400"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${selectedLocation.name} Map`}
                    />
                  ) : (
                    <iframe
                      src={`https://maps.google.com/maps?q=${selectedLocation.latitude},${selectedLocation.longitude}&z=15&output=embed`}
                      width="100%"
                      height="400"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${selectedLocation.name} Map`}
                    />
                  )}
                </div>
                
                {/* Contact Details */}
                <div className="space-y-3">
                  {selectedLocation.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <a href={`tel:${selectedLocation.phone}`} className="text-sm text-muted-foreground hover:text-primary">
                          {selectedLocation.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {selectedLocation.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <a href={`mailto:${selectedLocation.email}`} className="text-sm text-muted-foreground hover:text-primary">
                          {selectedLocation.email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    className="flex-1"
                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.latitude},${selectedLocation.longitude}`, '_blank')}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Get Directions
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowDirections(!showDirections)}
                  >
                    Calculate Route
                  </Button>
                </div>

                {/* Route Calculator */}
                {showDirections && (
                  <div className="space-y-3 pt-4 border-t">
                    <Label>Your Starting Location</Label>
                    <Input
                      placeholder="Enter your address, city, or current location"
                      value={userLocation}
                      onChange={(e) => setUserLocation(e.target.value)}
                    />
                    <Button 
                      className="w-full"
                      onClick={() => {
                        if (userLocation.trim()) {
                          window.open(
                            `https://www.google.com/maps/dir/${encodeURIComponent(userLocation)}/${selectedLocation.latitude},${selectedLocation.longitude}`,
                            '_blank'
                          );
                        }
                      }}
                      disabled={!userLocation.trim()}
                    >
                      View Route, Distance & Time
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Opens Google Maps with full directions, travel time, and distance
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Contact;