import { useState } from "react";
import { roomApi } from "../../services/api";

export default function RoomForm({ onEnter }) {
  const [roomId, setRoomId]     = useState("");
  const [username, setUsername] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const validate = () => {
    if (!username.trim()) { setError("Please enter your name"); return false; }
    if (!roomId.trim())   { setError("Please enter a Room ID"); return false; }
    return true;
  };

  const handleJoin = async () => {
    if (!validate()) return;
    setLoading(true); setError("");
    try {
      await roomApi.joinRoom(roomId.trim());
      onEnter(roomId.trim(), username.trim());
    } catch (err) {
      setError(err.response?.status === 404 ? "Room not found" : "Failed to join room");
    } finally { setLoading(false); }
  };

  const handleCreate = async () => {
    if (!username.trim()) { setError("Please enter your name first"); return; }
    const id = roomId.trim() || `ROOM-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    setLoading(true); setError("");
    try {
      await roomApi.createRoom(id);
      onEnter(id, username.trim());
    } catch (err) {
      setError(err.response?.data || "Failed to create room");
    } finally { setLoading(false); }
  };

  return (
    <div className="w-full max-w-sm bg-[#141414] border border-[#222] rounded-2xl p-8 shadow-[0_24px_64px_rgba(0,0,0,0.5)]">

      {/* Room ID */}
      <div className="mb-5">
        <label className="block text-[11px] font-mono font-bold text-neutral-500 uppercase tracking-widest mb-2">
          Room ID
        </label>
        <div className={`flex items-center gap-2.5 bg-[#1a1a1a] border rounded-xl px-4 py-3 transition-colors focus-within:border-blue-600
          ${error && !roomId ? "border-red-500" : "border-[#2a2a2a]"}`}>
          <span className="text-neutral-600">✦</span>
          <input
            value={roomId}
            onChange={e => { setRoomId(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleJoin()}
            placeholder="Enter Room ID"
            className="flex-1 bg-transparent outline-none text-white text-sm font-mono placeholder:text-neutral-700"
          />
        </div>
      </div>

      {/* Username */}
      <div className="mb-6">
        <label className="block text-[11px] font-mono font-bold text-neutral-500 uppercase tracking-widest mb-2">
          Your Identity
        </label>
        <div className="flex items-center gap-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 transition-colors focus-within:border-blue-600">
          <span className="text-neutral-600">◎</span>
          <input
            value={username}
            onChange={e => { setUsername(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleJoin()}
            placeholder="Enter your name"
            className="flex-1 bg-transparent outline-none text-white text-sm placeholder:text-neutral-700"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-xs mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          <span>⚠</span> {error}
        </div>
      )}

      {/* Join Button */}
      <button
        onClick={handleJoin}
        disabled={loading}
        className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-sm rounded-xl mb-3 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:from-blue-500 hover:to-blue-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading
          ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Connecting...</>
          : "Join Room →"
        }
      </button>

      {/* Create Button */}
      <button
        onClick={handleCreate}
        disabled={loading}
        className="w-full py-3.5 bg-transparent border border-[#2a2a2a] text-neutral-500 font-semibold text-sm rounded-xl flex items-center justify-center gap-2 hover:border-[#444] hover:text-neutral-300 transition-all disabled:opacity-60"
      >
        ⊕ Create Room
      </button>
    </div>
  );
}