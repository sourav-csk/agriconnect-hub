import { useState } from "react";
import { ArrowLeft, Users, ShoppingCart, TrendingUp, BarChart3, Search, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cropListings, mandiPrices } from "@/data/mockData";

const mockUsers = [
  { id: "1", name: "Ramesh Kumar", type: "Farmer", location: "Indore, MP", status: "active", crops: 3 },
  { id: "2", name: "Sita Devi", type: "Farmer", location: "Nashik, MH", status: "active", crops: 1 },
  { id: "3", name: "Vikram Wholesaler", type: "Buyer", location: "Delhi", status: "active", crops: 0 },
  { id: "4", name: "Green Mart Retail", type: "Buyer", location: "Mumbai", status: "inactive", crops: 0 },
  { id: "5", name: "Arjun Singh", type: "Farmer", location: "Lucknow, UP", status: "active", crops: 2 },
];

const stats = [
  { label: "Total Users", value: "1,247", icon: Users, color: "bg-primary/15 text-primary" },
  { label: "Active Listings", value: "342", icon: ShoppingCart, color: "bg-secondary/15 text-secondary" },
  { label: "Transactions", value: "89", icon: TrendingUp, color: "bg-info/15 text-info" },
  { label: "Revenue", value: "₹4.2L", icon: BarChart3, color: "bg-success/15 text-success" },
];

type Tab = "overview" | "users" | "listings";

const Admin = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");

  const filteredUsers = mockUsers.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.type.toLowerCase().includes(search.toLowerCase())
  );

  const filteredListings = cropListings.filter((l) =>
    l.cropName.toLowerCase().includes(search.toLowerCase()) ||
    l.farmerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-extrabold">Admin Panel</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto">
        {(["overview", "users", "listings"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setSearch(""); }}
            className={`px-4 py-2 rounded-full text-sm font-bold capitalize whitespace-nowrap transition-colors ${
              tab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === "overview" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <Card key={s.label} className="rounded-2xl border-0 shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-lg font-extrabold">{s.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Top Prices */}
          <div>
            <h2 className="font-extrabold text-lg mb-3">📊 Today's Top Prices</h2>
            <div className="space-y-2">
              {mandiPrices.slice(0, 5).map((p) => (
                <div key={p.crop} className="flex items-center justify-between bg-card rounded-xl p-3 shadow-sm">
                  <span className="font-semibold text-sm">{p.crop}</span>
                  <div className="text-right">
                    <span className="font-bold text-sm">₹{p.price}/{p.unit}</span>
                    <span className={`ml-2 text-xs font-bold ${p.change >= 0 ? "text-primary" : "text-destructive"}`}>
                      {p.change >= 0 ? "↑" : "↓"}{Math.abs(p.change)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="font-extrabold text-lg mb-3">🕐 Recent Activity</h2>
            <div className="space-y-2">
              {["Ramesh listed 50q Wheat", "Vikram purchased 30q Rice", "Sita updated Onion price", "New buyer registered: Hotel Sunrise"].map((a, i) => (
                <div key={i} className="bg-card rounded-xl p-3 shadow-sm text-sm flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  {a}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {tab === "users" && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 rounded-xl text-base"
            />
          </div>
          <div className="space-y-2">
            {filteredUsers.map((u) => (
              <Card key={u.id} className="rounded-2xl border-0 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-lg font-bold text-primary">
                      {u.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.type} · {u.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      u.status === "active" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      {u.status}
                    </span>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Listings Tab */}
      {tab === "listings" && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search listings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 rounded-xl text-base"
            />
          </div>
          <div className="space-y-2">
            {filteredListings.map((l) => (
              <Card key={l.id} className="rounded-2xl border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold">{l.cropName}</p>
                    <span className="text-xs bg-secondary/15 text-secondary font-bold px-2 py-1 rounded-full">{l.category}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">by {l.farmerName} · {l.farmerLocation}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span>{l.quantity} {l.unit}</span>
                    <span className="font-extrabold text-primary">₹{l.expectedPrice}/{l.unit}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
