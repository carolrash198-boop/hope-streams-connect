import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import NotificationBell from "./NotificationBell";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Search,
  LogOut,
  User,
  Settings,
  HelpCircle,
  Menu,
  ChevronRight,
} from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface AdminNavbarProps {
  onMenuToggle?: () => void;
}

const AdminNavbar = ({ onMenuToggle }: AdminNavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Get user info
  useState(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/admin/auth");
  };

  // Search items - all admin pages
  const searchItems = [
    { title: "Dashboard", url: "/admin/dashboard", keywords: "home overview stats" },
    { title: "Churches", url: "/admin/churches", keywords: "church manage" },
    { title: "Church Members", url: "/admin/church-members", keywords: "members people congregation" },
    { title: "Church Resources", url: "/admin/church-resources", keywords: "resources equipment assets" },
    { title: "Donations", url: "/admin/donations", keywords: "giving money finance" },
    { title: "Events", url: "/admin/events", keywords: "calendar activities programs" },
    { title: "Sermons", url: "/admin/sermons", keywords: "messages preaching videos" },
    { title: "Gallery", url: "/admin/gallery", keywords: "photos images pictures" },
    { title: "Blog", url: "/admin/blog", keywords: "articles posts news" },
    { title: "Contact Submissions", url: "/admin/contact", keywords: "messages inquiries" },
    { title: "Prayer Requests", url: "/admin/prayers", keywords: "prayers intercession" },
    { title: "Volunteers", url: "/admin/volunteers", keywords: "helpers servants ministry" },
    { title: "Users", url: "/admin/users", keywords: "accounts profiles" },
    { title: "Services", url: "/admin/services", keywords: "worship schedule" },
    { title: "Sunday School", url: "/admin/sunday-school", keywords: "kids children classes" },
    { title: "Outreach", url: "/admin/outreach", keywords: "missions community service" },
    { title: "Campaigns", url: "/admin/campaigns", keywords: "fundraising goals" },
    { title: "Payment Methods", url: "/admin/payment-methods", keywords: "payments transactions" },
    { title: "Hero Settings", url: "/admin/hero-settings", keywords: "homepage banner" },
    { title: "Footer Settings", url: "/admin/footer-settings", keywords: "footer links" },
    { title: "Advertisements", url: "/admin/advertisements", keywords: "ads promotions" },
  ];

  // Get breadcrumbs from current path
  const getBreadcrumbs = () => {
    const path = location.pathname;
    const segments = path.split("/").filter(Boolean);
    
    if (segments.length <= 1) return null;
    
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="hover:text-foreground cursor-pointer" onClick={() => navigate("/admin/dashboard")}>
          Admin
        </span>
        {segments.slice(1).map((segment, index) => (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />
            <span className="capitalize hover:text-foreground cursor-pointer">
              {segment.replace(/-/g, " ")}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const getUserInitials = () => {
    if (!user?.email) return "AD";
    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-6 gap-4">
          {/* Menu Toggle for Mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Breadcrumbs */}
          <div className="hidden md:block">
            {getBreadcrumbs()}
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search admin panel... (Ctrl+K)"
                className="pl-9"
                onClick={() => setSearchOpen(true)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    setSearchOpen(true);
                  }
                }}
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Quick Help */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open("https://docs.lovable.dev", "_blank")}
              title="Help & Documentation"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <NotificationBell />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">Admin Account</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email || "admin@church.org"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/admin/users")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/admin/hero-settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Site Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Search Command Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search admin panel..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {searchItems.map((item) => (
              <CommandItem
                key={item.url}
                onSelect={() => {
                  navigate(item.url);
                  setSearchOpen(false);
                }}
                keywords={[item.keywords]}
              >
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default AdminNavbar;
