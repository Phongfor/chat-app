import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useChatContext } from "../contexts/ChatContext";
import { useChat } from "../hooks/useChat";
import Sidebar from "../components/chat/Sidebar";
import MessageBubble from "../components/chat/MessageBubble";
import ChatInput from "../components/chat/ChatInput";
import { Spinner, EmptyState } from "../components/ui";

export default function ChatPage() {
  const { roomId, username } = useChatContext();
  const navigate = useNavigate();

  // ✅ Redirect TRƯỚC khi gọi useChat
  useEffect(() => {
    if (!roomId || !username) navigate("/", { replace: true });
  }, [roomId, username, navigate]);

  // ✅ Nếu chưa có roomId thì không render gì cả
  if (!roomId || !username) return null;

  return <ChatPageContent roomId={roomId} username={username} />;
}

// Tách thành component riêng để useChat chỉ chạy khi đã có roomId
function ChatPageContent({ roomId, username }) {
  const { messages, connected, loading, hasMore, send, loadMore } = useChat(roomId, username);
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleScroll = () => {
    if (containerRef.current?.scrollTop === 0 && hasMore) loadMore();
  };

  return (
    <div className="flex h-screen bg-[#0f0f0f] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222] bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <div>
              <h2 className="text-white font-bold text-sm">{roomId}</h2>
              <p className="text-neutral-600 text-[11px] font-mono">Room active</p>
            </div>
          </div>
          <div className="flex gap-2">
            {["🔍", "🔔", "⋮"].map(icon => (
              <button key={icon} className="w-8 h-8 bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg text-neutral-500 hover:text-neutral-300 hover:border-[#444] transition-all text-sm">
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 py-6"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#2a2a2a transparent" }}
        >
          {hasMore && (
            <button onClick={loadMore} className="w-full text-center text-xs text-neutral-600 font-mono py-2 hover:text-neutral-400 transition-colors mb-4">
              ↑ Load older messages
            </button>
          )}

          {loading ? <Spinner /> : messages.length === 0 ? <EmptyState /> : (
            <>
              <div className="flex items-center justify-center mb-6">
                <span className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-full px-4 py-1 text-neutral-600 text-[11px] font-mono">
                  TODAY
                </span>
              </div>
              {messages.map((msg, idx) => (
                <MessageBubble key={idx} message={msg} />
              ))}
            </>
          )}
          <div ref={bottomRef} />
        </div>

        <ChatInput onSend={send} connected={connected} />
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
