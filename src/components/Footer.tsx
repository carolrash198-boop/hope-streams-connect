import { Link } from "react-router-dom";
import { Heart, MapPin, Phone, Mail, Clock } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-sm">FPFK</span>
              </div>
              <span className="font-heading text-lg font-bold">Free Pentecostal Fellowship</span>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Hope. Freedom. Community. We gather to worship, heal, and serve together in Christ's love.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/services" className="block text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Sunday Services
              </Link>
              <Link to="/bible-studies" className="block text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Bible Studies
              </Link>
              <Link to="/sunday-school" className="block text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Sunday School
              </Link>
              <Link to="/outreach" className="block text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Outreach
              </Link>
            </div>
          </div>

          {/* Service Times */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold">Service Times</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Clock className="h-4 w-4 mt-1 text-accent" />
                <div className="text-sm">
                  <p className="font-medium">Sunday Worship</p>
                  <p className="text-primary-foreground/80">9:00 AM & 11:00 AM</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="h-4 w-4 mt-1 text-accent" />
                <div className="text-sm">
                  <p className="font-medium">Wednesday Bible Study</p>
                  <p className="text-primary-foreground/80">7:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1 text-accent" />
                <div className="text-sm">
                  <p className="text-primary-foreground/80">Baringo County</p>
                  <p className="text-primary-foreground/80">Kenya</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-accent" />
                <a href="tel:+1234567890" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  (123) 456-7890
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-accent" />
                <a href="mailto:info@fpfchurch.or.ke" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  info@fpfchurch.or.ke
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-primary-foreground/80">
            © 2025 Free Pentecostal Fellowship Church of Kenya. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};