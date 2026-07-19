"use client";

import { SlidersHorizontal, ArrowUpDown, X } from "lucide-react";

interface ActiveFilterItem {
  key: string;
  label: string;
  displayValue: string;
}

interface FilterBarProps {
  activeFilters: ActiveFilterItem[];
  onRemoveFilter: (key: string) => void;
  onClearAll: () => void;
  onOpenDrawer: () => void;
  sort: string;
  setSort: (value: string) => void;
}

const sortOptions = [
  "Featured",
  "Newest",
  "Best Selling",
  "Price Low → High",
  "Price High → Low",
  "Highest Rated",
  "Most Popular"
];

export default function FilterBar({
  activeFilters,
  onRemoveFilter,
  onClearAll,
  onOpenDrawer,
  sort,
  setSort,
}: FilterBarProps) {
  return (
    <div className="space-y-4 mb-8">
      <div
        className="flex items-center justify-between rounded-3xl p-5 border shadow-xl flex-wrap gap-4"
        style={{
          background: "var(--bg-elevated)",
          borderColor: "rgba(200, 169, 106, 0.12)",
        }}
      >
        {/* Left Side: Filter Action Button */}
        <button
          onClick={onOpenDrawer}
          className="flex items-center gap-2 px-6 py-3.5 rounded-full border text-xs font-bold uppercase tracking-widest text-[#C8A96A] hover:text-white transition-all duration-300 cursor-pointer shadow-md bg-white/[0.02]"
          style={{ borderColor: "rgba(200,169,106,0.3)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#C8A96A";
            e.currentTarget.style.background = "rgba(200,169,106,0.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(200,169,106,0.3)";
            e.currentTarget.style.background = "rgba(200,169,106,0.02)";
          }}
        >
          <SlidersHorizontal size={14} />
          <span>Filters</span>
          {activeFilters.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#C8A96A] text-[#111] font-bold text-[10px] flex items-center justify-center">
              {activeFilters.length}
            </span>
          )}
        </button>

        {/* Right Side: Sorting */}
        <div className="flex items-center gap-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
            <ArrowUpDown size={12} className="text-[#C8A96A]" /> Sort
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border px-5 py-3 text-xs font-bold uppercase tracking-wider outline-none transition-all duration-300 cursor-pointer text-white"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              borderColor: "rgba(200, 169, 106, 0.15)",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#C8A96A")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(200, 169, 106, 0.15)")}
          >
            {sortOptions.map((opt) => (
              <option key={opt} value={opt} style={{ background: "#121212" }}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filter Tags */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mr-1">
            Active Filters:
          </span>
          {activeFilters.map((filter) => (
            <div
              key={filter.key}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C8A96A]/20 bg-[#C8A96A]/5 text-[10px] font-bold text-[#C8A96A] uppercase tracking-wider"
            >
              <span>
                {filter.label}: {filter.displayValue}
              </span>
              <button
                onClick={() => onRemoveFilter(filter.key)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                <X size={10} />
              </button>
            </div>
          ))}

          <button
            onClick={onClearAll}
            className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors ml-2 cursor-pointer underline underline-offset-4"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}