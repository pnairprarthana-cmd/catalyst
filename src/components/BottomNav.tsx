"use client";

import React from "react";
import { useCampus } from "@/context/CampusContext";
import { Home, Compass, HelpCircle, CalendarCheck, Leaf, Plus } from "lucide-react";

const NAVS = [
  { id: "home", label: "Home", icon: Home },
  { id: "explore", label: "Explore", icon: Compass },
  { id: "requests", label: "Requests", icon: HelpCircle },
  { id: "rentals", label: "Rentals", icon: CalendarCheck },
  { id: "greenscore", label: "Eco", icon: Leaf },
];

export default function BottomNav({ onOpenAddModal }: { onOpenAddModal?: () => void }) {
  const { activeTab, setActiveTab, rentals } = useCampus();

  const activeRentalsCount = rentals.filter(
    (r) => r.status === "active" || r.status === "confirmed"
  ).length;

  return (
    <nav className="ce-bottom-nav lg:hidden">
      <div className="mx-auto flex w-full max-w-md items-center justify-around">
        {NAVS.slice(0, 2).map((nav) => {
          const Icon = nav.icon;
          const isActive = activeTab === nav.id;
          return (
            <button
              key={nav.id}
              onClick={() => setActiveTab(nav.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 text-[10px] font-semibold rounded-xl transition-colors cursor-pointer ${
                isActive ? "text-teal-700" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <div className={`relative ${isActive ? "text-teal-600" : ""}`}>
                <Icon className="h-5 w-5" />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-teal-500" />
                )}
              </div>
              <span>{nav.label}</span>
            </button>
          );
        })}

        {/* Center FAB */}
        <button
          onClick={onOpenAddModal}
          className="flex flex-col items-center gap-0.5 -mt-4"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0f766e] shadow-lg shadow-teal-500/30 hover:bg-teal-700 transition-colors">
            <Plus className="h-5 w-5 text-white" />
          </div>
          <span className="text-[10px] font-semibold text-teal-700">Post</span>
        </button>

        {NAVS.slice(2).map((nav) => {
          const Icon = nav.icon;
          const isActive = activeTab === nav.id;
          const badge = nav.id === "rentals" && activeRentalsCount > 0 ? activeRentalsCount : null;
          return (
            <button
              key={nav.id}
              onClick={() => setActiveTab(nav.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 text-[10px] font-semibold rounded-xl transition-colors cursor-pointer ${
                isActive ? "text-teal-700" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <div className={`relative ${isActive ? "text-teal-600" : ""}`}>
                <Icon className="h-5 w-5" />
                {badge && (
                  <span className="absolute -top-1 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-teal-500 text-[9px] font-bold text-white">
                    {badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-teal-500" />
                )}
              </div>
              <span>{nav.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
