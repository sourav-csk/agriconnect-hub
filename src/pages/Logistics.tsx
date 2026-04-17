import { useEffect, useState } from "react";
import { ArrowLeft, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Request {
  id: string;
  pickup: string;
  delivery: string;
  weight: number;
  preferred_date: string;
  status: string;
}

const Logistics = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);

  const loadRequests = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("transport_requests")
      .select("*")
      .order("created_at", { ascending: false });
    setRequests(data || []);
  };

  useEffect(() => {
    loadRequests();
  }, [user]);

  const handleSubmit = async () => {
    if (!user) return;
    if (!pickup || !delivery || !weight || !date) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("transport_requests").insert({
      user_id: user.id,
      pickup,
      delivery,
      weight: Number(weight),
      preferred_date: date,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "🚛 Transport Requested!", description: "Nearby transporters will be notified." });
    setPickup(""); setDelivery(""); setWeight(""); setDate("");
    loadRequests();
  };

  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/")} className="p-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-extrabold">🚛 Request Transport</h1>
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6 flex items-center gap-3">
        <Truck className="w-8 h-8 text-primary" />
        <p className="text-sm">Fill the form below and nearby transporters will contact you with quotes.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-1">Pickup Location</label>
          <input type="text" placeholder="e.g. Indore Mandi" value={pickup} onChange={(e) => setPickup(e.target.value)}
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Delivery Location</label>
          <input type="text" placeholder="e.g. Bhopal Market" value={delivery} onChange={(e) => setDelivery(e.target.value)}
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Weight (quintals)</label>
          <input type="number" placeholder="e.g. 50" value={weight} onChange={(e) => setWeight(e.target.value)}
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Preferred Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-primary text-primary-foreground py-4 rounded-2xl text-lg font-extrabold active:scale-[0.98] transition-transform shadow-md disabled:opacity-50">
          {loading ? "Requesting..." : "Request Transport"}
        </button>
      </div>

      {requests.length > 0 && (
        <div className="mt-8">
          <h2 className="font-extrabold text-lg mb-3">My Requests</h2>
          <div className="space-y-2">
            {requests.map((r) => (
              <div key={r.id} className="bg-card border border-border rounded-xl p-3 text-sm">
                <div className="flex justify-between mb-1">
                  <p className="font-bold">{r.pickup} → {r.delivery}</p>
                  <span className="text-xs font-bold bg-primary/15 text-primary px-2 py-0.5 rounded-full capitalize">{r.status}</span>
                </div>
                <p className="text-muted-foreground text-xs">{r.weight} quintals · {new Date(r.preferred_date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Logistics;
