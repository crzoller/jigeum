"use client";

import { useState } from "react";
import { Trend } from "@/lib/mock-data";
import TrendMedia from "./TrendMedia";
import TrendLinks from "./TrendLinks";

type Props = {
  trend: Trend;
};

export default function TrendCard({ trend }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-xl flex flex-col overflow-hidden cursor-pointer transition-colors duration-150"
      style={{
        backgroundColor: "#111111",
        border: "0.5px solid var(--border)",
      }}
      onClick={() => setExpanded((e) => !e)}
    >
      {/* Thumbnail */}
      {trend.image_url && (
        <div
          className="w-full overflow-hidden"
          style={{ aspectRatio: "16/9", backgroundColor: "#161616" }}
        >
          <img
            src={trend.image_url}
            alt={trend.korean_name}
            className="w-full h-full object-cover"
            style={{ opacity: 0.85 }}
          />
        </div>
      )}

      <div className="p-4 flex flex-col gap-3">
        {/* Rank + category */}
        <div className="flex items-center justify-between">
          <span
            className="text-[11px] font-semibold tracking-widest uppercase"
            style={{ color: "#E8453C", letterSpacing: "0.10em" }}
          >
            #1 {trend.category}
          </span>
          <span className="text-[11px]" style={{ color: "var(--text-hint)" }}>
            {expanded ? "↑" : "↓"}
          </span>
        </div>

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

        {/* Expanded content */}
        {expanded && (
          <div
            className="flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <TrendMedia
              youtubeVideoId={trend.youtube_video_id}
              imageUrl={trend.image_url}
              title={trend.korean_name}
            />
            <p
              className="text-[12px] leading-relaxed"
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
    </div>
  );
}
