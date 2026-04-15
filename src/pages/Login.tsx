import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");

  const sendOtp = () => {
    if (phone.length < 10) return;
    setStep("otp");
  };

  const verifyOtp = () => {
    if (otp.length < 4) return;
    localStorage.setItem("agri_user", JSON.stringify({ phone, name: "Farmer" }));
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="text-6xl mb-4">🌾</p>
          <h1 className="text-3xl font-extrabold text-primary">AgriConnect</h1>
          <p className="text-muted-foreground mt-2">Connecting Farmers & Buyers</p>
        </div>

        {step === "phone" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Mobile Number</label>
              <div className="flex items-center bg-card border border-border rounded-xl overflow-hidden">
                <span className="px-3 text-muted-foreground font-bold">+91</span>
                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="flex-1 py-4 pr-4 text-lg bg-transparent focus:outline-none"
                  maxLength={10}
                />
                <Phone className="w-5 h-5 mr-3 text-muted-foreground" />
              </div>
            </div>
            <button
              onClick={sendOtp}
              disabled={phone.length < 10}
              className="w-full bg-primary text-primary-foreground py-4 rounded-2xl text-lg font-extrabold disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              Send OTP <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              OTP sent to +91 {phone}
            </p>
            <div>
              <label className="block text-sm font-bold mb-2">Enter OTP</label>
              <input
                type="text"
                placeholder="Enter 4-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                className="w-full bg-card border border-border rounded-xl px-4 py-4 text-center text-2xl tracking-[0.5em] font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={4}
              />
            </div>
            <button
              onClick={verifyOtp}
              disabled={otp.length < 4}
              className="w-full bg-primary text-primary-foreground py-4 rounded-2xl text-lg font-extrabold disabled:opacity-50 active:scale-[0.98] transition-transform"
            >
              Verify & Login
            </button>
            <button
              onClick={() => { setStep("phone"); setOtp(""); }}
              className="w-full text-primary font-bold py-2"
            >
              Change Number
            </button>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center mt-8">
          By continuing, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
};

export default Login;
