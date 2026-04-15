import { useNavigate } from "react-router-dom";
import { chatThreads } from "@/data/mockData";

const ChatList = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-extrabold mb-4">💬 Messages</h1>

      <div className="space-y-2">
        {chatThreads.map((thread) => (
          <button
            key={thread.id}
            onClick={() => navigate(`/chat/${thread.id}`)}
            className="w-full bg-card border border-border rounded-xl p-4 flex items-center gap-3 text-left active:bg-muted transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold flex-shrink-0">
              {thread.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold truncate">{thread.name}</h3>
                {thread.unread > 0 && (
                  <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0">
                    {thread.unread}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">{thread.lastMessage}</p>
            </div>
          </button>
        ))}
      </div>

      {chatThreads.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-4xl mb-2">💬</p>
          <p className="font-semibold">No messages yet</p>
          <p className="text-sm">Contact a farmer or buyer to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default ChatList;
