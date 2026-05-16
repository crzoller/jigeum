"use client";

import { useState } from "react";
import { Trend } from "@/lib/mock-data";
import TrendMedia from "./TrendMedia";
import TrendLinks from "./TrendLinks";

type Props = {
  trend: Trend;
};

function Chevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      style={{
        transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.2s ease",
        color: "var(--text-hint)",
      }}
    >
      <path
        d="M3 5L7 9L11 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
      <div className="p-4 flex flex-col gap-3">
        {/* Rank + category */}
        <span
          className="text-[11px] font-semibold tracking-widest uppercase"
          style={{ color: "#E8453C", letterSpacing: "0.10em" }}
        >
          #1 {trend.category}
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

        {/* Expanded content */}
        {expanded && (
          <div
            className="flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <p
              className="text-[12px] leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              {trend.description}
            </p>
            <TrendMedia
              youtubeVideoId={trend.youtube_video_id}
              imageUrl={trend.image_url}
              title={trend.korean_name}
            />
            <TrendLinks
              koreanName={trend.korean_name}
              englishName={trend.english_name}
            />
          </div>
        )}

        {/* Chevron at bottom center */}
        <div className="flex justify-center pt-1">
          <Chevron expanded={expanded} />
        </div>
      </div>
    </div>
  );
}
