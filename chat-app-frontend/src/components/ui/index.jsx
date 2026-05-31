// ─── Avatar ───────────────────────────────────────────────────────────────────
export const Avatar = ({ name, size = "md" }) => {
  const sizeClass = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-sm", lg: "w-11 h-11 text-base" };
  const colors = ["bg-blue-600", "bg-purple-600", "bg-emerald-600", "bg-orange-600", "bg-rose-600", "bg-cyan-600"];
  let hash = 0;
  for (let i = 0; i < name?.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const color = colors[Math.abs(hash) % colors.length];

  return (
    <div className={`${sizeClass[size]} ${color} rounded-full flex items-center justify-center font-bold text-white shrink-0 shadow-md`}>
      {name?.charAt(0).toUpperCase()}
    </div>
  );
};

// ─── ConnectionBadge ──────────────────────────────────────────────────────────
export const ConnectionBadge = ({ connected }) => (
  <div className="flex items-center gap-1.5">
    <div className={`w-2 h-2 rounded-full shrink-0
      ${connected ? "bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" : "bg-red-500"}`}
    />
    <span className="text-[11px] font-mono font-semibold tracking-widest uppercase text-neutral-500">
      {connected ? "Connected to Primary-Cluster-1" : "Disconnected"}
    </span>
  </div>
);

// ─── Spinner ──────────────────────────────────────────────────────────────────
export const Spinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

// ─── EmptyState ───────────────────────────────────────────────────────────────
export const EmptyState = ({ text = "No messages yet. Say hello!" }) => (
  <div className="flex flex-col items-center justify-center h-full gap-3 text-neutral-700 select-none">
    <span className="text-4xl">💬</span>
    <p className="text-sm font-mono">{text}</p>
  </div>
);