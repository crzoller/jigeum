import { Trend } from "@/lib/mock-data";
import Sparkline from "./Sparkline";

type Props = {
  trend: Trend;
};

export default function TrendRow({ trend }: Props) {
  return (
    <div
      className="flex items-center gap-4 px-4 py-3 transition-colors duration-150"
      style={{ borderBottom: "0.5px solid var(--border)" }}
    >
      {/* Rank */}
      <span
        className="text-[13px] font-semibold tabular-nums w-5 shrink-0 text-right"
        style={{ color: "var(--text-hint)" }}
      >
        {trend.rank}
      </span>

      {/* Names */}
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span
          className="text-[16px] font-medium leading-tight truncate"
          style={{
            fontFamily: "var(--font-noto-serif-kr), 'Noto Serif KR', serif",
            color: "#F0EDE6",
          }}
        >
          {trend.korean_name}
        </span>
        <span
          className="text-[12px] truncate"
          style={{ color: "var(--text-secondary)" }}
        >
          {trend.english_name}
        </span>
      </div>

      {/* Right side: sparkline + days */}
      <div className="flex items-center gap-3 shrink-0">
        <Sparkline values={trend.snapshots} height={16} />
        <span
          className="text-[11px] tabular-nums w-12 text-right"
          style={{ color: "var(--text-muted)" }}
        >
          {trend.days_trending}d
        </span>
      </div>
    </div>
  );
}
