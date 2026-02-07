import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CreateAccount from "./pages/CreateAccount";
import Login from "./pages/Login";
import Download from "./pages/Download";
import Donate from "./pages/Donate";
import Rankings from "./pages/Rankings";
import UCP from "./pages/UCP";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Rules from "./pages/Rules";
import ForgotPassword from "./pages/ForgotPassword";
import Description from "./pages/Description";
import { ScrollToTop } from "./components/ScrollToTop";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDownloads from "./pages/admin/AdminDownloads";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminDescription from "./pages/admin/AdminDescription";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/description" element={<Description />} />
          <Route path="/register" element={<CreateAccount />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />
          <Route path="/download" element={<Download />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/ucp" element={<UCP />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/downloads" element={<AdminDownloads />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/description" element={<AdminDescription />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
