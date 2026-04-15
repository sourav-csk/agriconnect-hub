import { useState } from "react";
import { ArrowLeft, Camera, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const cropOptions = ["Wheat", "Rice", "Onion", "Potato", "Tomato", "Maize", "Soybean", "Groundnut", "Cotton", "Sugarcane"];

const FarmerProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    name: "Ramesh Kumar",
    phone: "+91 98765 43210",
    location: "Indore, Madhya Pradesh",
    farmSize: "5",
    farmUnit: "acres",
    crops: ["Wheat", "Soybean"],
  });

  const toggleCrop = (crop: string) => {
    setProfile((prev) => ({
      ...prev,
      crops: prev.crops.includes(crop)
        ? prev.crops.filter((c) => c !== crop)
        : [...prev.crops, crop],
    }));
  };

  const handleSave = () => {
    toast({ title: "✅ Profile Updated", description: "Your profile has been saved successfully." });
  };

  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-extrabold">My Profile</h1>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-4xl">
            👨‍🌾
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <p className="mt-2 font-bold text-lg">{profile.name}</p>
        <p className="text-muted-foreground text-sm">{profile.phone}</p>
      </div>

      {/* Form */}
      <div className="space-y-5">
        <div>
          <Label className="text-sm font-bold mb-1.5 block">Full Name</Label>
          <Input
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="h-12 rounded-xl text-base"
          />
        </div>

        <div>
          <Label className="text-sm font-bold mb-1.5 block">Phone Number</Label>
          <Input
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="h-12 rounded-xl text-base"
          />
        </div>

        <div>
          <Label className="text-sm font-bold mb-1.5 block">Location</Label>
          <Input
            value={profile.location}
            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            className="h-12 rounded-xl text-base"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <Label className="text-sm font-bold mb-1.5 block">Farm Size</Label>
            <Input
              type="number"
              value={profile.farmSize}
              onChange={(e) => setProfile({ ...profile, farmSize: e.target.value })}
              className="h-12 rounded-xl text-base"
            />
          </div>
          <div className="w-28">
            <Label className="text-sm font-bold mb-1.5 block">Unit</Label>
            <select
              value={profile.farmUnit}
              onChange={(e) => setProfile({ ...profile, farmUnit: e.target.value })}
              className="h-12 w-full rounded-xl border border-input bg-background px-3 text-base"
            >
              <option value="acres">Acres</option>
              <option value="hectares">Hectares</option>
              <option value="bigha">Bigha</option>
            </select>
          </div>
        </div>

        {/* Crop Preferences */}
        <div>
          <Label className="text-sm font-bold mb-2 block">Crop Preferences</Label>
          <div className="flex flex-wrap gap-2">
            {cropOptions.map((crop) => {
              const selected = profile.crops.includes(crop);
              return (
                <button
                  key={crop}
                  onClick={() => toggleCrop(crop)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {crop}
                </button>
              );
            })}
          </div>
        </div>

        <Button onClick={handleSave} className="w-full h-14 rounded-xl text-lg font-bold gap-2 mt-4">
          <Save className="w-5 h-5" /> Save Profile
        </Button>
      </div>
    </div>
  );
};

export default FarmerProfile;
