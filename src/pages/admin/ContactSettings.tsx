import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface ServiceHour {
  day: string;
  times: string;
  service: string;
}

interface OfficeHour {
  day: string;
  times: string;
}

interface PastoralStaff {
  name: string;
  role: string;
  email: string;
  phone: string;
  specialties: string[];
}

interface ChurchLocation {
  name: string;
  address: string;
  map_embed_url: string;
}

interface ContactPageSettings {
  id?: string;
  hero_heading: string;
  hero_subtitle: string;
  address_line1: string;
  address_line2: string;
  main_phone: string;
  prayer_line_phone: string;
  main_email: string;
  pastor_email: string;
  maps_url: string;
  response_time: string;
  days_per_week: string;
  pastoral_staff_count: string;
  families_served: string;
  service_hours: ServiceHour[];
  office_hours: OfficeHour[];
  pastoral_staff: PastoralStaff[];
  church_locations: ChurchLocation[];
  emergency_contact_text: string;
  is_active: boolean;
}

const ContactSettingsPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<ContactPageSettings>({
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
    service_hours: [],
    office_hours: [],
    pastoral_staff: [],
    church_locations: [],
    emergency_contact_text: "For urgent pastoral care, call our 24/7 prayer line at",
    is_active: true
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_page_settings')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings({
          ...data,
          service_hours: data.service_hours as unknown as ServiceHour[],
          office_hours: data.office_hours as unknown as OfficeHour[],
          pastoral_staff: data.pastoral_staff as unknown as PastoralStaff[],
          church_locations: (data.church_locations as unknown as ChurchLocation[]) || []
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to load contact settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const dataToSave = {
        ...settings,
        service_hours: settings.service_hours as any,
        office_hours: settings.office_hours as any,
        pastoral_staff: settings.pastoral_staff as any,
        church_locations: settings.church_locations as any,
        updated_at: new Date().toISOString()
      };

      if (settings.id) {
        const { error } = await supabase
          .from('contact_page_settings')
          .update(dataToSave)
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('contact_page_settings')
          .insert([dataToSave]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Contact page settings saved successfully",
      });
      
      fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save contact settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Service Hours Management
  const addServiceHour = () => {
    setSettings(prev => ({
      ...prev,
      service_hours: [...prev.service_hours, { day: "", times: "", service: "" }]
    }));
  };

  const removeServiceHour = (index: number) => {
    setSettings(prev => ({
      ...prev,
      service_hours: prev.service_hours.filter((_, i) => i !== index)
    }));
  };

  const updateServiceHour = (index: number, field: keyof ServiceHour, value: string) => {
    setSettings(prev => ({
      ...prev,
      service_hours: prev.service_hours.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Office Hours Management
  const addOfficeHour = () => {
    setSettings(prev => ({
      ...prev,
      office_hours: [...prev.office_hours, { day: "", times: "" }]
    }));
  };

  const removeOfficeHour = (index: number) => {
    setSettings(prev => ({
      ...prev,
      office_hours: prev.office_hours.filter((_, i) => i !== index)
    }));
  };

  const updateOfficeHour = (index: number, field: keyof OfficeHour, value: string) => {
    setSettings(prev => ({
      ...prev,
      office_hours: prev.office_hours.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Pastoral Staff Management
  const addStaff = () => {
    setSettings(prev => ({
      ...prev,
      pastoral_staff: [...prev.pastoral_staff, { 
        name: "", 
        role: "", 
        email: "", 
        phone: "", 
        specialties: [] 
      }]
    }));
  };

  const removeStaff = (index: number) => {
    setSettings(prev => ({
      ...prev,
      pastoral_staff: prev.pastoral_staff.filter((_, i) => i !== index)
    }));
  };

  const updateStaff = (index: number, field: keyof PastoralStaff, value: string | string[]) => {
    setSettings(prev => ({
      ...prev,
      pastoral_staff: prev.pastoral_staff.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Church Locations Management
  const addChurchLocation = () => {
    setSettings(prev => ({
      ...prev,
      church_locations: [...prev.church_locations, { 
        name: "", 
        address: "", 
        map_embed_url: "" 
      }]
    }));
  };

  const removeChurchLocation = (index: number) => {
    setSettings(prev => ({
      ...prev,
      church_locations: prev.church_locations.filter((_, i) => i !== index)
    }));
  };

  const updateChurchLocation = (index: number, field: keyof ChurchLocation, value: string) => {
    setSettings(prev => ({
      ...prev,
      church_locations: prev.church_locations.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Contact Page Settings</h1>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>

        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList>
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="contact">Contact Info</TabsTrigger>
            <TabsTrigger value="stats">Quick Stats</TabsTrigger>
            <TabsTrigger value="hours">Hours</TabsTrigger>
            <TabsTrigger value="staff">Pastoral Staff</TabsTrigger>
            <TabsTrigger value="locations">Church Locations</TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hero_heading">Heading</Label>
                  <Input
                    id="hero_heading"
                    value={settings.hero_heading}
                    onChange={(e) => setSettings({ ...settings, hero_heading: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero_subtitle">Subtitle</Label>
                  <Textarea
                    id="hero_subtitle"
                    value={settings.hero_subtitle}
                    onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address_line1">Address Line 1</Label>
                    <Input
                      id="address_line1"
                      value={settings.address_line1}
                      onChange={(e) => setSettings({ ...settings, address_line1: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address_line2">Address Line 2</Label>
                    <Input
                      id="address_line2"
                      value={settings.address_line2}
                      onChange={(e) => setSettings({ ...settings, address_line2: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="main_phone">Main Phone</Label>
                    <Input
                      id="main_phone"
                      value={settings.main_phone}
                      onChange={(e) => setSettings({ ...settings, main_phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prayer_line_phone">Prayer Line Phone</Label>
                    <Input
                      id="prayer_line_phone"
                      value={settings.prayer_line_phone}
                      onChange={(e) => setSettings({ ...settings, prayer_line_phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="main_email">Main Email</Label>
                    <Input
                      id="main_email"
                      type="email"
                      value={settings.main_email}
                      onChange={(e) => setSettings({ ...settings, main_email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pastor_email">Pastor Email</Label>
                    <Input
                      id="pastor_email"
                      type="email"
                      value={settings.pastor_email}
                      onChange={(e) => setSettings({ ...settings, pastor_email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="maps_url">Google Maps URL</Label>
                    <Input
                      id="maps_url"
                      value={settings.maps_url}
                      onChange={(e) => setSettings({ ...settings, maps_url: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="emergency_contact_text">Emergency Contact Message</Label>
                    <Input
                      id="emergency_contact_text"
                      value={settings.emergency_contact_text}
                      onChange={(e) => setSettings({ ...settings, emergency_contact_text: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="response_time">Response Time</Label>
                    <Input
                      id="response_time"
                      value={settings.response_time}
                      onChange={(e) => setSettings({ ...settings, response_time: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="days_per_week">Days Per Week</Label>
                    <Input
                      id="days_per_week"
                      value={settings.days_per_week}
                      onChange={(e) => setSettings({ ...settings, days_per_week: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pastoral_staff_count">Pastoral Staff Count</Label>
                    <Input
                      id="pastoral_staff_count"
                      value={settings.pastoral_staff_count}
                      onChange={(e) => setSettings({ ...settings, pastoral_staff_count: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="families_served">Families Served</Label>
                    <Input
                      id="families_served"
                      value={settings.families_served}
                      onChange={(e) => setSettings({ ...settings, families_served: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hours" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Service Hours</CardTitle>
                  <Button onClick={addServiceHour} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service Hour
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {settings.service_hours.map((hour, index) => (
                  <div key={index} className="flex gap-4 items-end">
                    <div className="flex-1 space-y-2">
                      <Label>Day</Label>
                      <Input
                        value={hour.day}
                        onChange={(e) => updateServiceHour(index, 'day', e.target.value)}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>Times</Label>
                      <Input
                        value={hour.times}
                        onChange={(e) => updateServiceHour(index, 'times', e.target.value)}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>Service Name</Label>
                      <Input
                        value={hour.service}
                        onChange={(e) => updateServiceHour(index, 'service', e.target.value)}
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeServiceHour(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Office Hours</CardTitle>
                  <Button onClick={addOfficeHour} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Office Hour
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {settings.office_hours.map((hour, index) => (
                  <div key={index} className="flex gap-4 items-end">
                    <div className="flex-1 space-y-2">
                      <Label>Day</Label>
                      <Input
                        value={hour.day}
                        onChange={(e) => updateOfficeHour(index, 'day', e.target.value)}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>Times</Label>
                      <Input
                        value={hour.times}
                        onChange={(e) => updateOfficeHour(index, 'times', e.target.value)}
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeOfficeHour(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Pastoral Staff</CardTitle>
                  <Button onClick={addStaff} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Staff Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {settings.pastoral_staff.map((staff, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">Staff Member {index + 1}</h4>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeStaff(index)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={staff.name}
                          onChange={(e) => updateStaff(index, 'name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Input
                          value={staff.role}
                          onChange={(e) => updateStaff(index, 'role', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={staff.email}
                          onChange={(e) => updateStaff(index, 'email', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={staff.phone}
                          onChange={(e) => updateStaff(index, 'phone', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label>Specialties (comma-separated)</Label>
                        <Input
                          value={staff.specialties.join(', ')}
                          onChange={(e) => updateStaff(index, 'specialties', e.target.value.split(',').map(s => s.trim()))}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Church Locations & Maps</span>
                  <Button onClick={addChurchLocation} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Location
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {settings.church_locations.map((location, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Location {index + 1}</h3>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeChurchLocation(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Church Name</Label>
                        <Input
                          placeholder="e.g., Main Church - Baringo"
                          value={location.name}
                          onChange={(e) => updateChurchLocation(index, 'name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Address</Label>
                        <Input
                          placeholder="e.g., 123 Faith Street, Baringo"
                          value={location.address}
                          onChange={(e) => updateChurchLocation(index, 'address', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label>Google Maps Embed URL</Label>
                        <Textarea
                          placeholder='Paste the Google Maps embed iframe src URL here (e.g., https://www.google.com/maps/embed?pb=...)'
                          value={location.map_embed_url}
                          onChange={(e) => updateChurchLocation(index, 'map_embed_url', e.target.value)}
                          rows={3}
                        />
                        <p className="text-sm text-muted-foreground">
                          Get this from Google Maps → Share → Embed a map → Copy the src URL from the iframe
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {settings.church_locations.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No church locations added yet. Click "Add Location" to get started.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ContactSettingsPage;