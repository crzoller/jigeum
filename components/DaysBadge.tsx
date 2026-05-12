type Props = {
  days: number;
  size?: "sm" | "md";
};

export default function DaysBadge({ days, size = "md" }: Props) {
  const label = days === 1 ? "1 day" : `${days} days`;

  if (size === "sm") {
    return (
      <span
        className="text-[10px] font-medium tracking-wide uppercase"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium tracking-wide"
      style={{
        background: "var(--accent-muted)",
        color: "#E8453C",
      }}
    >
      {label}
    </span>
  );
}
