import { TrendingUp, TrendingDown } from "lucide-react";
import type { MandiPrice } from "@/data/mockData";

const PriceCard = ({ crop, price, change, unit }: MandiPrice) => {
  const isUp = change > 0;
  return (
    <div className="bg-card rounded-xl p-4 shadow-sm border border-border flex items-center justify-between">
      <div>
        <p className="text-lg font-bold">{crop}</p>
        <p className="text-sm text-muted-foreground">per {unit}</p>
      </div>
      <div className="text-right">
        <p className="text-xl font-extrabold">₹{price}</p>
        <div className={`flex items-center gap-1 text-sm font-semibold ${isUp ? "text-success" : "text-destructive"}`}>
          {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{isUp ? "+" : ""}{change}%</span>
        </div>
      </div>
    </div>
  );
};

export default PriceCard;
