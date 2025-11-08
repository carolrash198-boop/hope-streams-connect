const AdminFooter = () => {
  return (
    <footer className="mt-auto border-t bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div>
            © 2025 Free Pentecostal Fellowship Church of Kenya. All rights reserved.
          </div>
          <div className="flex gap-6">
            <span>Admin Panel v1.0</span>
            <span>•</span>
            <a href="/admin/help" className="hover:text-foreground transition-colors">
              Help & Support
            </a>
            <span>•</span>
            <a href="/admin/settings" className="hover:text-foreground transition-colors">
              Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
