import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface ServiceTime {
  name: string;
  time: string;
}

interface QuickLink {
  label: string;
  url: string;
}

interface FooterSettings {
  id?: string;
  church_name: string;
  church_abbreviation: string;
  about_text: string;
  address_line1: string;
  address_line2: string;
  phone: string;
  email: string;
  service_times: ServiceTime[];
  quick_links: QuickLink[];
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  copyright_text: string;
  show_privacy_policy: boolean;
  show_terms_of_service: boolean;
  is_active: boolean;
}

const FooterSettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<FooterSettings>({
    church_name: '',
    church_abbreviation: '',
    about_text: '',
    address_line1: '',
    address_line2: '',
    phone: '',
    email: '',
    service_times: [{ name: '', time: '' }],
    quick_links: [{ label: '', url: '' }],
    copyright_text: '',
    show_privacy_policy: true,
    show_terms_of_service: true,
    is_active: true
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('footer_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings({
          ...data,
          service_times: (data.service_times as any) || [{ name: '', time: '' }],
          quick_links: (data.quick_links as any) || [{ label: '', url: '' }]
        });
      }
    } catch (error) {
      console.error('Error fetching footer settings:', error);
      toast({
        title: "Error",
        description: "Failed to load footer settings",
        variant: "destructive"
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
        service_times: settings.service_times as any,
        quick_links: settings.quick_links as any
      };

      const { error } = settings.id
        ? await supabase
            .from('footer_settings')
            .update(dataToSave)
            .eq('id', settings.id)
        : await supabase
            .from('footer_settings')
            .insert([dataToSave]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Footer settings updated successfully"
      });
      
      fetchSettings();
    } catch (error) {
      console.error('Error saving footer settings:', error);
      toast({
        title: "Error",
        description: "Failed to save footer settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const addServiceTime = () => {
    setSettings({
      ...settings,
      service_times: [...settings.service_times, { name: '', time: '' }]
    });
  };

  const removeServiceTime = (index: number) => {
    const newServiceTimes = settings.service_times.filter((_, i) => i !== index);
    setSettings({ ...settings, service_times: newServiceTimes });
  };

  const updateServiceTime = (index: number, field: keyof ServiceTime, value: string) => {
    const newServiceTimes = [...settings.service_times];
    newServiceTimes[index] = { ...newServiceTimes[index], [field]: value };
    setSettings({ ...settings, service_times: newServiceTimes });
  };

  const addQuickLink = () => {
    setSettings({
      ...settings,
      quick_links: [...settings.quick_links, { label: '', url: '' }]
    });
  };

  const removeQuickLink = (index: number) => {
    const newQuickLinks = settings.quick_links.filter((_, i) => i !== index);
    setSettings({ ...settings, quick_links: newQuickLinks });
  };

  const updateQuickLink = (index: number, field: keyof QuickLink, value: string) => {
    const newQuickLinks = [...settings.quick_links];
    newQuickLinks[index] = { ...newQuickLinks[index], [field]: value };
    setSettings({ ...settings, quick_links: newQuickLinks });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">Footer Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your website footer content</p>
      </div>

      <div className="grid gap-6">
        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle>About Section</CardTitle>
            <CardDescription>Church information displayed in the footer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="church_name">Church Name</Label>
                <Input
                  id="church_name"
                  value={settings.church_name}
                  onChange={(e) => setSettings({ ...settings, church_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="church_abbreviation">Abbreviation</Label>
                <Input
                  id="church_abbreviation"
                  value={settings.church_abbreviation}
                  onChange={(e) => setSettings({ ...settings, church_abbreviation: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="about_text">About Text</Label>
              <Textarea
                id="about_text"
                value={settings.about_text}
                onChange={(e) => setSettings({ ...settings, about_text: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Times */}
        <Card>
          <CardHeader>
            <CardTitle>Service Times</CardTitle>
            <CardDescription>Add or remove service schedules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.service_times.map((service, index) => (
              <div key={index} className="flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label>Service Name</Label>
                  <Input
                    value={service.name}
                    onChange={(e) => updateServiceTime(index, 'name', e.target.value)}
                    placeholder="e.g., Sunday Worship"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>Time</Label>
                  <Input
                    value={service.time}
                    onChange={(e) => updateServiceTime(index, 'time', e.target.value)}
                    placeholder="e.g., 9:00 AM & 11:00 AM"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeServiceTime(index)}
                  disabled={settings.service_times.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addServiceTime}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service Time
            </Button>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Navigation links in the footer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.quick_links.map((link, index) => (
              <div key={index} className="flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label>Label</Label>
                  <Input
                    value={link.label}
                    onChange={(e) => updateQuickLink(index, 'label', e.target.value)}
                    placeholder="e.g., Sunday Services"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>URL</Label>
                  <Input
                    value={link.url}
                    onChange={(e) => updateQuickLink(index, 'url', e.target.value)}
                    placeholder="e.g., /services"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeQuickLink(index)}
                  disabled={settings.quick_links.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addQuickLink}>
              <Plus className="h-4 w-4 mr-2" />
              Add Quick Link
            </Button>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>Optional social media URLs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebook_url">Facebook URL</Label>
                <Input
                  id="facebook_url"
                  value={settings.facebook_url || ''}
                  onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter_url">Twitter URL</Label>
                <Input
                  id="twitter_url"
                  value={settings.twitter_url || ''}
                  onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instagram_url">Instagram URL</Label>
                <Input
                  id="instagram_url"
                  value={settings.instagram_url || ''}
                  onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube_url">YouTube URL</Label>
                <Input
                  id="youtube_url"
                  value={settings.youtube_url || ''}
                  onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Bottom */}
        <Card>
          <CardHeader>
            <CardTitle>Footer Bottom</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="copyright_text">Copyright Text</Label>
              <Input
                id="copyright_text"
                value={settings.copyright_text}
                onChange={(e) => setSettings({ ...settings, copyright_text: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show_privacy_policy"
                  checked={settings.show_privacy_policy}
                  onCheckedChange={(checked) => setSettings({ ...settings, show_privacy_policy: checked })}
                />
                <Label htmlFor="show_privacy_policy">Show Privacy Policy Link</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="show_terms_of_service"
                  checked={settings.show_terms_of_service}
                  onCheckedChange={(checked) => setSettings({ ...settings, show_terms_of_service: checked })}
                />
                <Label htmlFor="show_terms_of_service">Show Terms of Service Link</Label>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={settings.is_active}
                onCheckedChange={(checked) => setSettings({ ...settings, is_active: checked })}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FooterSettingsPage;
