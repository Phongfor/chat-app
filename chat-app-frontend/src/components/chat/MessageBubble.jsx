import { Avatar } from "../ui";
import { useChatContext } from "../../contexts/ChatContext";

const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "👏"];

const formatTime = (timestamp) => {
  if (!timestamp) return "";
  try {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return timestamp;
  }
};

const trimReplyPreview = (content = "") => (
  content.length > 90 ? `${content.slice(0, 90)}...` : content
);

export default function MessageBubble({ message, onReply, onReact }) {
  const { username } = useChatContext();
  const isMine = message.sender === username;
  const reactions = Object.entries(message.reactions || {}).filter(([, users]) => users?.length);

  return (
    <div className={`flex items-start gap-2.5 mb-5 ${isMine ? "justify-end" : "justify-start"}`}
      style={{ animation: "fadeUp 0.2s ease" }}>

      {!isMine && <Avatar name={message.sender} size="sm" />}

      <div className={`flex flex-col max-w-[62%] ${isMine ? "items-end" : "items-start"}`}>
        {!isMine && (
          <span className="text-[11px] text-neutral-500 font-semibold font-mono mb-1">
            {message.sender}
          </span>
        )}

        <div className={`group relative px-4 py-2.5 text-sm leading-relaxed text-white
          ${isMine
            ? "bg-gradient-to-br from-blue-600 to-blue-700 rounded-[18px_18px_4px_18px] shadow-[0_4px_16px_rgba(37,99,235,0.3)]"
            : "bg-[#2a2a2a] border border-[#333] rounded-[18px_18px_18px_4px] shadow-sm"
          }`}>
          {message.replyToId && (
            <div className={`mb-2 rounded-lg border-l-2 px-3 py-2 text-xs leading-snug
              ${isMine
                ? "bg-blue-950/35 border-blue-200/70 text-blue-100"
                : "bg-[#1e1e1e] border-neutral-500 text-neutral-300"
              }`}>
              <div className="mb-0.5 font-semibold">{message.replyToSender}</div>
              <div className="line-clamp-2 opacity-80">{trimReplyPreview(message.replyToContent)}</div>
            </div>
          )}
          {message.content}
        </div>

        {reactions.length > 0 && (
          <div className={`mt-1 flex max-w-full flex-wrap gap-1 ${isMine ? "justify-end" : "justify-start"}`}>
            {reactions.map(([emoji, users]) => {
              const reacted = users.includes(username);

              return (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => onReact?.(message, emoji)}
                  title={users.join(", ")}
                  className={`rounded-full border px-2 py-0.5 text-xs transition-colors
                    ${reacted
                      ? "border-blue-400/70 bg-blue-500/20 text-white"
                      : "border-[#333] bg-[#1e1e1e] text-neutral-300 hover:border-[#555]"
                    }`}
                >
                  <span>{emoji}</span>
                  <span className="ml-1 font-mono">{users.length}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className={`mt-1 flex items-center gap-1 opacity-0 transition-opacity hover:opacity-100 focus-within:opacity-100 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
          <button
            type="button"
            onClick={() => onReply?.(message)}
            className="rounded-full border border-transparent px-2 py-0.5 text-[10px] font-mono text-neutral-600 hover:border-[#333] hover:text-neutral-300"
          >
            Reply
          </button>
          {QUICK_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onReact?.(message, emoji)}
              className="rounded-full border border-transparent px-1.5 py-0.5 text-xs hover:border-[#333] hover:bg-[#1e1e1e]"
              title={`React ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>

        <span className="text-[10px] text-neutral-600 mt-1 font-mono">
          {formatTime(message.timeStamp)}{isMine && " · You"}
        </span>
      </div>

      {isMine && <Avatar name={username} size="sm" />}
    </div>
  );
}
