import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VideoPlayerProvider } from "./contexts/VideoPlayerContext";
import { VideoPlayerModal } from "./components/VideoPlayerModal";
import { PWAUpdatePrompt } from "./components/PWAUpdatePrompt";
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
import AdminLiveCoverage from "./pages/admin/LiveCoverage";
import AdminContact from "./pages/admin/Contact";
import AdminGallery from "./pages/admin/Gallery";
import AdminPrayers from "./pages/admin/Prayers";
import AdminDonations from "./pages/admin/Donations";
import AdminPaymentMethods from "./pages/admin/PaymentMethods";
import AdminCampaigns from "./pages/admin/Campaigns";
import AdminBlog from "./pages/admin/Blog";
import AdminUsers from "./pages/admin/Users";
import AdminSundaySchool from "./pages/admin/SundaySchool";
import AdminClassVisits from "./pages/admin/ClassVisits";
import AdminServices from "./pages/admin/Services";
import AdminSundaySchoolContent from "./pages/admin/SundaySchoolContent";
import AdminOutreach from "./pages/admin/Outreach";
import AdminVolunteers from "./pages/admin/Volunteers";
import AdminHeroSettings from "./pages/admin/HeroSettings";
import AdminFooterSettings from "./pages/admin/FooterSettings";
import AdminFundraisingAnalytics from "./pages/admin/FundraisingAnalytics";
import AdminAdvertisements from "./pages/admin/Advertisements";
import AdminChurches from "./pages/admin/Churches";
import AdminChurchMembers from "./pages/admin/ChurchMembers";
import AdminChurchResources from "./pages/admin/ChurchResources";
import AdminTithes from "./pages/admin/Tithes";
import { AdminLayout } from "./components/admin/AdminLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <VideoPlayerProvider>
        <Toaster />
        <Sonner />
        <VideoPlayerModal />
        <PWAUpdatePrompt />
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
          <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/hero-settings" element={<AdminLayout><AdminHeroSettings /></AdminLayout>} />
          <Route path="/admin/footer-settings" element={<AdminLayout><AdminFooterSettings /></AdminLayout>} />
          <Route path="/admin/services" element={<AdminLayout><AdminServices /></AdminLayout>} />
          <Route path="/admin/events" element={<AdminLayout><AdminEvents /></AdminLayout>} />
          <Route path="/admin/sermons" element={<AdminLayout><AdminSermons /></AdminLayout>} />
          <Route path="/admin/live-stream" element={<AdminLayout><AdminLiveStream /></AdminLayout>} />
          <Route path="/admin/live-coverage" element={<AdminLayout><AdminLiveCoverage /></AdminLayout>} />
          <Route path="/admin/outreach" element={<AdminLayout><AdminOutreach /></AdminLayout>} />
          <Route path="/admin/volunteers" element={<AdminLayout><AdminVolunteers /></AdminLayout>} />
          <Route path="/admin/contact" element={<AdminLayout><AdminContact /></AdminLayout>} />
          <Route path="/admin/gallery" element={<AdminLayout><AdminGallery /></AdminLayout>} />
          <Route path="/admin/prayers" element={<AdminLayout><AdminPrayers /></AdminLayout>} />
          <Route path="/admin/donations" element={<AdminLayout><AdminDonations /></AdminLayout>} />
          <Route path="/admin/payment-methods" element={<AdminLayout><AdminPaymentMethods /></AdminLayout>} />
          <Route path="/admin/campaigns" element={<AdminLayout><AdminCampaigns /></AdminLayout>} />
          <Route path="/admin/fundraising-analytics" element={<AdminLayout><AdminFundraisingAnalytics /></AdminLayout>} />
          <Route path="/admin/blog" element={<AdminLayout><AdminBlog /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
          <Route path="/admin/sunday-school" element={<AdminLayout><AdminSundaySchool /></AdminLayout>} />
          <Route path="/admin/sunday-school-content" element={<AdminLayout><AdminSundaySchoolContent /></AdminLayout>} />
          <Route path="/admin/class-visits" element={<AdminLayout><AdminClassVisits /></AdminLayout>} />
          <Route path="/admin/advertisements" element={<AdminLayout><AdminAdvertisements /></AdminLayout>} />
          <Route path="/admin/churches" element={<AdminLayout><AdminChurches /></AdminLayout>} />
          <Route path="/admin/church-members" element={<AdminLayout><AdminChurchMembers /></AdminLayout>} />
          <Route path="/admin/church-resources" element={<AdminLayout><AdminChurchResources /></AdminLayout>} />
          <Route path="/admin/tithes" element={<AdminLayout><AdminTithes /></AdminLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </VideoPlayerProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
