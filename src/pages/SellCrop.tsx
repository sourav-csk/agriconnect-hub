import { useState } from "react";
import { Camera, Sparkles } from "lucide-react";
import { suggestedPrices } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const SellCrop = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cropName, setCropName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Grains");
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCropNameChange = (value: string) => {
    setCropName(value);
    const key = Object.keys(suggestedPrices).find(
      (k) => k.toLowerCase() === value.toLowerCase()
    );
    setSuggestedPrice(key ? suggestedPrices[key] : null);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Please login first", variant: "destructive" });
      navigate("/login");
      return;
    }
    if (!cropName || !quantity || !price || !location) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("crop_listings").insert({
      user_id: user.id,
      crop_name: cropName,
      quantity: Number(quantity),
      expected_price: Number(price),
      location,
      category,
    });
    setLoading(false);

    if (error) {
      toast({ title: "Error listing crop", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Crop Listed!", description: `${cropName} listed successfully on marketplace.` });
      setCropName(""); setQuantity(""); setPrice(""); setLocation("");
      setSuggestedPrice(null);
    }
  };

  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-extrabold mb-6">📦 Sell Your Crop</h1>

      <div className="space-y-4">
        <button className="w-full h-36 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2 text-muted-foreground active:bg-muted transition-colors">
          <Camera className="w-10 h-10" />
          <span className="font-semibold">Add Crop Photo</span>
        </button>

        <div>
          <label className="block text-sm font-bold mb-1">Crop Name</label>
          <input type="text" placeholder="e.g. Wheat, Rice, Onion" value={cropName} onChange={(e) => handleCropNameChange(e.target.value)} className="w-full bg-card border border-border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>

        {suggestedPrice && (
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-primary">AI Price Suggestion</p>
              <p className="text-sm">Suggested price: <strong>₹{suggestedPrice}/quintal</strong></p>
            </div>
            <button onClick={() => setPrice(String(suggestedPrice))} className="ml-auto bg-primary text-primary-foreground px-3 py-1 rounded-lg text-sm font-bold">Use</button>
          </div>
        )}

        <div>
          <label className="block text-sm font-bold mb-1">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-card border border-border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary">
            <option>Grains</option>
            <option>Vegetables</option>
            <option>Fruits</option>
            <option>Oilseeds</option>
            <option>Spices</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Quantity (quintals)</label>
          <input type="number" placeholder="e.g. 50" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full bg-card border border-border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Expected Price (₹/quintal)</label>
          <input type="number" placeholder="e.g. 2400" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-card border border-border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Location</label>
          <input type="text" placeholder="e.g. Indore, MP" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-card border border-border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>

        <button onClick={handleSubmit} disabled={loading} className="w-full bg-primary text-primary-foreground py-4 rounded-2xl text-lg font-extrabold active:scale-[0.98] transition-transform shadow-md disabled:opacity-50">
          {loading ? "Listing..." : "List Crop for Sale"}
        </button>
      </div>
    </div>
  );
};

export default SellCrop;
