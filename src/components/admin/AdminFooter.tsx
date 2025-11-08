const AdminFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="sticky bottom-0 z-40 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>© {currentYear} Free Pentecostal Fellowship Church of Kenya.</span>
            <span className="hidden md:inline">All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium">Admin Panel v1.0</span>
            <span>•</span>
            <a 
              href="https://docs.lovable.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Help & Support
            </a>
            <span>•</span>
            <a 
              href="/admin/hero-settings" 
              className="hover:text-foreground transition-colors"
            >
              Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
