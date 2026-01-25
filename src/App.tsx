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
import Features from "./pages/Features";
import Media from "./pages/Media";
import News from "./pages/News";
import UCP from "./pages/UCP";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminNews from "./pages/admin/AdminNews";
import AdminDownloads from "./pages/admin/AdminDownloads";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<CreateAccount />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />
          <Route path="/download" element={<Download />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/features" element={<Features />} />
          <Route path="/media" element={<Media />} />
          <Route path="/news" element={<News />} />
          <Route path="/ucp" element={<UCP />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/news" element={<AdminNews />} />
          <Route path="/admin/downloads" element={<AdminDownloads />} />
          <Route path="/admin/media" element={<AdminMedia />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
