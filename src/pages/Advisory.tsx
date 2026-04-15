import { useState } from "react";
import { Send, Bot, User } from "lucide-react";

interface Msg {
  role: "user" | "bot";
  text: string;
}

const quickQuestions = [
  "Best crop for this season?",
  "How to protect from pests?",
  "When to use fertilizer?",
  "Irrigation tips for wheat",
];

const mockResponses: Record<string, string> = {
  "best crop for this season?":
    "For the current Rabi season, Wheat, Mustard, and Chickpea are ideal choices. Wheat gives the best returns in North India.",
  "how to protect from pests?":
    "Use neem oil spray (5ml/litre) every 15 days. For severe infestations, consult your local KVK. Avoid chemical pesticides near harvest.",
  "when to use fertilizer?":
    "Apply DAP at sowing time and Urea in 2 splits — first at 21 days and second at 45 days after sowing.",
  "irrigation tips for wheat":
    "Wheat needs 5-6 irrigations. Critical stages: Crown root (21 days), Tillering (45 days), Flowering (65 days), and Grain filling (85 days).",
};

const Advisory = () => {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", text: "🌾 Namaste! I'm your AI Farm Advisor. Ask me about crops, fertilizers, irrigation, or pest control." },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Msg = { role: "user", text: text.trim() };
    const response = mockResponses[text.toLowerCase().trim()] ||
      "I'll help you with that! For detailed guidance, please visit your nearest Krishi Vigyan Kendra (KVK) or call the Kisan Helpline at 1800-180-1551.";
    
    setMessages((prev) => [...prev, userMsg, { role: "bot", text: response }]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-4 py-4">
        <h1 className="text-xl font-extrabold flex items-center gap-2">
          <Bot className="w-6 h-6" /> AI Farm Advisor
        </h1>
        <p className="text-sm opacity-80">Ask questions in simple language</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "bot" && (
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-card border border-border rounded-bl-md"
              }`}
            >
              {msg.text}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Questions */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto bg-background">
        {quickQuestions.map((q) => (
          <button
            key={q}
            onClick={() => sendMessage(q)}
            className="bg-muted text-foreground px-3 py-2 rounded-full text-xs font-bold whitespace-nowrap active:bg-primary active:text-primary-foreground transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="bg-card border-t border-border p-3 flex items-center gap-2 safe-bottom">
        <input
          type="text"
          placeholder="Ask your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          className="flex-1 bg-muted rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={() => sendMessage(input)}
          className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Advisory;
