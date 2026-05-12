import { Trend } from "@/lib/mock-data";
import DaysBadge from "./DaysBadge";

type Props = {
  trend: Trend;
};

export default function TrendCard({ trend }: Props) {
  return (
    <div
      className="p-4 rounded-xl flex flex-col gap-3 transition-colors duration-150"
      style={{
        backgroundColor: "#111111",
        border: "0.5px solid var(--border)",
      }}
    >
      {/* Rank */}
      <span
        className="text-[11px] font-semibold tabular-nums"
        style={{ color: "#E8453C" }}
      >
        #{trend.rank}
      </span>

      {/* Names */}
      <div className="flex flex-col gap-0.5">
        <h3
          className="text-[20px] font-semibold leading-tight"
          style={{
            fontFamily: "var(--font-noto-serif-kr), 'Noto Serif KR', serif",
            color: "#F0EDE6",
          }}
        >
          {trend.korean_name}
        </h3>
        <p
          className="text-[12px] leading-snug"
          style={{ color: "var(--text-secondary)" }}
        >
          {trend.english_name}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto">
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-medium"
          style={{
            background: "rgba(255,255,255,0.06)",
            color: "var(--text-muted)",
          }}
        >
          {trend.category}
        </span>
        <DaysBadge days={trend.days_trending} size="sm" />
      </div>
    </div>
  );
}
