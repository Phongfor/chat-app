import { Avatar } from "../ui";
import { useChatContext } from "../../contexts/ChatContext";

const formatTime = (timestamp) => {
  if (!timestamp) return "";
  try {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return timestamp;
  }
};

export default function MessageBubble({ message }) {
  const { username } = useChatContext();
  const isMine = message.sender === username;

  return (
    <div className={`flex items-end gap-2.5 mb-5 ${isMine ? "flex-row-reverse" : "flex-row"}`}
      style={{ animation: "fadeUp 0.2s ease" }}>

      {!isMine && <Avatar name={message.sender} size="sm" />}

      <div className={`flex flex-col max-w-[62%] ${isMine ? "items-end" : "items-start"}`}>
        {!isMine && (
          <span className="text-[11px] text-neutral-500 font-semibold font-mono mb-1">
            {message.sender}
          </span>
        )}

        <div className={`px-4 py-2.5 text-sm leading-relaxed text-white
          ${isMine
            ? "bg-gradient-to-br from-blue-600 to-blue-700 rounded-[18px_18px_4px_18px] shadow-[0_4px_16px_rgba(37,99,235,0.3)]"
            : "bg-[#2a2a2a] border border-[#333] rounded-[18px_18px_18px_4px] shadow-sm"
          }`}>
          {message.content}
        </div>

        <span className="text-[10px] text-neutral-600 mt-1 font-mono">
          {formatTime(message.timeStamp)}{isMine && " · You"}
        </span>
      </div>

      {isMine && <Avatar name={username} size="sm" />}
    </div>
  );
}
