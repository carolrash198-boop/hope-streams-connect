import { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import NotificationBell from "./NotificationBell";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full bg-muted/10">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-6">
          <div className="ml-auto">
            <NotificationBell />
          </div>
        </header>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};
