import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "@/components/BottomNav";
import Dashboard from "@/pages/Dashboard";
import Marketplace from "@/pages/Marketplace";
import SellCrop from "@/pages/SellCrop";
import ChatList from "@/pages/ChatList";
import ChatRoom from "@/pages/ChatRoom";
import Advisory from "@/pages/Advisory";
import Logistics from "@/pages/Logistics";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const hideNavPaths = ["/login", "/advisory"];

const AppLayout = () => {
  const location = useLocation();
  const hideNav = hideNavPaths.includes(location.pathname) || location.pathname.startsWith("/chat/");

  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/sell" element={<SellCrop />} />
        <Route path="/chat" element={<ChatList />} />
        <Route path="/chat/:id" element={<ChatRoom />} />
        <Route path="/advisory" element={<Advisory />} />
        <Route path="/logistics" element={<Logistics />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideNav && <BottomNav />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
