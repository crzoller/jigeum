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

const CATEGORY_ORDER = ["Music", "Food", "Fashion", "Entertainment", "Memes", "Lifestyle"];

/** All tab: one best trend per category, sorted by global rank so the hero is the strongest overall */
function getCategoryChampions(trends: Trend[]): Trend[] {
  const byCategory: Record<string, Trend> = {};
  for (const trend of trends) {
    if (!byCategory[trend.category]) {
      byCategory[trend.category] = trend; // trends are already sorted by rank from DB
    }
  }
  return CATEGORY_ORDER
    .filter((cat) => byCategory[cat])
    .map((cat) => byCategory[cat])
    .sort((a, b) => a.rank - b.rank);
}

/** Category tab: top 5 in the category, renumbered #1–#5 */
function getCategoryTop5(trends: Trend[], category: string): Trend[] {
  return trends
    .filter((t) => t.category === category)
    .slice(0, 5)
    .map((t, i) => ({ ...t, rank: i + 1 }));
}

export default function TrendFeed({ trends }: Props) {
  const [activeCategory, setActiveCategory] = useState("All");

  const displayTrends =
    activeCategory === "All"
      ? getCategoryChampions(trends)
      : getCategoryTop5(trends, activeCategory);

  const isAll = activeCategory === "All";
  const hero = displayTrends[0] ?? null;
  const rest = displayTrends.slice(1);

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

        {hero && (
          <HeroCard
            key={`${activeCategory}-hero`}
            trend={hero}
            label={`#1 ${hero.category}`}
            initialExpanded={!isAll}
            alwaysExpanded={isAll}
          />
        )}

        {/* All tab: side-by-side category champion cards */}
        {isAll && rest.length > 0 && <TrendGrid trends={rest} />}

        {/* Category tab: stacked expandable rows */}
        {!isAll && rest.length > 0 && (
          <div
            className="rounded-xl overflow-hidden"
            style={{
              backgroundColor: "#111111",
              border: "0.5px solid var(--border)",
            }}
          >
            {rest.map((trend) => (
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
