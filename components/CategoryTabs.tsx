"use client";

import { CATEGORIES } from "@/lib/mock-data";

type Props = {
  active: string;
  onChange: (cat: string) => void;
};

export default function CategoryTabs({ active, onChange }: Props) {
  return (
    <div
      className="w-full overflow-x-auto"
      style={{ borderBottom: "0.5px solid var(--border)" }}
    >
      <div className="flex gap-0 px-4 min-w-max">
        {CATEGORIES.map((cat) => {
          const isActive = cat === active;
          return (
            <button
              key={cat}
              onClick={() => onChange(cat)}
              className="relative px-4 py-3 text-[13px] font-medium whitespace-nowrap transition-colors duration-150"
              style={{
                color: isActive ? "#F0EDE6" : "var(--text-muted)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {cat}
              {isActive && (
                <span
                  className="absolute bottom-0 left-4 right-4 h-[1.5px] rounded-full"
                  style={{ backgroundColor: "#E8453C" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
