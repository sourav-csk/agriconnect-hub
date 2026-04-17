import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { cropCategories } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ListingWithProfile {
  id: string;
  user_id: string;
  crop_name: string;
  quantity: number;
  unit: string;
  expected_price: number;
  category: string | null;
  location: string | null;
  created_at: string;
  profiles: { name: string; location: string | null } | null;
}

const Marketplace = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [listings, setListings] = useState<ListingWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      const { data } = await supabase
        .from("crop_listings")
        .select("*, profiles!crop_listings_user_id_fkey(name, location)")
        .eq("status", "active")
        .order("created_at", { ascending: false });
      setListings((data as any) || []);
      setLoading(false);
    };
    fetchListings();
  }, []);

  const filtered = listings.filter((l) => {
    const matchSearch =
      l.crop_name.toLowerCase().includes(search.toLowerCase()) ||
      (l.location || "").toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || l.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-extrabold mb-4">🏪 Marketplace</h1>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input type="text" placeholder="Search crops, location..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>

      <div className="flex gap-2 overflow-x-auto mb-5 pb-1">
        {cropCategories.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${category === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="font-semibold">Loading listings...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-4xl mb-2">🔍</p>
            <p className="font-semibold">No crops found</p>
          </div>
        ) : (
          filtered.map((listing) => (
            <div key={listing.id} className="bg-card border border-border rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-extrabold text-lg">{listing.crop_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {listing.profiles?.name || "Unknown"} · {listing.profiles?.location || listing.location || ""}
                  </p>
                </div>
                {listing.category && (
                  <span className="bg-secondary/15 text-secondary text-xs font-bold px-2 py-1 rounded-full">{listing.category}</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{listing.quantity} {listing.unit}</span>
                <span className="font-extrabold text-primary">₹{listing.expected_price}/{listing.unit}</span>
              </div>
              <button onClick={() => navigate(`/chat/${listing.user_id}`)} className="w-full mt-3 bg-primary/10 text-primary font-bold py-2 rounded-xl text-sm active:scale-[0.98] transition-transform">
                💬 Contact Farmer
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Marketplace;
