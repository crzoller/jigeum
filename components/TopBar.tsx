export default function TopBar() {
  const today = new Date();
  const formatted = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header
      className="sticky top-0 z-10 w-full px-4 py-3 flex items-center justify-between"
      style={{
        backgroundColor: "rgba(10,10,10,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "0.5px solid var(--border)",
      }}
    >
      <div className="flex flex-col leading-tight">
        <span
          className="text-[22px] font-semibold tracking-tight"
          style={{
            fontFamily: "var(--font-noto-serif-kr), 'Noto Serif KR', serif",
            color: "#F0EDE6",
          }}
        >
          지금
        </span>
        <span
          className="text-[10px] tracking-widest uppercase"
          style={{ color: "var(--text-muted)", letterSpacing: "0.12em" }}
        >
          Jigeum
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span
          className="text-[12px]"
          style={{ color: "var(--text-secondary)" }}
        >
          {formatted}
        </span>
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-widest uppercase"
          style={{
            background: "var(--accent-muted)",
            color: "#E8453C",
            letterSpacing: "0.1em",
          }}
        >
          Daily
        </span>
      </div>
    </header>
  );
}
