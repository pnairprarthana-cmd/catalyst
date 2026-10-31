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
import StudentEarningsView from "@/components/StudentEarningsView";
import KarmaGuidelinesView from "@/components/KarmaGuidelinesView";
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
  Wallet,
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
  { id: "sell", label: "Campus Store (Buy)" },
  { id: "borrow", label: "Free to Borrow (₹0)" },
  { id: "rent", label: "Rentals" },
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

const CAT_EMOJIS: Record<string, string> = {
  "cat-1": "📚",
  "cat-2": "📖",
  "cat-3": "🔬",
  "cat-4": "💻",
  "cat-5": "👔",
  "cat-10": "✏️",
  "cat-11": "🧶",
  "cat-6": "🏸",
  "cat-7": "🏠",
  "cat-8": "🔧",
  "cat-9": "🎁",
};

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
  const { listings, requests, currentUser, setActiveTab, setTransactionFilter, setSelectedCategory, totalEarnings } = useCampus();

  const freeBorrows = listings.filter((l) => l.transactionType === "borrow").slice(0, 4);
  const studentCrafts = listings.filter((l) => l.categoryId === "cat-11").slice(0, 4);
  const trending = listings.filter((l) => l.isFeatured || l.views > 100).slice(0, 8);
  const recommended = listings
    .filter((l) => l.courseRelevant || l.semesterRelevant === currentUser.semester)
    .slice(0, 4);

  return (
    <div className="space-y-12 sm:space-y-14 pb-14">
      {/* ── Main Hero Section (Reference Layout Structure) ── */}
      <div className="relative overflow-hidden rounded-3xl border border-pink-200/80 bg-gradient-to-r from-[#FFFBEB] via-[#FEF9C3]/65 to-[#FCE7F3] shadow-sm">
        {/* Background Image: Campus architectural photo blended seamlessly on the right half */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 pointer-events-none overflow-hidden select-none">
          <img
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80"
            alt="Campus Architecture & Life"
            className="h-full w-full object-cover object-center opacity-30 lg:opacity-40 mix-blend-multiply"
          />
          {/* Subtle fade masks melting into the left butter yellow / pink gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFFBEB] via-[#FFFBEB]/75 to-transparent hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FDF2F8]/90 via-[#FDF2F8]/40 to-transparent lg:hidden" />
        </div>

        {/* Hero Content — Left Aligned */}
        <div className="relative z-10 px-6 sm:px-10 lg:px-12 pt-8 sm:pt-12 pb-8 max-w-2xl space-y-6">
          {/* College Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-200/90 bg-white/90 px-3.5 py-1 text-xs font-bold text-[#BE185D] shadow-2xs backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            <span>Verified Student-Only Community Platform</span>
          </div>

          {/* Left-Aligned Headline */}
          <div className="space-y-1">
            <h1 className="font-display text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-[1.12]">
              <span className="block text-[#1E293B]">
                Empowering Students to
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#E11D48] via-[#DB2777] to-[#BE185D] mt-1">
                Connect, Create & Exchange
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-[#475569] text-sm sm:text-base max-w-[480px] leading-relaxed font-normal">
            A verified student community platform to borrow, exchange, and share resources sustainably on campus.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {/* Primary button */}
            <button
              onClick={() => { setTransactionFilter("all"); setActiveTab("explore"); }}
              className="bg-amber-300 hover:bg-amber-400 text-slate-900 font-semibold rounded-full px-6 py-2.5 shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Explore Campus Store</span>
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* My Earnings & Wallet quick button */}
            <button
              onClick={() => setActiveTab("earnings")}
              className="border border-amber-300 bg-amber-50/90 hover:bg-amber-100/90 text-amber-900 rounded-full px-5 py-2.5 font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-2xs active:scale-98"
            >
              <Wallet className="h-4 w-4 text-amber-700" />
              <span>My Earnings (₹{totalEarnings.toLocaleString("en-IN")})</span>
            </button>

            {/* Secondary button */}
            <button
              onClick={() => { setTransactionFilter("borrow"); setActiveTab("explore"); }}
              className="border border-pink-300 bg-pink-100/60 hover:bg-pink-200/70 text-pink-900 rounded-full px-6 py-2.5 font-medium transition-all flex items-center gap-2 cursor-pointer shadow-2xs active:scale-98"
            >
              <HandHelping className="h-4 w-4 text-pink-700" />
              <span>How It Works</span>
            </button>
          </div>

          {/* Horizontal Key Stats Cards Row directly below buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-3">
            {[
              { number: "2000+", label: "Active Students" },
              { number: "400+", label: "Items Shared" },
              { number: "100+", label: "Daily Trades" },
              { number: "₹50k+", label: "Money Saved" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/80 backdrop-blur-md border border-pink-200/60 rounded-xl p-4 text-center min-w-[110px] shadow-sm hover:border-pink-300 transition-colors"
              >
                <p className="text-slate-900 font-bold text-xl leading-tight font-display">{stat.number}</p>
                <p className="text-slate-600 text-xs font-medium mt-1 leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Marquee / Continuous Ticker Bar */}
        <div className="relative z-10 border-t border-pink-200/70 bg-white/75 backdrop-blur-md py-2.5 px-4 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap text-xs font-semibold text-slate-700 flex items-center gap-8">
            <span className="flex items-center gap-1.5 text-amber-900 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              ⚡ Zero Waste Campus Initiative
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-pink-700 font-bold">
              🤝 Free Peer Borrowing Desk (₹0)
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-slate-800">
              🎓 Verified Student-Only ID (.edu & .ac.in)
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
              🌿 Over 8,900 kg CO₂ Avoided
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-slate-800">
              📦 3 Safe Pickup Hubs Active Across Campus
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-amber-900 font-medium">
              📚 Textbooks, Lab Coats, Calculators & Gear
            </span>
            <span className="text-slate-300">•</span>
            {/* Repeated for seamless continuous loop */}
            <span className="flex items-center gap-1.5 text-amber-900 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              ⚡ Zero Waste Campus Initiative
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-pink-700 font-bold">
              🤝 Free Peer Borrowing Desk (₹0)
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-slate-800">
              🎓 Verified Student-Only ID (.edu & .ac.in)
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
              🌿 Over 8,900 kg CO₂ Avoided
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-slate-800">
              📦 3 Safe Pickup Hubs Active Across Campus
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-amber-900 font-medium">
              📚 Textbooks, Lab Coats, Calculators & Gear
            </span>
          </div>
        </div>
      </div>

      {/* ── Free Borrows section ── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="ce-section-title flex items-center gap-2 font-display text-xl sm:text-2xl font-black">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-200/80 text-amber-900 text-sm">
                🤝
              </span>
              <span>Free Campus Borrows</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                ₹0 Fee
              </span>
            </h2>
            <p className="ce-section-sub mt-0.5">Borrow for free from verified students. Return when done — no cost.</p>
          </div>
          <button
            onClick={() => { setTransactionFilter("borrow"); setActiveTab("explore"); }}
            className="flex items-center gap-1 text-xs sm:text-sm font-bold text-pink-600 hover:text-pink-800 transition-colors"
          >
            View all borrows <ChevronRight className="h-4 w-4" />
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
                {CAT_EMOJIS[cat.id] || "📦"}
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

      {/* ── Student Made: Handmade Crochet & Hampers ── */}
      {studentCrafts.length > 0 && (
        <div className="rounded-2xl border border-pink-200/80 bg-gradient-to-r from-[#FFFBEB] via-[#FFF5F7] to-[#FCE7F3] p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 text-[11px] font-bold mb-1">
                <Sparkles className="h-3 w-3" />
                Student Creators & Artisans
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                Handmade Crochet, Hampers & Crafts
              </h2>
              <p className="text-xs text-slate-500">Handcrafted by hostel peers for sale on campus</p>
            </div>
            <button
              onClick={() => { setSelectedCategory("cat-11"); setActiveTab("explore"); }}
              className="flex items-center gap-1 text-[12px] font-semibold text-pink-600 hover:text-pink-800 transition-colors"
            >
              Explore all crafts <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="marketplace-grid">
            {studentCrafts.map((item) => (
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
      <div className="rounded-2xl border border-pink-200/80 bg-gradient-to-br from-[#fdf2f8] via-[#fff5f7] to-[#fef9c3] p-6 sm:p-8 text-center shadow-xs">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-pink-600" />
          <span className="text-sm font-bold text-pink-900">100% Student-Verified Community</span>
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
        <h1 className="text-xl font-extrabold text-slate-900">Campus Store & Resource Hub</h1>
        <p className="text-sm text-slate-500">
          Shop verified campus store items, borrow for free, rent gear, or exchange with peers
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
          {activeTab === "earnings" && <StudentEarningsView />}
          {activeTab === "karma-guidelines" && <KarmaGuidelinesView />}
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
  return <CampusExchangeApp />;
}
