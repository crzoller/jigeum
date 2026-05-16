"use client";

import { useState } from "react";
import { Trend } from "@/lib/mock-data";
import TrendMedia from "./TrendMedia";
import TrendLinks from "./TrendLinks";

type Props = {
  trend: Trend;
  label?: string;
};

export default function HeroCard({ trend, label }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="w-full rounded-xl overflow-hidden cursor-pointer"
      style={{
        backgroundColor: "#111111",
        border: "0.5px solid var(--border)",
      }}
      onClick={() => setExpanded((e) => !e)}
    >
      {/* Thumbnail — always visible */}
      {trend.image_url && !expanded && (
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

      <div className="p-5">
        {/* Rank + category */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-[11px] font-semibold tracking-widest uppercase"
            style={{ color: "#E8453C", letterSpacing: "0.12em" }}
          >
            {label ?? "#1 Trending"}
          </span>
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-0.5 rounded-full text-[11px] font-medium"
              style={{
                background: "var(--accent-muted)",
                color: "var(--text-secondary)",
              }}
            >
              {trend.subcategory}
            </span>
            <span
              className="text-[11px]"
              style={{ color: "var(--text-hint)" }}
            >
              {expanded ? "↑" : "↓"}
            </span>
          </div>
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

        {/* Expanded content */}
        {expanded && (
          <div
            className="flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video / image */}
            <TrendMedia
              youtubeVideoId={trend.youtube_video_id}
              imageUrl={trend.image_url}
              title={trend.korean_name}
            />

            {/* Description */}
            <p
              className="text-[14px] leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              {trend.description}
            </p>

            {/* Links */}
            <TrendLinks
              koreanName={trend.korean_name}
              englishName={trend.english_name}
            />
          </div>
        )}

        {/* Footer row */}
        <div className="flex items-center justify-end mt-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px]" style={{ color: "var(--text-hint)" }}>
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
    </div>
  );
}
