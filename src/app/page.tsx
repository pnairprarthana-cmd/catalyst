"use client";

import React, { useState, useMemo } from "react";
import { CampusProvider, useCampus } from "@/context/CampusContext";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import ListingDetailModal from "@/components/ListingDetailModal";
import AddListingModal from "@/components/AddListingModal";
import RequestBoardView from "@/components/RequestBoardView";
import RentalManagementView from "@/components/RentalManagementView";
import GroupRentalsView from "@/components/GroupRentalsView";
import CampusPickupNetworkView from "@/components/CampusPickupNetworkView";
import GivebackCornerView from "@/components/GivebackCornerView";
import GreenScoreView from "@/components/GreenScoreView";
import CommunityEventsView from "@/components/CommunityEventsView";
import CampusTrustPassportView from "@/components/CampusTrustPassportView";
import AdminDashboardView from "@/components/AdminDashboardView";
import ChatDrawer from "@/components/ChatDrawer";
import { CATEGORIES, CAMPUS_STATS, TESTIMONIALS, CAMPUS_PULSE_ITEMS } from "@/lib/mockData";
import { Listing } from "@/types";
import {
  Sparkles,
  ArrowRight,
  Leaf,
  HandHelping,
  ShoppingBag,
  Search,
  TrendingUp,
  SlidersHorizontal,
  ChevronDown,
  Repeat2,
  BookOpen,
  Star,
  Shield,
  Zap,
  Globe,
  Users,
  MessageSquare,
  BadgeCheck,
  BarChart3,
  Activity,
  Clock,
  ChevronRight,
} from "lucide-react";

// ── Filter tabs definition ───────────────────────────────────────────────────
const FILTER_TABS = [
  { id: "all", label: "All Items" },
  { id: "borrow", label: "Free to Borrow ($0)" },
  { id: "rent", label: "Rentals" },
  { id: "sell", label: "Buy & Sell" },
  { id: "exchange", label: "Smart Exchange" },
  { id: "giveaway", label: "Giveaways" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newly Listed" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "eco", label: "Most Eco-Friendly" },
];

// ── Home View: landing + featured sections ────────────────────────────────────
function HomeView({
  onSelectListing,
  onOpenChat,
  onOpenAddModal,
}: {
  onSelectListing: (l: Listing) => void;
  onOpenChat: (s: string, l?: string) => void;
  onOpenAddModal: () => void;
}) {
  const { listings, requests, currentUser, setActiveTab, setTransactionFilter, setSelectedCategory } = useCampus();

  const freeBorrows = listings.filter((l) => l.transactionType === "borrow").slice(0, 4);
  const trending = listings.filter((l) => l.isFeatured || l.views > 100).slice(0, 8);
  const recommended = listings
    .filter((l) => l.courseRelevant || l.semesterRelevant === currentUser.semester)
    .slice(0, 4);

  return (
    <div className="space-y-10 pb-10">
      {/* ── Hero / Welcome strip ── */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-teal-50 via-white to-emerald-50 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[11px] font-bold text-teal-700 mb-3">
              <BadgeCheck className="h-3.5 w-3.5" />
              Student-only verified platform
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Your Campus Has Everything<br className="hidden sm:block" />
              <span className="text-teal-600"> You Need. Just Exchange It.</span>
            </h1>
            <p className="mt-2 text-sm text-slate-500 max-w-md leading-relaxed">
              Save money by renting, borrowing and exchanging with verified students on your campus. Over {CAMPUS_STATS.totalItemsReused.toLocaleString()} items shared, {CAMPUS_STATS.studentMoneySaved} saved.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <button
                onClick={() => { setTransactionFilter("borrow"); setActiveTab("explore"); }}
                className="ce-btn-primary text-sm"
              >
                <HandHelping className="h-4 w-4" />
                Browse Free Borrows
              </button>
              <button
                onClick={() => { setTransactionFilter("all"); setActiveTab("explore"); }}
                className="ce-btn-outline text-sm"
              >
                <ShoppingBag className="h-4 w-4" />
                Explore Marketplace
              </button>
            </div>
          </div>
          {/* Stats cluster */}
          <div className="flex gap-4 sm:gap-6 shrink-0">
            {[
              { value: `${CAMPUS_STATS.activeStudents}`, label: "Verified Students", icon: Users, color: "text-teal-600" },
              { value: `${CAMPUS_STATS.co2AvoidedKg} kg`, label: "CO₂ Avoided", icon: Leaf, color: "text-emerald-600" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className={`h-5 w-5 ${stat.color} mx-auto mb-1`} />
                <p className="text-xl font-extrabold text-slate-900">{stat.value}</p>
                <p className="text-[10px] text-slate-500 font-medium max-w-[80px] leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── How it works ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="ce-section-title">How CampusExchange Works</h2>
            <p className="ce-section-sub">Three simple steps. Zero confusion.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              step: "1",
              icon: BadgeCheck,
              title: "Verify",
              desc: "Sign up with your college email (.edu or .ac.in). Campus trust passport created instantly.",
              color: "bg-teal-50 text-teal-600 border-teal-100",
            },
            {
              step: "2",
              icon: Search,
              title: "Discover",
              desc: "Browse 9 categories of campus items. Filter by Free Borrows, Rentals, Buy & Sell, or Exchange.",
              color: "bg-blue-50 text-blue-600 border-blue-100",
            },
            {
              step: "3",
              icon: Repeat2,
              title: "Exchange",
              desc: "Book, borrow or swap at a campus safe pickup hub. Earn Eco-Credits for every sustainable action.",
              color: "bg-emerald-50 text-emerald-600 border-emerald-100",
            },
          ].map((s) => (
            <div key={s.step} className="rounded-xl border border-slate-200 bg-white p-5 flex gap-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Step {s.step}</p>
                <h3 className="text-base font-bold text-slate-900 mb-1">{s.title}</h3>
                <p className="text-[12px] text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Campus Pulse ── */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="h-4 w-4 text-teal-600" />
          <h2 className="text-sm font-bold text-slate-900">Campus Pulse</h2>
          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>
        <div className="space-y-2">
          {CAMPUS_PULSE_ITEMS.map((item) => (
            <div key={item.id} className="flex items-start gap-3 text-[12px]">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-600 shrink-0 mt-0.5">
                <Zap className="h-2.5 w-2.5" />
              </span>
              <span className="text-slate-600 flex-1">{item.text}</span>
              <span className="text-slate-400 shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Free Borrows section ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="ce-section-title flex items-center gap-2">
              <HandHelping className="h-5 w-5 text-emerald-600" />
              Free Campus Borrows
            </h2>
            <p className="ce-section-sub">Borrow for free from verified peers. Return when done — no cost.</p>
          </div>
          <button
            onClick={() => { setTransactionFilter("borrow"); setActiveTab("explore"); }}
            className="flex items-center gap-1 text-[12px] font-semibold text-teal-600 hover:text-teal-800 transition-colors"
          >
            View all <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="marketplace-grid">
          {freeBorrows.map((item) => (
            <ProductCard
              key={item.id}
              listing={item}
              onSelect={onSelectListing}
              onOpenChat={(s, l) => onOpenChat(s, l)}
            />
          ))}
        </div>
      </div>

      {/* ── Categories grid ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="ce-section-title">Explore Categories</h2>
            <p className="ce-section-sub">9 categories covering all campus needs</p>
          </div>
          <button
            onClick={() => { setSelectedCategory(null); setActiveTab("explore"); }}
            className="flex items-center gap-1 text-[12px] font-semibold text-teal-600 hover:text-teal-800 transition-colors"
          >
            All categories <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setActiveTab("explore"); }}
              className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-center hover:border-teal-300 hover:bg-teal-50/50 transition-all cursor-pointer"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                style={{ background: cat.color + "20" }}
              >
                {["📚","📖","🔬","💻","👘","🏸","🏠","🔧","🎁"][CATEGORIES.indexOf(cat)] || "📦"}
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-800 leading-tight line-clamp-2">{cat.name.split(" & ")[0]}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{cat.itemCount} items</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Trending near campus ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="ce-section-title flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Trending Near Your Campus
            </h2>
            <p className="ce-section-sub">Popular items listed this week</p>
          </div>
          <button
            onClick={() => setActiveTab("explore")}
            className="flex items-center gap-1 text-[12px] font-semibold text-teal-600 hover:text-teal-800 transition-colors"
          >
            View all <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="marketplace-grid">
          {trending.map((item) => (
            <ProductCard
              key={item.id}
              listing={item}
              onSelect={onSelectListing}
              onOpenChat={(s, l) => onOpenChat(s, l)}
            />
          ))}
        </div>
      </div>

      {/* ── Recommended ── */}
      {recommended.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="ce-section-title flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Matched to Your Course
              </h2>
              <p className="ce-section-sub">Recommended for {currentUser.course} • Semester {currentUser.semester}</p>
            </div>
          </div>
          <div className="marketplace-grid">
            {recommended.map((item) => (
              <ProductCard
                key={item.id}
                listing={item}
                onSelect={onSelectListing}
                onOpenChat={(s, l) => onOpenChat(s, l)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Sustainability Impact ── */}
      <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 p-6 sm:p-8 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA2KSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+')] opacity-60" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-5 w-5 text-white/80" />
            <span className="text-sm font-bold text-white/80 uppercase tracking-wide">Sustainability Dashboard</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
            Together, We're Making an Impact
          </h2>
          <p className="text-white/70 text-sm mb-6 max-w-lg">
            Every borrow, swap and reuse action on CampusExchange contributes to real environmental savings — estimated using lifecycle analysis. These are approximations, not certified measurements.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: `${CAMPUS_STATS.co2AvoidedKg} kg`, label: "CO₂ Avoided (est.)", icon: Leaf },
              { value: CAMPUS_STATS.studentMoneySaved, label: "Student Money Saved", icon: BarChart3 },
              { value: `${CAMPUS_STATS.totalItemsReused}+`, label: "Items Reused", icon: Repeat2 },
              { value: `${CAMPUS_STATS.paperPagesSaved?.toLocaleString() ?? "28,400"}`, label: "Paper Pages Conserved", icon: BookOpen },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center border border-white/10">
                <stat.icon className="h-5 w-5 text-white/70 mx-auto mb-2" />
                <p className="text-xl sm:text-2xl font-extrabold text-white">{stat.value}</p>
                <p className="text-[11px] text-white/60 font-medium mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Testimonials ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="ce-section-title">What Students Say</h2>
            <p className="ce-section-sub">Real stories from verified campus users</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-[13px] text-slate-600 leading-relaxed mb-4 italic">"{t.quote}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src={t.avatar} alt={t.name} className="h-8 w-8 rounded-full object-cover" />
                  <div>
                    <p className="text-[12px] font-bold text-slate-900">{t.name}</p>
                    <p className="text-[10px] text-slate-400">{t.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold text-teal-600">{t.savedAmount}</p>
                  <p className="text-[10px] text-emerald-600">{t.ecoContribution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Join CTA ── */}
      <div className="rounded-2xl border border-teal-200 bg-teal-50 p-6 sm:p-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-teal-600" />
          <span className="text-sm font-semibold text-teal-700">100% Student-Verified Community</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
          Join the CampusExchange Community
        </h2>
        <p className="text-sm text-slate-500 mb-5 max-w-md mx-auto">
          Sign up with your .edu or .ac.in email. Instantly access the campus marketplace, borrow gear for free, and start earning Eco-Credits.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onOpenAddModal()}
            className="ce-btn-primary"
          >
            <Sparkles className="h-4 w-4" />
            Post Your First Item
          </button>
          <button
            onClick={() => setActiveTab("explore")}
            className="ce-btn-outline"
          >
            Explore Without Account
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <p className="text-[11px] text-slate-400 mt-3">
          Don't Buy For 4 Years. Rent, Exchange & Reuse.
        </p>
      </div>
    </div>
  );
}

// ── Explore / Marketplace View ────────────────────────────────────────────────
function ExploreView({
  onSelectListing,
  onOpenChat,
}: {
  onSelectListing: (l: Listing) => void;
  onOpenChat: (s: string, l?: string) => void;
}) {
  const {
    listings,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    transactionFilter,
    setTransactionFilter,
  } = useCampus();

  const [sortBy, setSortBy] = useState<string>("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const filteredListings = useMemo(() => {
    let results = listings.filter((l) => {
      if (selectedCategory && l.categoryId !== selectedCategory) return false;
      if (transactionFilter !== "all" && l.transactionType !== transactionFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.courseRelevant?.toLowerCase().includes(q)
        );
      }
      return true;
    });

    switch (sortBy) {
      case "price_asc": results = [...results].sort((a, b) => (a.rentalRatePerDay ?? a.price) - (b.rentalRatePerDay ?? b.price)); break;
      case "price_desc": results = [...results].sort((a, b) => (b.rentalRatePerDay ?? b.price) - (a.rentalRatePerDay ?? a.price)); break;
      case "rating": results = [...results].sort((a, b) => b.rating - a.rating); break;
      case "eco": results = [...results].sort((a, b) => b.ecoCreditsAward - a.ecoCreditsAward); break;
      default: results = [...results].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return results;
  }, [listings, selectedCategory, transactionFilter, searchQuery, sortBy]);

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Newest Listed";

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Campus Marketplace</h1>
        <p className="text-sm text-slate-500">
          Borrow, rent, buy or exchange resources safely within your verified campus community
        </p>
      </div>

      {/* Filter + Sort bar */}
      <div className="flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
        {/* Filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTransactionFilter(tab.id)}
              className={`ce-filter-tab ${transactionFilter === tab.id ? "active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="ce-btn-outline text-sm gap-2"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {currentSortLabel}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showSortDropdown ? "rotate-180" : ""}`} />
          </button>
          {showSortDropdown && (
            <div className="ce-dropdown fade-in-up" style={{ right: 0, left: "auto", minWidth: 200 }}>
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setSortBy(opt.value); setShowSortDropdown(false); }}
                  className={`ce-dropdown-item w-full text-left ${sortBy === opt.value ? "text-teal-700 bg-teal-50 font-semibold" : ""}`}
                >
                  {sortBy === opt.value && <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />}
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active filters summary */}
      {(selectedCategory || transactionFilter !== "all" || searchQuery) && (
        <div className="flex flex-wrap items-center gap-2 text-[12px]">
          <span className="text-slate-500">{filteredListings.length} results</span>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-600 hover:border-red-300 hover:text-red-500 transition-colors"
            >
              {CATEGORIES.find((c) => c.id === selectedCategory)?.name.split(" & ")[0]}
              <span className="text-slate-300">✕</span>
            </button>
          )}
          {transactionFilter !== "all" && (
            <button
              onClick={() => setTransactionFilter("all")}
              className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-600 hover:border-red-300 hover:text-red-500 transition-colors"
            >
              {FILTER_TABS.find((t) => t.id === transactionFilter)?.label}
              <span className="text-slate-300">✕</span>
            </button>
          )}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-600 hover:border-red-300 hover:text-red-500 transition-colors"
            >
              "{searchQuery}"
              <span className="text-slate-300">✕</span>
            </button>
          )}
        </div>
      )}

      {/* Product grid */}
      {filteredListings.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center ce-empty">
          <Search className="h-10 w-10 mx-auto mb-3 text-slate-300" />
          <h3 className="text-base font-bold text-slate-700 mb-1">No listings match your filters</h3>
          <p className="text-sm text-slate-400 mb-4">Try removing some filters, or be the first to list something!</p>
          <button
            onClick={() => { setSelectedCategory(null); setSearchQuery(""); setTransactionFilter("all"); }}
            className="ce-btn-primary mx-auto"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="marketplace-grid">
          {filteredListings.map((item) => (
            <ProductCard
              key={item.id}
              listing={item}
              onSelect={onSelectListing}
              onOpenChat={(s, l) => onOpenChat(s, l)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main App Shell ────────────────────────────────────────────────────────────
function CampusExchangeApp() {
  const { activeTab, setActiveTab } = useCampus();

  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [chatTarget, setChatTarget] = useState<{ sellerId: string; listingId?: string } | null>(null);

  const handleOpenChat = (sellerId: string, listingId?: string) => {
    setChatTarget({ sellerId, listingId });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Top Navbar */}
      <Navbar onOpenAddModal={() => setIsAddModalOpen(true)} />

      {/* Main body */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Content area */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 pb-24 lg:pb-12 max-w-6xl mx-auto w-full">
          {activeTab === "home" && (
            <HomeView
              onSelectListing={setSelectedListing}
              onOpenChat={handleOpenChat}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          )}

          {activeTab === "explore" && (
            <ExploreView
              onSelectListing={setSelectedListing}
              onOpenChat={handleOpenChat}
            />
          )}

          {activeTab === "requests" && <RequestBoardView />}
          {activeTab === "rentals" && <RentalManagementView />}
          {activeTab === "group-rentals" && (
            <GroupRentalsView onOpenListing={(l) => setSelectedListing(l)} />
          )}
          {activeTab === "pickups" && <CampusPickupNetworkView />}
          {activeTab === "giveback" && (
            <GivebackCornerView onOpenAddModal={() => setIsAddModalOpen(true)} />
          )}
          {activeTab === "greenscore" && <GreenScoreView />}
          {activeTab === "events" && <CommunityEventsView />}
          {activeTab === "passport" && <CampusTrustPassportView />}
          {activeTab === "admin" && <AdminDashboardView />}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNav onOpenAddModal={() => setIsAddModalOpen(true)} />

      {/* Modals */}
      <AddListingModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <ListingDetailModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        onOpenChat={(sellerId, listingId) => setChatTarget({ sellerId, listingId })}
      />
      <ChatDrawer
        isOpen={chatTarget !== null}
        onClose={() => setChatTarget(null)}
        sellerId={chatTarget?.sellerId || ""}
        listingId={chatTarget?.listingId}
      />
    </div>
  );
}

export default function Home() {
  return (
    <CampusProvider>
      <CampusExchangeApp />
    </CampusProvider>
  );
}
