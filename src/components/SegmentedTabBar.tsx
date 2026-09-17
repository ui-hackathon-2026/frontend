"use client";

import React, { useState } from "react";

export interface TabItem {
  id: string;
  label: string;
  badge?: string;
}

interface SegmentedTabBarProps {
  tabs?: TabItem[];
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

const DEFAULT_TABS: TabItem[] = [
  { id: "bioresearch", label: "Bioresearch" },
  { id: "bioprocess", label: "Bioprocess" },
  { id: "benchling-ai", label: "Benchling AI" },
  { id: "biologics", label: "Biologics" },
  { id: "in-vivo", label: "In Vivo" },
  { id: "automation", label: "Automation" },
];

export const SegmentedTabBar: React.FC<SegmentedTabBarProps> = ({
  tabs = DEFAULT_TABS,
  defaultTabId,
  onChange,
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState(defaultTabId || tabs[0]?.id);

  const handleSelect = (id: string) => {
    setActiveTab(id);
    if (onChange) onChange(id);
  };

  return (
    <div className={`w-full overflow-x-auto no-scrollbar py-2 ${className}`}>
      <div className="inline-flex items-center bg-[#dce9fe] p-1.5 rounded-full shadow-2xs border border-[#cbdffc]/80 min-w-max">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleSelect(tab.id)}
              className={`relative flex items-center space-x-2 px-6 py-2.5 rounded-full text-sm sm:text-base transition-all duration-200 focus:outline-none select-none ${
                isActive
                  ? "bg-white text-[#0a192f] font-semibold shadow-xs"
                  : "text-[#1e3a8a]/85 hover:text-[#0a192f] font-medium hover:bg-white/40"
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-200/80 text-blue-900">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
