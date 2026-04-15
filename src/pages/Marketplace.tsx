import { useState } from "react";
import { Search } from "lucide-react";
import CropCard from "@/components/CropCard";
import { cropListings, cropCategories } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

const Marketplace = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const navigate = useNavigate();

  const filtered = cropListings.filter((l) => {
    const matchSearch = l.cropName.toLowerCase().includes(search.toLowerCase()) ||
      l.farmerLocation.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || l.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-extrabold mb-4">🏪 Marketplace</h1>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search crops, location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto mb-5 pb-1">
        {cropCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
              category === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Listings */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-4xl mb-2">🔍</p>
            <p className="font-semibold">No crops found</p>
          </div>
        ) : (
          filtered.map((listing) => (
            <CropCard
              key={listing.id}
              listing={listing}
              onContact={() => navigate("/chat")}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Marketplace;
