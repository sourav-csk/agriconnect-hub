import { Cloud, Droplets, Bell, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PriceCard from "@/components/PriceCard";
import { mandiPrices, weatherData } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profileName, setProfileName] = useState("Farmer");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("name")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.name) setProfileName(data.name);
      });
  }, [user]);

  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate("/profile")} className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">👨‍🌾</div>
          <div>
            <h1 className="text-lg font-extrabold leading-tight">🌾 AgriConnect</h1>
            <p className="text-muted-foreground text-xs">Namaste, {profileName}!</p>
          </div>
        </button>
        <button className="relative w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center font-bold">3</span>
        </button>
      </div>

      {/* Weather Card */}
      <div className="bg-primary text-primary-foreground rounded-2xl p-5 mb-6 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm opacity-80">Your Area Weather</p>
            <p className="text-3xl font-extrabold">{weatherData.temp}°C</p>
            <p className="text-sm font-semibold">{weatherData.condition}</p>
          </div>
          <Cloud className="w-16 h-16 opacity-80" />
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1"><Droplets className="w-4 h-4" /> {weatherData.humidity}% Humidity</span>
          <span>🌧️ {weatherData.rainfall}mm Rain</span>
        </div>
        <div className="flex gap-3 mt-4 overflow-x-auto">
          {weatherData.forecast.map((day) => (
            <div key={day.day} className="bg-primary-foreground/10 rounded-xl px-3 py-2 text-center min-w-[60px]">
              <p className="text-xs opacity-80">{day.day}</p>
              <p className="text-lg">{day.condition}</p>
              <p className="text-sm font-bold">{day.temp}°</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button onClick={() => navigate("/sell")} className="bg-secondary text-secondary-foreground rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-transform">
          <span className="text-3xl">📦</span><span className="font-bold">Sell Crop</span>
        </button>
        <button onClick={() => navigate("/marketplace")} className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-transform">
          <span className="text-3xl">🏪</span><span className="font-bold">Marketplace</span>
        </button>
        <button onClick={() => navigate("/advisory")} className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-transform">
          <span className="text-3xl">🤖</span><span className="font-bold">AI Advice</span>
        </button>
        <button onClick={() => navigate("/logistics")} className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-transform">
          <span className="text-3xl">🚛</span><span className="font-bold">Transport</span>
        </button>
      </div>

      {/* Mandi Prices */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-extrabold">📊 Mandi Prices</h2>
          <button className="text-primary text-sm font-bold flex items-center gap-1">View All <ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="space-y-3">
          {mandiPrices.slice(0, 4).map((price) => (
            <PriceCard key={price.crop} {...price} />
          ))}
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-start gap-3">
        <span className="text-2xl">⚠️</span>
        <div>
          <p className="font-bold text-sm">Rain Alert</p>
          <p className="text-sm text-muted-foreground">Heavy rainfall expected on Wednesday. Protect your crops.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
