import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import SundaySchool from "./pages/SundaySchool";
import Outreach from "./pages/Outreach";
import BibleStudies from "./pages/BibleStudies";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Donate from "./pages/Donate";
import NotFound from "./pages/NotFound";
import AdminAuth from "./pages/admin/Auth";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminEvents from "./pages/admin/Events";
import AdminSermons from "./pages/admin/Sermons";
import AdminLiveStream from "./pages/admin/LiveStream";
import AdminContact from "./pages/admin/Contact";
import AdminGallery from "./pages/admin/Gallery";
import AdminPrayers from "./pages/admin/Prayers";
import AdminDonations from "./pages/admin/Donations";
import AdminBlog from "./pages/admin/Blog";
import AdminUsers from "./pages/admin/Users";
import AdminSundaySchool from "./pages/admin/SundaySchool";
import AdminClassVisits from "./pages/admin/ClassVisits";
import AdminServices from "./pages/admin/Services";
import AdminSundaySchoolContent from "./pages/admin/SundaySchoolContent";
import AdminOutreach from "./pages/admin/Outreach";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/sunday-school" element={<SundaySchool />} />
          <Route path="/outreach" element={<Outreach />} />
          <Route path="/bible-studies" element={<BibleStudies />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/admin/auth" element={<AdminAuth />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/sermons" element={<AdminSermons />} />
          <Route path="/admin/live-stream" element={<AdminLiveStream />} />
          <Route path="/admin/outreach" element={<AdminOutreach />} />
          <Route path="/admin/contact" element={<AdminContact />} />
          <Route path="/admin/gallery" element={<AdminGallery />} />
          <Route path="/admin/prayers" element={<AdminPrayers />} />
          <Route path="/admin/donations" element={<AdminDonations />} />
          <Route path="/admin/blog" element={<AdminBlog />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/sunday-school" element={<AdminSundaySchool />} />
          <Route path="/admin/sunday-school-content" element={<AdminSundaySchoolContent />} />
          <Route path="/admin/class-visits" element={<AdminClassVisits />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
