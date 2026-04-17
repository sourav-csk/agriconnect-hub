import { useEffect, useState } from "react";
import { ArrowLeft, Users, ShoppingCart, TrendingUp, BarChart3, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mandiPrices } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type Tab = "overview" | "users" | "listings";

interface ProfileRow {
  user_id: string;
  name: string;
  user_type: string;
  location: string | null;
  created_at: string;
}
interface ListingRow {
  id: string;
  crop_name: string;
  category: string | null;
  quantity: number;
  unit: string;
  expected_price: number;
  status: string;
  user_id: string;
  profiles?: { name: string; location: string | null } | null;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [msgCount, setMsgCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      const [{ data: p }, { data: l }, { count }] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase
          .from("crop_listings")
          .select("*, profiles!crop_listings_user_id_fkey(name, location)")
          .order("created_at", { ascending: false }),
        supabase.from("messages").select("*", { count: "exact", head: true }),
      ]);
      setProfiles((p as any) || []);
      setListings((l as any) || []);
      setMsgCount(count || 0);
    };
    load();
  }, [isAdmin]);

  if (isAdmin === null) {
    return <div className="flex items-center justify-center min-h-screen text-muted-foreground">Checking access...</div>;
  }
  if (!isAdmin) {
    return (
      <div className="px-4 pt-10 max-w-lg mx-auto text-center">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <p className="text-5xl mb-4">🔒</p>
        <h1 className="text-xl font-extrabold mb-2">Admin access required</h1>
        <p className="text-sm text-muted-foreground">
          Your account does not have admin privileges. Ask an existing admin to grant your account the <code>admin</code> role.
        </p>
      </div>
    );
  }

  const activeListings = listings.filter((l) => l.status === "active").length;
  const farmers = profiles.filter((p) => p.user_type === "farmer").length;

  const stats = [
    { label: "Total Users", value: profiles.length.toString(), icon: Users, color: "bg-primary/15 text-primary" },
    { label: "Active Listings", value: activeListings.toString(), icon: ShoppingCart, color: "bg-secondary/15 text-secondary" },
    { label: "Messages", value: msgCount.toString(), icon: TrendingUp, color: "bg-info/15 text-info" },
    { label: "Farmers", value: farmers.toString(), icon: BarChart3, color: "bg-success/15 text-success" },
  ];

  const filteredUsers = profiles.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.user_type.toLowerCase().includes(search.toLowerCase())
  );
  const filteredListings = listings.filter(
    (l) =>
      l.crop_name.toLowerCase().includes(search.toLowerCase()) ||
      (l.profiles?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-extrabold">Admin Panel</h1>
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto">
        {(["overview", "users", "listings"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setSearch("");
            }}
            className={`px-4 py-2 rounded-full text-sm font-bold capitalize whitespace-nowrap transition-colors ${
              tab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

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

          <div>
            <h2 className="font-extrabold text-lg mb-3">🕐 Recent Listings</h2>
            <div className="space-y-2">
              {listings.slice(0, 5).map((l) => (
                <div key={l.id} className="bg-card rounded-xl p-3 shadow-sm text-sm flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span className="flex-1 truncate">
                    {l.profiles?.name || "User"} listed {l.quantity}{l.unit} {l.crop_name}
                  </span>
                </div>
              ))}
              {listings.length === 0 && <p className="text-sm text-muted-foreground">No listings yet</p>}
            </div>
          </div>
        </div>
      )}

      {tab === "users" && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-12 rounded-xl text-base" />
          </div>
          <div className="space-y-2">
            {filteredUsers.map((u) => (
              <Card key={u.user_id} className="rounded-2xl border-0 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-lg font-bold text-primary">
                      {(u.name || "U")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{u.name || "Unnamed"}</p>
                      <p className="text-xs text-muted-foreground">{u.user_type} · {u.location || "—"}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-primary/15 text-primary">
                    {new Date(u.created_at).toLocaleDateString()}
                  </span>
                </CardContent>
              </Card>
            ))}
            {filteredUsers.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No users found</p>}
          </div>
        </div>
      )}

      {tab === "listings" && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder="Search listings..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-12 rounded-xl text-base" />
          </div>
          <div className="space-y-2">
            {filteredListings.map((l) => (
              <Card key={l.id} className="rounded-2xl border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold">{l.crop_name}</p>
                    {l.category && <span className="text-xs bg-secondary/15 text-secondary font-bold px-2 py-1 rounded-full">{l.category}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    by {l.profiles?.name || "Unknown"} · {l.profiles?.location || "—"}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span>{l.quantity} {l.unit}</span>
                    <span className="font-extrabold text-primary">₹{l.expected_price}/{l.unit}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredListings.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No listings found</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
