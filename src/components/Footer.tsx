import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface FooterSettings {
  church_name: string;
  church_abbreviation: string;
  about_text: string;
  address_line1: string;
  address_line2: string;
  phone: string;
  email: string;
  service_times: Array<{ name: string; time: string }>;
  quick_links: Array<{ label: string; url: string }>;
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  copyright_text: string;
  show_privacy_policy: boolean;
  show_terms_of_service: boolean;
}

interface ServiceTime {
  name: string;
  time: string;
}

interface QuickLink {
  label: string;
  url: string;
}

export const Footer = () => {
  const [settings, setSettings] = useState<FooterSettings>({
    church_name: 'Free Pentecostal Fellowship',
    church_abbreviation: 'FPFK',
    about_text: 'Hope. Freedom. Community. We gather to worship, heal, and serve together in Christ\'s love.',
    address_line1: 'Baringo County',
    address_line2: 'Kenya',
    phone: '(123) 456-7890',
    email: 'info@fpfchurch.or.ke',
    service_times: [
      { name: 'Sunday Worship', time: '9:00 AM & 11:00 AM' },
      { name: 'Wednesday Bible Study', time: '7:00 PM' }
    ],
    quick_links: [
      { label: 'Sunday Services', url: '/services' },
      { label: 'Bible Studies', url: '/bible-studies' },
      { label: 'Sunday School', url: '/sunday-school' },
      { label: 'Outreach', url: '/outreach' }
    ],
    copyright_text: '© 2025 Free Pentecostal Fellowship Church of Kenya. All rights reserved.',
    show_privacy_policy: true,
    show_terms_of_service: true
  });

  useEffect(() => {
    fetchFooterSettings();
  }, []);

  const fetchFooterSettings = async () => {
    const { data, error } = await supabase
      .from('footer_settings')
      .select('*')
      .eq('is_active', true)
      .single();

    if (!error && data) {
      setSettings({
        ...data,
        service_times: data.service_times as unknown as ServiceTime[],
        quick_links: data.quick_links as unknown as QuickLink[]
      });
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-sm">{settings.church_abbreviation}</span>
              </div>
              <span className="font-heading text-lg font-bold">{settings.church_name}</span>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              {settings.about_text}
            </p>
            {/* Social Media Links */}
            {(settings.facebook_url || settings.twitter_url || settings.instagram_url || settings.youtube_url) && (
              <div className="flex items-center space-x-3 pt-2">
                {settings.facebook_url && (
                  <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {settings.twitter_url && (
                  <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {settings.instagram_url && (
                  <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {settings.youtube_url && (
                  <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    <Youtube className="h-5 w-5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              {settings.quick_links.map((link, index) => (
                <Link 
                  key={index}
                  to={link.url} 
                  className="block text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Service Times */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold">Service Times</h3>
            <div className="space-y-3">
              {settings.service_times.map((service, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Clock className="h-4 w-4 mt-1 text-accent" />
                  <div className="text-sm">
                    <p className="font-medium">{service.name}</p>
                    <p className="text-primary-foreground/80">{service.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1 text-accent" />
                <div className="text-sm">
                  <p className="text-primary-foreground/80">{settings.address_line1}</p>
                  <p className="text-primary-foreground/80">{settings.address_line2}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-accent" />
                <a href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`} className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-accent" />
                <a href={`mailto:${settings.email}`} className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  {settings.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-primary-foreground/80">
            {settings.copyright_text}
          </p>
          {(settings.show_privacy_policy || settings.show_terms_of_service) && (
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              {settings.show_privacy_policy && (
                <Link to="/privacy" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Privacy Policy
                </Link>
              )}
              {settings.show_terms_of_service && (
                <Link to="/terms" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Terms of Service
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};