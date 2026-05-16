"use client";

import { useState } from "react";
import { Trend } from "@/lib/mock-data";
import TrendMedia from "./TrendMedia";
import TrendLinks from "./TrendLinks";

type Props = {
  trend: Trend;
  label?: string;
  initialExpanded?: boolean;
};

function Chevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{
        transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.2s ease",
        color: "var(--text-hint)",
      }}
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HeroCard({ trend, label, initialExpanded = false }: Props) {
  const [expanded, setExpanded] = useState(initialExpanded);

  return (
    <div
      className="w-full rounded-xl overflow-hidden cursor-pointer"
      style={{
        backgroundColor: "#111111",
        border: "0.5px solid var(--border)",
      }}
      onClick={() => setExpanded((e) => !e)}
    >
      {/* Thumbnail — only when collapsed */}
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
        {/* Label + subcategory pill */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-[11px] font-semibold tracking-widest uppercase"
            style={{ color: "#E8453C", letterSpacing: "0.12em" }}
          >
            {label ?? "#1 Trending"}
          </span>
          {trend.subcategory && (
            <span
              className="px-2 py-0.5 rounded-full text-[11px] font-medium"
              style={{
                background: "var(--accent-muted)",
                color: "var(--text-secondary)",
              }}
            >
              {trend.subcategory}
            </span>
          )}
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
            <TrendMedia
              youtubeVideoId={trend.youtube_video_id}
              imageUrl={trend.image_url}
              title={trend.korean_name}
            />
            <p
              className="text-[14px] leading-relaxed"
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

        {/* Chevron at bottom center */}
        <div className="flex justify-center pt-3">
          <Chevron expanded={expanded} />
        </div>
      </div>
    </div>
  );
}
