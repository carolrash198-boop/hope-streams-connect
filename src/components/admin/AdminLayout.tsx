import { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full bg-muted/10">
      <AdminSidebar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};
