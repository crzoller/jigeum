import { Trend } from "@/lib/mock-data";
import DaysBadge from "./DaysBadge";

type Props = {
  trend: Trend;
};

export default function HeroCard({ trend }: Props) {
  return (
    <div
      className="w-full p-5 rounded-xl"
      style={{
        backgroundColor: "#111111",
        border: "0.5px solid var(--border)",
      }}
    >
      {/* Rank + category */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="text-[11px] font-semibold tracking-widest uppercase"
          style={{ color: "#E8453C", letterSpacing: "0.12em" }}
        >
          #1 Trending
        </span>
        <span
          className="px-2 py-0.5 rounded-full text-[11px] font-medium"
          style={{
            background: "var(--accent-muted)",
            color: "var(--text-secondary)",
          }}
        >
          {trend.subcategory}
        </span>
      </div>

      {/* Korean name */}
      <h2
        className="text-[36px] font-semibold leading-none mb-1"
        style={{
          fontFamily: "var(--font-noto-serif-kr), 'Noto Serif KR', serif",
          color: "#F0EDE6",
          letterSpacing: "-0.01em",
        }}
      >
        {trend.korean_name}
      </h2>

      {/* English name */}
      <p
        className="text-[14px] mb-4"
        style={{ color: "var(--text-secondary)" }}
      >
        {trend.english_name}
      </p>

      {/* Description */}
      <p
        className="text-[14px] leading-relaxed mb-5"
        style={{ color: "var(--text-muted)" }}
      >
        {trend.description}
      </p>

      {/* Footer row */}
      <div className="flex items-center justify-between">
        <DaysBadge days={trend.days_trending} />

        {/* Volume bar */}
        <div className="flex items-center gap-2">
          <span
            className="text-[11px]"
            style={{ color: "var(--text-hint)" }}
          >
            Trend intensity
          </span>
          <div
            className="h-[3px] w-20 rounded-full overflow-hidden"
            style={{ backgroundColor: "var(--border)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${trend.volume_score}%`,
                backgroundColor: "#E8453C",
              }}
            />
          </div>
          <span
            className="text-[11px] tabular-nums"
            style={{ color: "var(--text-hint)" }}
          >
            {trend.volume_score}
          </span>
        </div>
      </div>
    </div>
  );
}
