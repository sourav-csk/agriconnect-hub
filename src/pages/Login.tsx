import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, ArrowRight, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async () => {
    if (!email || !password) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        if (!name) {
          toast({ title: "Please enter your name", variant: "destructive" });
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        });
        if (error) throw error;
        toast({ title: "✅ Account Created!", description: "You can now log in." });
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="text-6xl mb-4">🌾</p>
          <h1 className="text-3xl font-extrabold text-primary">AgriConnect</h1>
          <p className="text-muted-foreground mt-2">Connecting Farmers & Buyers</p>
        </div>

        <div className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-bold mb-2">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-card border border-border rounded-xl px-4 py-4 text-base focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold mb-2">Email</label>
            <div className="flex items-center bg-card border border-border rounded-xl overflow-hidden">
              <Mail className="w-5 h-5 ml-3 text-muted-foreground" />
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 py-4 px-3 text-base bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-card border border-border rounded-xl px-4 py-4 text-base focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-4 rounded-2xl text-lg font-extrabold disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Login"}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-primary font-bold py-2 text-sm"
          >
            {isSignUp ? "Already have an account? Login" : "New farmer? Create Account"}
          </button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-8">
          By continuing, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
};

export default Login;
