import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Download from "./pages/Download";
import Donate from "./pages/Donate";
import Rankings from "./pages/Rankings";
import Features from "./pages/Features";
import Media from "./pages/Media";
import UCP from "./pages/UCP";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/download" element={<Download />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/features" element={<Features />} />
          <Route path="/media" element={<Media />} />
          <Route path="/ucp" element={<UCP />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
