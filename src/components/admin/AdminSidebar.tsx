import { Home, Calendar, Mail, FileText, Image, Users, Heart, DollarSign, BookOpen, GraduationCap, UserCheck, Church, BookMarked, Video, HandHeart, Settings, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { name: "Dashboard", icon: Home, path: "/admin/dashboard" },
  { name: "Hero Settings", icon: Settings, path: "/admin/hero-settings" },
  { name: "Footer Settings", icon: Settings, path: "/admin/footer-settings" },
  { name: "Services", icon: Church, path: "/admin/services" },
  { name: "Events", icon: Calendar, path: "/admin/events" },
  { name: "Sermons", icon: FileText, path: "/admin/sermons" },
  { name: "Live Stream", icon: Video, path: "/admin/live-stream" },
  { name: "Live Coverage", icon: Video, path: "/admin/live-coverage" },
  { name: "Outreach", icon: HandHeart, path: "/admin/outreach" },
  { name: "Volunteers", icon: Users, path: "/admin/volunteers" },
  { name: "Sunday School", icon: GraduationCap, path: "/admin/sunday-school" },
  { name: "SS Content", icon: BookMarked, path: "/admin/sunday-school-content" },
  { name: "Class Visits", icon: UserCheck, path: "/admin/class-visits" },
  { name: "Contact", icon: Mail, path: "/admin/contact" },
  { name: "Gallery", icon: Image, path: "/admin/gallery" },
  { name: "Prayer Requests", icon: Heart, path: "/admin/prayers" },
  { name: "Donations", icon: DollarSign, path: "/admin/donations" },
  { name: "Payment Methods", icon: CreditCard, path: "/admin/payment-methods" },
  { name: "Blog Posts", icon: BookOpen, path: "/admin/blog" },
  { name: "Users", icon: Users, path: "/admin/users" },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-card border-r">
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
      </div>
      <nav className="space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
