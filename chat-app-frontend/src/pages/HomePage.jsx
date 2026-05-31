import { useNavigate } from "react-router-dom";
import RoomForm from "../components/home/RoomForm";
import { useChatContext } from "../contexts/ChatContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { enterRoom } = useChatContext();

  const handleEnter = (roomId, username) => {
    enterRoom(roomId, username);
    navigate("/chat");
  };

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-5xl grid gap-10 lg:grid-cols-[1fr_380px] lg:items-center">
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#141414] px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-widest text-neutral-500">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            Realtime room chat
          </div>

          <div className="space-y-4">
            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-normal text-white md:text-5xl">
              Join a room and start chatting instantly.
            </h1>
            <p className="max-w-xl text-sm leading-6 text-neutral-500">
              Create a private room or enter an existing Room ID to connect with your team.
            </p>
          </div>

          <div className="grid max-w-xl gap-3 sm:grid-cols-3">
            {["Rooms", "Realtime", "History"].map((item) => (
              <div key={item} className="rounded-lg border border-[#222] bg-[#141414] px-4 py-3">
                <p className="text-xs font-mono font-semibold uppercase tracking-widest text-neutral-500">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        <RoomForm onEnter={handleEnter} />
      </div>
    </main>
  );
}
