import { ReactNode, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import AdminFooter from "./AdminFooter";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-muted/10">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block`}>
        <AdminSidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sticky Navigation */}
        <AdminNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        
        {/* Sticky Footer */}
        <AdminFooter />
      </div>
    </div>
  );
};
