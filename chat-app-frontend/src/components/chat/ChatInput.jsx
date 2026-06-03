import { useCallback, useEffect, useRef, useState } from "react";
import { ConnectionBadge } from "../ui";

const STOP_TYPING_DELAY = 1200;

const trimReplyPreview = (content = "") => (
  content.length > 120 ? `${content.slice(0, 120)}...` : content
);

export default function ChatInput({ onSend, onTyping, onStopTyping, connected, replyTo, onCancelReply }) {
  const [text, setText] = useState("");
  const isTypingRef = useRef(false);
  const stopTypingTimerRef = useRef(null);

  const clearStopTypingTimer = useCallback(() => {
    if (stopTypingTimerRef.current) {
      clearTimeout(stopTypingTimerRef.current);
      stopTypingTimerRef.current = null;
    }
  }, []);

  const emitStopTyping = useCallback(() => {
    clearStopTypingTimer();

    if (isTypingRef.current) {
      onStopTyping?.();
      isTypingRef.current = false;
    }
  }, [clearStopTypingTimer, onStopTyping]);

  const scheduleStopTyping = useCallback(() => {
    clearStopTypingTimer();
    stopTypingTimerRef.current = setTimeout(emitStopTyping, STOP_TYPING_DELAY);
  }, [clearStopTypingTimer, emitStopTyping]);

  const handleTextChange = (event) => {
    const nextText = event.target.value;
    setText(nextText);

    if (!connected) return;

    if (nextText.trim()) {
      if (!isTypingRef.current) {
        onTyping?.();
        isTypingRef.current = true;
      }
      scheduleStopTyping();
    } else {
      emitStopTyping();
    }
  };

  const handleSend = () => {
    if (!text.trim() || !connected) return;
    onSend(text.trim());
    setText("");
    emitStopTyping();
  };

  useEffect(() => () => emitStopTyping(), [emitStopTyping]);

  return (
    <div className="px-5 pt-3 pb-5 border-t border-[#222] bg-[#141414]">
      {replyTo && (
        <div className="mb-3 flex items-start justify-between gap-3 rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] px-4 py-3">
          <div className="min-w-0 border-l-2 border-blue-500 pl-3">
            <p className="text-xs font-semibold text-blue-300">Replying to {replyTo.sender}</p>
            <p className="mt-1 truncate text-xs text-neutral-400">{trimReplyPreview(replyTo.content)}</p>
          </div>
          <button
            type="button"
            onClick={onCancelReply}
            className="shrink-0 rounded-full border border-[#333] px-2 py-0.5 text-xs text-neutral-500 hover:text-neutral-200"
            title="Cancel reply"
          >
            x
          </button>
        </div>
      )}
      <div className="flex items-center gap-2.5 bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl px-4 py-2.5 focus-within:border-blue-600/50 transition-colors">
        <button className="text-neutral-600 hover:text-neutral-400 transition-colors text-lg">+</button>

        <input
          value={text}
          onChange={handleTextChange}
          onKeyDown={(event) => event.key === "Enter" && !event.shiftKey && handleSend()}
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
