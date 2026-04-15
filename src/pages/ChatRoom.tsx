import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { chatMessages, chatThreads } from "@/data/mockData";
import type { ChatMessage } from "@/data/mockData";

const ChatRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const thread = chatThreads.find((t) => t.id === id);
  const initial = chatMessages[id || ""] || [];
  const [messages, setMessages] = useState<ChatMessage[]>(initial);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: `m${Date.now()}`, senderId: "farmer", text: input.trim(), timestamp: "Now" },
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/chat")} className="p-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
          {thread?.avatar || "?"}
        </div>
        <h2 className="font-bold text-lg">{thread?.name || "Chat"}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isMine = msg.senderId === "farmer";
          return (
            <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  isMine ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted rounded-bl-md"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className={`text-[10px] mt-1 ${isMine ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="bg-card border-t border-border p-3 flex items-center gap-2 safe-bottom">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          className="flex-1 bg-muted rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={send}
          className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
