import { MapPin } from "lucide-react";
import type { CropListing } from "@/data/mockData";

interface CropCardProps {
  listing: CropListing;
  onContact?: () => void;
}

const CropCard = ({ listing, onContact }: CropCardProps) => {
  const cropEmoji: Record<string, string> = {
    Grains: "🌾", Vegetables: "🥬", Fruits: "🍎", Oilseeds: "🥜", Spices: "🌶️",
  };

  return (
    <div className="bg-card rounded-xl p-4 shadow-sm border border-border animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-3xl flex-shrink-0">
          {cropEmoji[listing.category] || "🌱"}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg truncate">{listing.cropName}</h3>
          <p className="text-sm text-muted-foreground">{listing.farmerName}</p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <MapPin className="w-3 h-3" />
            <span>{listing.farmerLocation}</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-extrabold text-primary">₹{listing.expectedPrice}</p>
          <p className="text-xs text-muted-foreground">/{listing.unit}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <span className="text-sm text-muted-foreground">
          {listing.quantity} {listing.unit} • {listing.postedAt}
        </span>
        <button
          onClick={onContact}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold"
        >
          Contact
        </button>
      </div>
    </div>
  );
};

export default CropCard;
