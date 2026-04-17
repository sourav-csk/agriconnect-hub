import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  text: string;
  created_at: string;
  read: boolean;
}

const ChatRoom = () => {
  const { id: otherId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherName, setOtherName] = useState("Chat");
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !otherId) return;

    supabase
      .from("profiles")
      .select("name")
      .eq("user_id", otherId)
      .single()
      .then(({ data }) => data?.name && setOtherName(data.name));

    const load = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${user.id})`
        )
        .order("created_at", { ascending: true });
      setMessages(data || []);
      // mark as read
      await supabase
        .from("messages")
        .update({ read: true })
        .eq("sender_id", otherId)
        .eq("receiver_id", user.id)
        .eq("read", false);
    };
    load();

    const channel = supabase
      .channel(`chat-${otherId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const m = payload.new as Message;
          if (
            (m.sender_id === user.id && m.receiver_id === otherId) ||
            (m.sender_id === otherId && m.receiver_id === user.id)
          ) {
            setMessages((prev) => (prev.find((x) => x.id === m.id) ? prev : [...prev, m]));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, otherId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || !user || !otherId) return;
    const text = input.trim();
    setInput("");
    const { error } = await supabase
      .from("messages")
      .insert({ sender_id: user.id, receiver_id: otherId, text });
    if (error) console.error(error);
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto">
      <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/chat")} className="p-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
          {otherName[0]?.toUpperCase() || "?"}
        </div>
        <h2 className="font-bold text-lg">{otherName}</h2>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground text-sm pt-8">
            Say hello to start the conversation
          </p>
        )}
        {messages.map((msg) => {
          const isMine = msg.sender_id === user?.id;
          return (
            <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  isMine
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted rounded-bl-md"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p
                  className={`text-[10px] mt-1 ${
                    isMine ? "text-primary-foreground/60" : "text-muted-foreground"
                  }`}
                >
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

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
