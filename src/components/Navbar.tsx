"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCampus } from "@/context/CampusContext";
import {
  Search,
  Plus,
  MessageSquare,
  Bell,
  ChevronDown,
  Leaf,
  ShieldCheck,
  LogOut,
  LayoutGrid,
  BookOpen,
  Package,
  Cpu,
  Bike,
  Gift,
  FlaskConical,
  Shirt,
  Dumbbell,
  Home,
  Wrench,
  X,
  UserCircle,
  TrendingUp,
  Settings,
  Check,
} from "lucide-react";
import { CATEGORIES, CAMPUS_STATS } from "@/lib/mockData";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "cat-1": BookOpen,
  "cat-2": BookOpen,
  "cat-3": FlaskConical,
  "cat-4": Cpu,
  "cat-5": Shirt,
  "cat-6": Dumbbell,
  "cat-7": Home,
  "cat-8": Wrench,
  "cat-9": Gift,
};

const TOP_CATS = [
  { id: null, label: "All", icon: LayoutGrid },
  { id: "cat-1", label: "Notes & Study", icon: BookOpen },
  { id: "cat-2", label: "Textbooks", icon: BookOpen },
  { id: "cat-3", label: "Lab Gear", icon: FlaskConical },
  { id: "cat-4", label: "Electronics", icon: Cpu },
  { id: "cat-5", label: "Clothing", icon: Shirt },
  { id: "cat-6", label: "Sports", icon: Dumbbell },
  { id: "cat-7", label: "Hostel Essentials", icon: Home },
  { id: "cat-8", label: "Project Tools", icon: Wrench },
  { id: "cat-9", label: "Free Giveaways", icon: Gift },
];

export default function Navbar({ onOpenAddModal }: { onOpenAddModal: () => void }) {
  const {
    currentUser,
    switchUser,
    users,
    notifications,
    markNotificationRead,
    searchQuery,
    setSearchQuery,
    setActiveTab,
    selectedCategory,
    setSelectedCategory,
    setTransactionFilter,
    openAuthModal,
    logoutStudent,
  } = useCampus();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserSwitch, setShowUserSwitch] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
        setShowUserSwitch(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleCategoryClick = (catId: string | null) => {
    setSelectedCategory(catId);
    setTransactionFilter("all");
    setActiveTab("explore");
  };

  return (
    <header className="ce-header">
      {/* ── Main nav row ── */}
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">

        {/* Logo */}
        <button
          onClick={() => { setActiveTab("home"); setSelectedCategory(null); }}
          className="flex items-center gap-2 shrink-0 cursor-pointer group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0f766e] shadow-sm group-hover:bg-[#0d6460] transition-colors">
            <Leaf className="h-4.5 w-4.5 text-white" style={{ width: 18, height: 18 }} />
          </div>
          <div className="hidden sm:block">
            <span className="text-base font-800 text-slate-900 font-extrabold leading-none">
              Campus<span className="text-[#0f766e]">Exchange</span>
            </span>
          </div>
        </button>

        {/* Search bar — center */}
        <div className="flex-1 max-w-xl mx-auto">
          <div className={`ce-search ${searchFocused ? "shadow-sm" : ""}`}>
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); if (e.target.value) setActiveTab("explore"); }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search textbooks, lab coats, calculators, cycle…"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="shrink-0 text-slate-400 hover:text-slate-700 transition-colors">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* + Post */}
          <button
            onClick={onOpenAddModal}
            className="ce-btn-primary hidden sm:flex text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Post Item</span>
          </button>

          {/* Messages */}
          <button
            onClick={() => setActiveTab("requests")}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <MessageSquare className="h-4 w-4 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setShowNotifMenu(!showNotifMenu); setShowUserMenu(false); }}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Bell className="h-4 w-4 text-slate-600" />
              {unreadCount > 0 && <span className="notif-dot" />}
            </button>

            {showNotifMenu && (
              <div className="ce-dropdown fade-in-up" style={{ minWidth: 320 }}>
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <span className="text-sm font-700 text-slate-900 font-bold">Notifications</span>
                  <button
                    className="text-xs text-teal-600 font-semibold hover:underline"
                    onClick={() => notifications.forEach((n) => !n.isRead && markNotificationRead(n.id))}
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 && (
                    <p className="text-center py-6 text-sm text-slate-400">No notifications yet</p>
                  )}
                  {notifications.slice(0, 8).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => { markNotificationRead(n.id); if (n.linkTab) setActiveTab(n.linkTab); setShowNotifMenu(false); }}
                      className={`ce-dropdown-item border-b border-slate-50 last:border-0 cursor-pointer ${!n.isRead ? "bg-teal-50/50" : ""}`}
                    >
                      {!n.isRead && <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0 mt-0.5" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-slate-800 leading-tight truncate">{n.title}</p>
                        <p className="text-[12px] text-slate-500 truncate">{n.message}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{n.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile avatar */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifMenu(false); setShowUserSwitch(false); }}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white pl-1 pr-2.5 py-1 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-7 w-7 rounded-full object-cover ring-1 ring-teal-400/30"
              />
              <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
            </button>

            {showUserMenu && (
              <div className="ce-dropdown fade-in-up" style={{ minWidth: 260 }}>
                {/* User info */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <img src={currentUser.avatar} className="h-9 w-9 rounded-full object-cover" alt="" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {currentUser.isVerified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded-md">
                            <ShieldCheck className="h-2.5 w-2.5" /> Verified
                          </span>
                        )}
                        <span className="text-[10px] text-amber-600 font-semibold">
                          ★ {currentUser.trustScore}% Trust
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nav links */}
                <div className="py-1">
                  {[
                    { label: "My Listings", icon: Package, tab: "explore" },
                    { label: "Borrowed Items", icon: BookOpen, tab: "rentals" },
                    { label: "Saved Items", icon: Leaf, tab: "explore" },
                    { label: "GreenScore & Eco", icon: TrendingUp, tab: "greenscore" },
                    { label: "Trust Passport", icon: ShieldCheck, tab: "passport" },
                    { label: "Settings", icon: Settings, tab: "home" },
                  ].map((item) => (
                    <button
                      key={item.tab + item.label}
                      onClick={() => { setActiveTab(item.tab); setShowUserMenu(false); }}
                      className="ce-dropdown-item w-full text-left"
                    >
                      <item.icon className="h-4 w-4 text-slate-400" />
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Demo user switcher */}
                <div className="border-t border-slate-100 py-1">
                  <button
                    onClick={() => setShowUserSwitch(!showUserSwitch)}
                    className="ce-dropdown-item w-full text-left text-teal-700"
                  >
                    <UserCircle className="h-4 w-4" />
                    Switch Demo Account
                    <ChevronDown className={`h-3.5 w-3.5 ml-auto transition-transform ${showUserSwitch ? "rotate-180" : ""}`} />
                  </button>
                  {showUserSwitch && (
                    <div className="px-2 pb-1">
                      {users.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => { switchUser(u.id); setShowUserMenu(false); setShowUserSwitch(false); }}
                          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm hover:bg-slate-50 transition-colors"
                        >
                          <img src={u.avatar} className="h-7 w-7 rounded-full object-cover" alt="" />
                          <div className="text-left min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate">{u.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{u.course.split(" ")[0]}</p>
                          </div>
                          {currentUser.id === u.id && (
                            <Check className="h-3.5 w-3.5 text-teal-500 ml-auto shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Logout */}
                <div className="border-t border-slate-100 py-1">
                  <button
                    onClick={() => { logoutStudent(); setShowUserMenu(false); }}
                    className="ce-dropdown-item w-full text-left text-red-500 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Category pill bar ── */}
      <div className="border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-2.5">
            {TOP_CATS.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={String(cat.id)}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`ce-pill ${isActive ? "active" : ""}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
