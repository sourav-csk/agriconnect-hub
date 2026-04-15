import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";
import Dashboard from "@/pages/Dashboard";
import Marketplace from "@/pages/Marketplace";
import SellCrop from "@/pages/SellCrop";
import ChatList from "@/pages/ChatList";
import ChatRoom from "@/pages/ChatRoom";
import Advisory from "@/pages/Advisory";
import Logistics from "@/pages/Logistics";
import Login from "@/pages/Login";
import FarmerProfile from "@/pages/FarmerProfile";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const hideNavPaths = ["/login", "/advisory", "/profile", "/admin"];

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-muted-foreground">Loading...</p></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppLayout = () => {
  const location = useLocation();
  const hideNav = hideNavPaths.includes(location.pathname) || location.pathname.startsWith("/chat/");

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
        <Route path="/sell" element={<ProtectedRoute><SellCrop /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><ChatList /></ProtectedRoute>} />
        <Route path="/chat/:id" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />
        <Route path="/advisory" element={<ProtectedRoute><Advisory /></ProtectedRoute>} />
        <Route path="/logistics" element={<ProtectedRoute><Logistics /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><FarmerProfile /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
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
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
