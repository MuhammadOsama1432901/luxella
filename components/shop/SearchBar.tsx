"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  return (
    <div className="w-full">
      <div className="relative">
        {/* Search Icon */}
        <Search
          size={18}
          className="absolute left-5 top-1/2 -translate-y-1/2"
          style={{ color: "#C8A96A" }}
        />

        {/* Input */}
        <input
          type="text"
          placeholder="Search necklaces, earrings, rings..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            h-14
            w-full
            rounded-full
            border
            pl-14
            pr-12
            text-sm
            shadow-xl
            transition-all
            duration-300
            outline-none
          "
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            borderColor: "rgba(200, 169, 106, 0.2)",
            color: "var(--text-primary)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#C8A96A";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(200, 169, 106, 0.15)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(200, 169, 106, 0.2)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />

        {/* Clear Button */}
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full p-1.5 transition duration-200"
            style={{ color: "var(--text-secondary)", background: "rgba(255, 255, 255, 0.08)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)")}
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}