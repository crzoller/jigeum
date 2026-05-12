"use client";

import { useState } from "react";
import { Trend, CATEGORIES } from "@/lib/mock-data";
import CategoryTabs from "./CategoryTabs";
import HeroCard from "./HeroCard";
import TrendGrid from "./TrendGrid";
import TrendRow from "./TrendRow";

type Props = {
  trends: Trend[];
};

function filterTrends(trends: Trend[], category: string): Trend[] {
  if (category === "All") return trends;
  return trends.filter((t) => t.category === category);
}

export default function TrendFeed({ trends }: Props) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = filterTrends(trends, activeCategory);
  const hero = filtered[0] ?? null;
  const grid = filtered.slice(1, 5);
  const rows = filtered.slice(5);

  return (
    <div>
      <CategoryTabs active={activeCategory} onChange={setActiveCategory} />

      <main className="px-4 py-5 flex flex-col gap-5 max-w-lg mx-auto">
        {!hero && (
          <p
            className="text-center py-16 text-[14px]"
            style={{ color: "var(--text-muted)" }}
          >
            No trends in this category yet.
          </p>
        )}

        {hero && <HeroCard trend={hero} />}

        {grid.length > 0 && <TrendGrid trends={grid} />}

        {rows.length > 0 && (
          <div
            className="rounded-xl overflow-hidden"
            style={{
              backgroundColor: "#111111",
              border: "0.5px solid var(--border)",
            }}
          >
            <div
              className="px-4 py-2"
              style={{ borderBottom: "0.5px solid var(--border)" }}
            >
              <span
                className="text-[10px] font-semibold tracking-widest uppercase"
                style={{ color: "var(--text-hint)", letterSpacing: "0.12em" }}
              >
                Also trending
              </span>
            </div>
            {rows.map((trend) => (
              <TrendRow key={trend.id} trend={trend} />
            ))}
          </div>
        )}

        <p
          className="text-center text-[11px] pb-4"
          style={{ color: "var(--text-hint)" }}
        >
          지금 한국에서 인기있는
        </p>
      </main>
    </div>
  );
}
