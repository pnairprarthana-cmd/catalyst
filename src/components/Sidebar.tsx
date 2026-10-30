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
  Users,
  MapPin,
  TrendingUp,
  UserCheck,
  Star,
  ArrowUpRight,
} from "lucide-react";
import { CAMPUS_STATS } from "@/lib/mockData";

const NAV_SECTIONS = [
  {
    title: "Discover",
    items: [
      { id: "home", label: "Home Feed", icon: Home },
      { id: "explore", label: "Marketplace", icon: Compass },
      { id: "requests", label: "Need It? Post It!", icon: HelpCircle },
    ],
  },
  {
    title: "My Activity",
    items: [
      { id: "rentals", label: "Rentals & Borrows", icon: CalendarCheck2 },
      { id: "group-rentals", label: "Group Rentals", icon: Users },
      { id: "exchange", label: "Smart Exchange", icon: TrendingUp },
      { id: "giveback", label: "Giveback Corner", icon: Gift },
    ],
  },
  {
    title: "Campus",
    items: [
      { id: "pickups", label: "Pickup Hubs", icon: MapPin },
      { id: "greenscore", label: "GreenScore", icon: Leaf },
      { id: "passport", label: "Trust Passport", icon: ShieldCheck },
      { id: "events", label: "Campus Events", icon: Star },
    ],
  },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, currentUser, rentals, setTransactionFilter } = useCampus();

  const activeRentalsCount = rentals.filter(
    (r) => r.status === "active" || r.status === "confirmed"
  ).length;

  return (
    <aside className="ce-sidebar hidden lg:flex w-56 flex-col shrink-0 min-h-[calc(100vh-7rem)]">
      <div className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="mb-1">
            <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {section.title}
            </p>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                activeTab === item.id ||
                (item.id === "explore" && activeTab === "explore");
              const badge =
                item.id === "rentals" && activeRentalsCount > 0
                  ? String(activeRentalsCount)
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
                      ? "bg-teal-50 text-teal-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4 w-4 ${
                        isActive ? "text-teal-600" : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {badge && (
                    <span className="flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-teal-500 px-1 text-[10px] font-bold text-white">
                      {badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-500 ml-auto" />
                  )}
                </button>
              );
            })}
          </div>
        ))}

        {currentUser.role === "admin" && (
          <div className="mb-1">
            <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Admin
            </p>
            <button
              onClick={() => setActiveTab("admin")}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-all cursor-pointer ${
                activeTab === "admin"
                  ? "bg-amber-50 text-amber-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <UserCheck className="h-4 w-4 text-amber-500" />
              Admin Panel
              <span className="ml-auto text-[10px] font-bold bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full">
                Admin
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Campus impact mini card */}
      <div className="p-3 pb-4">
        <div className="rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Leaf className="h-3.5 w-3.5 text-teal-600" />
            <span className="text-[11px] font-bold text-teal-700">Campus Impact</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">CO₂ Avoided</span>
              <span className="font-bold text-teal-700">{CAMPUS_STATS.co2AvoidedKg} kg</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Items Shared</span>
              <span className="font-bold text-slate-700">{CAMPUS_STATS.totalItemsReused}+</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Students</span>
              <span className="font-bold text-slate-700">{CAMPUS_STATS.activeStudents}</span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("greenscore")}
            className="mt-2.5 flex w-full items-center justify-center gap-1 rounded-lg bg-teal-600 py-1.5 text-[11px] font-bold text-white hover:bg-teal-700 transition-colors"
          >
            View GreenScore <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>

        {/* User compact profile */}
        <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-2.5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="h-8 w-8 rounded-full object-cover ring-2 ring-teal-200"
          />
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-slate-900 truncate">{currentUser.name.split(" ")[0]}</p>
            <p className="text-[10px] text-slate-500 truncate">{currentUser.greenScore} pts • {currentUser.trustScore}% Trust</p>
          </div>
          {currentUser.isVerified && (
            <ShieldCheck className="h-3.5 w-3.5 text-teal-500 ml-auto shrink-0" />
          )}
        </div>
      </div>
    </aside>
  );
}
