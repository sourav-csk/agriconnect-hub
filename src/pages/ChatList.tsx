import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Thread {
  otherId: string;
  name: string;
  lastMessage: string;
  unread: number;
  avatar: string;
  lastAt: string;
}

const ChatList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  const loadThreads = async () => {
    if (!user) return;
    const { data: msgs } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (!msgs) {
      setLoading(false);
      return;
    }

    const map = new Map<string, Thread>();
    for (const m of msgs) {
      const other = m.sender_id === user.id ? m.receiver_id : m.sender_id;
      if (!map.has(other)) {
        map.set(other, {
          otherId: other,
          name: "User",
          lastMessage: m.text,
          unread: 0,
          avatar: "?",
          lastAt: m.created_at,
        });
      }
      const t = map.get(other)!;
      if (m.receiver_id === user.id && !m.read) t.unread += 1;
    }

    const ids = [...map.keys()];
    if (ids.length) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, name")
        .in("user_id", ids);
      profiles?.forEach((p) => {
        const t = map.get(p.user_id);
        if (t) {
          t.name = p.name || "User";
          t.avatar = (p.name || "U")[0].toUpperCase();
        }
      });
    }

    setThreads([...map.values()]);
    setLoading(false);
  };

  useEffect(() => {
    loadThreads();
    if (!user) return;
    const channel = supabase
      .channel("chat-list")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => loadThreads())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-extrabold mb-4">💬 Messages</h1>

      {loading ? (
        <p className="text-center py-12 text-muted-foreground">Loading...</p>
      ) : threads.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-4xl mb-2">💬</p>
          <p className="font-semibold">No messages yet</p>
          <p className="text-sm">Visit the marketplace and contact a farmer to start chatting</p>
        </div>
      ) : (
        <div className="space-y-2">
          {threads.map((t) => (
            <button
              key={t.otherId}
              onClick={() => navigate(`/chat/${t.otherId}`)}
              className="w-full bg-card border border-border rounded-xl p-4 flex items-center gap-3 text-left active:bg-muted transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold flex-shrink-0">
                {t.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold truncate">{t.name}</h3>
                  {t.unread > 0 && (
                    <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0">
                      {t.unread}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">{t.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList;
