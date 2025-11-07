import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface HeroSettings {
  id: string;
  heading: string;
  tagline: string;
  subtitle: string;
  next_service_title: string;
  service_name: string;
  service_time: string;
  service_location: string;
  is_active: boolean;
}

const HeroSettings = () => {
  const [settings, setSettings] = useState<HeroSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_settings')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error('Error fetching hero settings:', error);
      toast.error('Failed to load hero settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('hero_settings')
        .update({
          heading: settings.heading,
          tagline: settings.tagline,
          subtitle: settings.subtitle,
          next_service_title: settings.next_service_title,
          service_name: settings.service_name,
          service_time: settings.service_time,
          service_location: settings.service_location,
        })
        .eq('id', settings.id);

      if (error) throw error;
      toast.success('Hero settings updated successfully!');
    } catch (error) {
      console.error('Error updating hero settings:', error);
      toast.error('Failed to update hero settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>No Hero Settings Found</CardTitle>
            <CardDescription>Please contact support to initialize hero settings.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Hero Section Settings</CardTitle>
          <CardDescription>Manage the hero section content displayed on the homepage</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="heading">Main Heading</Label>
              <Input
                id="heading"
                value={settings.heading}
                onChange={(e) => setSettings({ ...settings, heading: e.target.value })}
                placeholder="Church Name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                placeholder="Hope. Freedom. Community."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                value={settings.subtitle}
                onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
                placeholder="Welcome message and service times"
                rows={3}
                required
              />
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Next Service Information</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="next_service_title">Section Title</Label>
                  <Input
                    id="next_service_title"
                    value={settings.next_service_title}
                    onChange={(e) => setSettings({ ...settings, next_service_title: e.target.value })}
                    placeholder="Next Service"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service_name">Service Name</Label>
                  <Input
                    id="service_name"
                    value={settings.service_name}
                    onChange={(e) => setSettings({ ...settings, service_name: e.target.value })}
                    placeholder="Sunday Worship"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service_time">Service Time</Label>
                  <Input
                    id="service_time"
                    value={settings.service_time}
                    onChange={(e) => setSettings({ ...settings, service_time: e.target.value })}
                    placeholder="This Sunday at 9:00 AM"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service_location">Service Location</Label>
                  <Input
                    id="service_location"
                    value={settings.service_location}
                    onChange={(e) => setSettings({ ...settings, service_location: e.target.value })}
                    placeholder="Main Sanctuary • City, Country"
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={saving} className="w-full">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeroSettings;
