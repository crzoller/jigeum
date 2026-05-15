"use client";

import { useState } from "react";
import { Trend } from "@/lib/mock-data";
import Sparkline from "./Sparkline";
import TrendMedia from "./TrendMedia";
import TrendLinks from "./TrendLinks";

type Props = {
  trend: Trend;
};

export default function TrendRow({ trend }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="cursor-pointer transition-colors duration-150"
      style={{ borderBottom: "0.5px solid var(--border)" }}
      onClick={() => setExpanded((e) => !e)}
    >
      {/* Main row */}
      <div className="flex items-center gap-4 px-4 py-3">
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

        {/* Right: sparkline + days + chevron */}
        <div className="flex items-center gap-3 shrink-0">
          <Sparkline values={trend.snapshots} height={16} />
          <span
            className="text-[11px] tabular-nums w-8 text-right"
            style={{ color: "var(--text-muted)" }}
          >
            {trend.days_trending}d
          </span>
          <span
            className="text-[11px] w-3"
            style={{ color: "var(--text-hint)" }}
          >
            {expanded ? "↑" : "↓"}
          </span>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div
          className="px-4 pb-4 flex flex-col gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          <TrendMedia
            youtubeVideoId={trend.youtube_video_id}
            imageUrl={trend.image_url}
            title={trend.korean_name}
          />
          <p
            className="text-[13px] leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {trend.description}
          </p>
          <TrendLinks
            koreanName={trend.korean_name}
            englishName={trend.english_name}
          />
        </div>
      )}
    </div>
  );
}
