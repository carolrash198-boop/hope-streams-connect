import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Image,
  Users,
  Heart,
  Calendar,
  DollarSign,
  Settings,
  MessageSquare,
  HandHeart,
  PlaySquare,
  BookOpen,
  Megaphone,
  Video,
  Baby,
  UserCog,
  TrendingUp,
  CreditCard,
  Church,
  UsersRound,
  Package,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

interface SidebarItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const sidebarGroups: SidebarGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    ],
  },
  {
    title: "Content Management",
    items: [
      { title: "Hero Settings", icon: Settings, href: "/admin/hero-settings" },
      { title: "Footer Settings", icon: Settings, href: "/admin/footer-settings" },
      { title: "Advertisements", icon: Megaphone, href: "/admin/advertisements" },
      { title: "Blog", icon: FileText, href: "/admin/blog" },
      { title: "Gallery", icon: Image, href: "/admin/gallery" },
    ],
  },
  {
    title: "Church Management",
    items: [
      { title: "Churches", icon: Church, href: "/admin/churches" },
      { title: "Church Members", icon: UsersRound, href: "/admin/church-members" },
      { title: "Church Resources", icon: Package, href: "/admin/church-resources" },
    ],
  },
  {
    title: "Services & Programs",
    items: [
      { title: "Services", icon: Settings, href: "/admin/services" },
      { title: "Sermons", icon: PlaySquare, href: "/admin/sermons" },
      { title: "Sunday School", icon: Baby, href: "/admin/sunday-school" },
      { title: "Sunday School Content", icon: BookOpen, href: "/admin/sunday-school-content" },
      { title: "Live Stream", icon: Video, href: "/admin/live-stream" },
      { title: "Live Coverage", icon: PlaySquare, href: "/admin/live-coverage" },
    ],
  },
  {
    title: "Events & Outreach",
    items: [
      { title: "Events", icon: Calendar, href: "/admin/events" },
      { title: "Outreach", icon: HandHeart, href: "/admin/outreach" },
    ],
  },
  {
    title: "People & Community",
    items: [
      { title: "Users", icon: Users, href: "/admin/users" },
      { title: "Volunteers", icon: UserCog, href: "/admin/volunteers" },
      { title: "Prayers", icon: Heart, href: "/admin/prayers" },
      { title: "Class Visits", icon: Calendar, href: "/admin/class-visits" },
    ],
  },
  {
    title: "Fundraising",
    items: [
      { title: "Donations", icon: DollarSign, href: "/admin/donations" },
      { title: "Campaigns", icon: TrendingUp, href: "/admin/campaigns" },
      { title: "Fundraising Analytics", icon: TrendingUp, href: "/admin/fundraising-analytics" },
      { title: "Payment Methods", icon: CreditCard, href: "/admin/payment-methods" },
    ],
  },
  {
    title: "Communications",
    items: [
      { title: "Contact", icon: MessageSquare, href: "/admin/contact" },
    ],
  },
];

const AdminSidebar = () => {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Overview: true,
    "Church Management": true,
  });

  const toggleGroup = (groupTitle: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupTitle]: !prev[groupTitle],
    }));
  };

  // Automatically open group if it contains the active route
  const isGroupActive = (items: SidebarItem[]) => {
    return items.some((item) => location.pathname === item.href || location.pathname.startsWith(item.href + "/"));
  };

  return (
    <div className="w-64 bg-card border-r h-full overflow-y-auto">
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
      </div>
      <nav className="space-y-1 p-4">
        {sidebarGroups.map((group) => {
          const isActive = isGroupActive(group.items);
          const isOpen = openGroups[group.title] !== false || isActive;

          return (
            <Collapsible key={group.title} open={isOpen} onOpenChange={() => toggleGroup(group.title)}>
              <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent">
                <span>{group.title}</span>
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 mt-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      end={item.href === "/admin/dashboard"}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
