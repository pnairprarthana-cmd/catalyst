"use client";

import React from "react";
import { useCampus } from "@/context/CampusContext";
import {
  Home,
  Compass,
  CalendarCheck2,
  Gift,
  Leaf,
  ShieldCheck,
  HelpCircle,
  MapPin,
  Sparkles,
  ArrowRight,
  UserCheck,
  Wallet,
  Award,
} from "lucide-react";
import { CAMPUS_STATS } from "@/lib/mockData";

// Simplified, student-friendly navigation sections
const NAV_SECTIONS = [
  {
    title: "Store & Marketplace",
    items: [
      { id: "home", label: "Home", icon: Home },
      { id: "explore", label: "Campus Store", icon: Compass },
      { id: "requests", label: "Student Requests", icon: HelpCircle },
    ],
  },
  {
    title: "My Activity",
    items: [
      { id: "earnings", label: "My Earnings & Wallet", icon: Wallet },
      { id: "rentals", label: "My Borrows & Rentals", icon: CalendarCheck2 },
      { id: "pickups", label: "Campus Pickup Spots", icon: MapPin },
    ],
  },
  {
    title: "Community & Eco",
    items: [
      { id: "greenscore", label: "Eco Impact & Points", icon: Leaf },
      { id: "karma-guidelines", label: "Karma & Eco Policy", icon: Award },
      { id: "passport", label: "Verified Student ID", icon: ShieldCheck },
    ],
  },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, currentUser, rentals, setTransactionFilter, availableEarnings } = useCampus();

  const activeRentalsCount = rentals.filter(
    (r) => r.status === "active" || r.status === "confirmed"
  ).length;

  return (
    <aside className="ce-sidebar hidden lg:flex w-56 flex-col shrink-0 min-h-[calc(100vh-7rem)] border-r border-pink-100 bg-white">
      <div className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="mb-3">
            <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {section.title}
            </p>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const badge =
                item.id === "rentals" && activeRentalsCount > 0
                  ? String(activeRentalsCount)
                  : item.id === "earnings"
                  ? `₹${availableEarnings.toLocaleString("en-IN")}`
                  : null;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === "explore") setTransactionFilter("all");
                    setActiveTab(item.id);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-[13px] font-medium transition-all cursor-pointer group ${
                    isActive
                      ? "bg-pink-50 text-pink-700 font-semibold border-r-2 border-pink-500"
                      : "text-slate-600 hover:bg-pink-50/50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4 w-4 ${
                        isActive ? "text-pink-600" : "text-slate-400 group-hover:text-pink-500"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {badge && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#fde047] border border-[#fef08a] px-1 text-[11px] font-bold text-[#78350f]">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}

        {/* Admin Link if Admin */}
        {currentUser.role === "admin" && (
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => setActiveTab("admin")}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-all ${
                activeTab === "admin"
                  ? "bg-amber-50 text-amber-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <UserCheck className="h-4 w-4 text-amber-500" />
              <span>Campus Admin</span>
            </button>
          </div>
        )}
      </div>

      {/* Simple Campus Impact Card */}
      <div className="p-3 border-t border-pink-100 bg-pink-50/30">
        <div className="rounded-xl border border-pink-200/80 bg-white p-3 shadow-xs">
          <div className="flex items-center gap-1.5 mb-2">
            <Leaf className="h-3.5 w-3.5 text-pink-600" />
            <span className="text-[11px] font-bold text-pink-900">Campus Impact</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-pink-50 p-1.5 rounded-lg border border-pink-100">
              <p className="font-extrabold text-pink-700">{CAMPUS_STATS.totalItemsReused}+</p>
              <p className="text-[10px] text-slate-500">Items Shared</p>
            </div>
            <div className="bg-yellow-50 p-1.5 rounded-lg border border-yellow-200/60">
              <p className="font-extrabold text-amber-800">{CAMPUS_STATS.studentMoneySaved}</p>
              <p className="text-[10px] text-slate-500">Saved</p>
            </div>
          </div>
        </div>

        {/* Compact User Info */}
        <div className="mt-2.5 flex items-center gap-2 p-1.5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold text-slate-800 truncate">{currentUser.name}</p>
            <p className="text-[10px] text-slate-400 truncate">Verified Student</p>
          </div>
          <ShieldCheck className="h-3.5 w-3.5 text-teal-500 shrink-0" />
        </div>
      </div>
    </aside>
  );
}
