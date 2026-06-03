import { Avatar } from "../ui";
import { useChatContext } from "../../contexts/ChatContext";

export default function Sidebar({ onlineUsers = [], onLeave }) {
  const { roomId, username, leaveRoom } = useChatContext();
  const members = onlineUsers.length > 0 ? onlineUsers : [username];

  const handleLeave = () => {
    onLeave?.();
    leaveRoom();
  };

  return (
    <div className="w-64 bg-[#141414] border-r border-[#222] flex flex-col h-full shrink-0">
      <div className="px-5 py-5 border-b border-[#222]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-lg shadow-[0_4px_12px_rgba(37,99,235,0.4)]">
            💬
          </div>
          <span className="text-white font-bold text-base font-mono">ChatApp</span>
        </div>
      </div>

      <div className="px-5 py-4 border-b border-[#222]">
        <p className="text-[10px] font-mono font-bold text-neutral-600 uppercase tracking-widest mb-2">
          Room ID
        </p>
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg px-3 py-2 flex items-center justify-between gap-2">
          <span className="text-blue-400 text-xs font-mono font-semibold truncate">{roomId}</span>
          <button
            onClick={() => navigator.clipboard?.writeText(roomId)}
            title="Copy Room ID"
            className="text-neutral-600 hover:text-neutral-400 transition-colors text-sm shrink-0"
          >
            ⎘
          </button>
        </div>
      </div>

      <div className="flex-1 px-5 py-4 overflow-y-auto">
        <p className="text-[10px] font-mono font-bold text-neutral-600 uppercase tracking-widest mb-3">
          Members
        </p>
        <div className="space-y-2">
          {members.map((member) => {
            const isCurrentUser = member === username;

            return (
              <div key={member} className="flex items-center gap-2.5 p-2 rounded-lg bg-[#1e1e1e]">
                <Avatar name={member} size="sm" />
                <div className="min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{member}</p>
                  <p className="text-emerald-400 text-[10px] font-mono">
                    {isCurrentUser ? "● You" : "● Online"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-5 py-5 border-t border-[#222]">
        <button
          onClick={handleLeave}
          className="w-full py-2.5 border border-red-500/60 text-red-400 text-sm font-bold font-mono rounded-xl flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all tracking-wide"
        >
          ⎋ Leave Room
        </button>
      </div>
    </div>
  );
}
