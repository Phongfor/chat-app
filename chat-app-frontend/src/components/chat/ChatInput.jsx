import { useState } from "react";
import { ConnectionBadge } from "../ui";

export default function ChatInput({ onSend, connected }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim() || !connected) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="px-5 pt-3 pb-5 border-t border-[#222] bg-[#141414]">
      <div className="flex items-center gap-2.5 bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl px-4 py-2.5 focus-within:border-blue-600/50 transition-colors">
        <button className="text-neutral-600 hover:text-neutral-400 transition-colors text-lg">+</button>

        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Type a message..."
          disabled={!connected}
          className="flex-1 bg-transparent outline-none text-white text-sm placeholder:text-neutral-700 disabled:opacity-50"
        />

        <button className="text-neutral-600 hover:text-neutral-400 transition-colors text-lg">😊</button>

        <button
          onClick={handleSend}
          disabled={!text.trim() || !connected}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-base transition-all
            ${text.trim() && connected
              ? "bg-gradient-to-br from-blue-600 to-blue-700 shadow-[0_4px_12px_rgba(37,99,235,0.4)] hover:from-blue-500"
              : "bg-[#2a2a2a] cursor-not-allowed opacity-50"
            }`}
        >
          ➤
        </button>
      </div>

      <div className="flex items-center justify-between mt-2 px-1">
        <ConnectionBadge connected={connected} />
        <span className="text-[10px] text-neutral-700 font-mono">Press Enter to send</span>
      </div>
    </div>
  );
}