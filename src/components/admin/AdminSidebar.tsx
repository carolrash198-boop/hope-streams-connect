import { Home, Calendar, Mail, FileText, Image, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", icon: Home, current: true },
  { name: "Events", icon: Calendar, current: false },
  { name: "Contact", icon: Mail, current: false },
  { name: "Sermons", icon: FileText, current: false },
  { name: "Gallery", icon: Image, current: false },
  { name: "Users", icon: Users, current: false },
  { name: "Settings", icon: Settings, current: false },
];

const AdminSidebar = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");

  return (
    <div className="w-64 bg-card border-r">
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
      </div>
      <nav className="space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.name;
          return (
            <button
              key={item.name}
              onClick={() => setActiveItem(item.name)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
