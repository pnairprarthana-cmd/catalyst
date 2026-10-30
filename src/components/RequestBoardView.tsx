"use client";

import React, { useState } from "react";
import { useCampus } from "@/context/CampusContext";
import { RequestItem } from "@/types";
import { CATEGORIES } from "@/lib/mockData";
import {
  HelpCircle,
  PlusCircle,
  Clock,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Send,
  Sparkles,
  ArrowRight,
  Filter,
  X,
  Calendar,
  AlertTriangle,
} from "lucide-react";

export default function RequestBoardView() {
  const { requests, createRequest, submitOffer, currentUser, listings } = useCampus();

  const [isPostingModalOpen, setIsPostingModalOpen] = useState(false);
  const [selectedRequestForOffer, setSelectedRequestForOffer] = useState<RequestItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");

  // New Request Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCatId, setNewCatId] = useState(CATEGORIES[0].id);
  const [newNeededBy, setNewNeededBy] = useState("Tomorrow evening");
  const [newBudget, setNewBudget] = useState(15);
  const [newIsRental, setNewIsRental] = useState(true);
  const [newRentalDays, setNewRentalDays] = useState(2);
  const [newUrgency, setNewUrgency] = useState<"urgent" | "high" | "medium" | "low">("high");

  // Offer submission state
  const [offerPrice, setOfferPrice] = useState(12);
  const [offerMessage, setOfferMessage] = useState("");
  const [offerListingId, setOfferListingId] = useState<string>("");
  const [offerSubmitted, setOfferSubmitted] = useState(false);

  const filteredRequests = requests.filter((req) => {
    if (categoryFilter !== "all" && req.categoryId !== categoryFilter) return false;
    if (urgencyFilter !== "all" && req.urgency !== urgencyFilter) return false;
    return true;
  });

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createRequest({
      title: newTitle,
      description: newDesc,
      categoryId: newCatId,
      neededByDate: newNeededBy,
      budget: Number(newBudget),
      isRental: newIsRental,
      rentalDaysNeeded: Number(newRentalDays),
      urgency: newUrgency,
    });

    setIsPostingModalOpen(false);
    setNewTitle("");
    setNewDesc("");
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestForOffer) return;

    submitOffer(selectedRequestForOffer.id, {
      proposedPrice: Number(offerPrice),
      message: offerMessage || "Hi! I have this available on campus and can meet at the library safe desk.",
      isRental: selectedRequestForOffer.isRental,
      listingId: offerListingId || undefined,
    });

    setOfferSubmitted(true);
    setTimeout(() => {
      setOfferSubmitted(false);
      setSelectedRequestForOffer(null);
      setOfferMessage("");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Banner / Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#111D4A] via-[#0F172A] to-[#1E1B4B] p-6 lg:p-8">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/30">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Demand-Driven Campus Board</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            NEED IT? POST IT!
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Can&apos;t find a specific textbook, calculator, lab coat, or festive outfit?
            Post a campus broadcast. Verified students will respond with instant offers or loan it to you!
          </p>

          <div className="pt-2">
            <button
              onClick={() => setIsPostingModalOpen(true)}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Post New Request</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/5 p-3 border border-white/10">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Filter className="h-4 w-4 text-cyan-400" />
          <span className="font-semibold">Filter Requests:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-white/15 bg-[#111D4A] px-3 py-1.5 text-white outline-none"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Urgency Filter */}
          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="rounded-xl border border-white/15 bg-[#111D4A] px-3 py-1.5 text-white outline-none"
          >
            <option value="all">All Urgencies</option>
            <option value="urgent">Urgent (&lt; 24h)</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
          </select>
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRequests.map((req) => {
          const category = CATEGORIES.find((c) => c.id === req.categoryId);
          const isUrgent = req.urgency === "urgent";

          return (
            <div
              key={req.id}
              className={`flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                isUrgent
                  ? "border-rose-500/40 bg-rose-950/20 shadow-lg shadow-rose-950/20"
                  : "border-white/10 bg-[#111D4A]/50 hover:border-cyan-500/30"
              }`}
            >
              <div>
                {/* Header row: Urgency & Category */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                        isUrgent
                          ? "bg-rose-500/30 text-rose-300 border border-rose-500/40 animate-pulse"
                          : req.urgency === "high"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      }`}
                    >
                      {req.urgency.toUpperCase()}
                    </span>

                    <span className="text-[11px] font-semibold text-slate-400">
                      {category?.name || "Academic Gear"}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400">
                    {req.status === "fulfilled" ? (
                      <span className="text-emerald-400 font-bold">Fulfilled ✅</span>
                    ) : (
                      <span>Open for offers</span>
                    )}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                  {req.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">{req.description}</p>

                {/* Details Badges */}
                <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                  <div className="flex items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1 text-slate-300">
                    <Clock className="h-3 w-3 text-cyan-400" />
                    <span>Needed by: {req.neededByDate}</span>
                  </div>

                  <div className="flex items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1 text-slate-300">
                    <DollarSign className="h-3 w-3 text-emerald-400" />
                    <span>
                      Budget: ${req.budget} {req.isRental ? `(Rent ${req.rentalDaysNeeded}d)` : "(Buy)"}
                    </span>
                  </div>
                </div>

                {/* Matched Listings Alert */}
                {req.matchedListingsCount > 0 && (
                  <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-cyan-500/10 px-2.5 py-1 text-[11px] font-medium text-cyan-300 border border-cyan-500/20">
                    <Sparkles className="h-3.5 w-3.5 shrink-0" />
                    <span>{req.matchedListingsCount} matching resources available right now on campus</span>
                  </div>
                )}
              </div>

              {/* Footer: Requester & Offer Action */}
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                <div className="flex items-center gap-2">
                  <img
                    src={req.student.avatar}
                    alt={req.student.name}
                    className="h-7 w-7 rounded-full object-cover ring-1 ring-cyan-400"
                  />
                  <div className="text-xs">
                    <div className="font-semibold text-slate-200 flex items-center gap-1">
                      <span>{req.student.name}</span>
                      <CheckCircle2 className="h-3 w-3 text-cyan-400" />
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Sem {req.student.semester} • {req.offersCount} offers received
                    </div>
                  </div>
                </div>

                {/* Fulfill / Make Offer button */}
                <button
                  disabled={req.status === "fulfilled"}
                  onClick={() => {
                    setSelectedRequestForOffer(req);
                    setOfferPrice(req.budget);
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <span>Fulfill Request</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* POST NEW REQUEST MODAL */}
      {isPostingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0F172A] p-6 shadow-2xl text-slate-200">
            <button
              onClick={() => setIsPostingModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <HelpCircle className="h-6 w-6 text-cyan-400" />
                <div>
                  <h2 className="text-base font-bold text-white">Post a Campus Request</h2>
                  <p className="text-[11px] text-slate-400">Broadcast your academic or gear need</p>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400 mb-1 block">
                  What do you need? *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Need Casio fx-991ES Plus for Physics Midterm"
                  className="w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400 mb-1 block">
                  Category
                </label>
                <select
                  value={newCatId}
                  onChange={(e) => setNewCatId(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#111D4A] p-2 text-xs text-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400 mb-1 block">
                  Details & Specific Requirements
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Edition, color, exact dates, course code..."
                  className="w-full rounded-xl border border-white/15 bg-white/5 p-2 text-xs text-white outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">
                    Needed By Timeline
                  </label>
                  <input
                    type="text"
                    value={newNeededBy}
                    onChange={(e) => setNewNeededBy(e.target.value)}
                    placeholder="e.g. Tomorrow 8:00 AM"
                    className="w-full rounded-xl border border-white/15 bg-white/5 p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">
                    Budget / Willing to pay ($)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newBudget}
                    onChange={(e) => setNewBudget(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/15 bg-white/5 p-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">
                    Urgency Level
                  </label>
                  <select
                    value={newUrgency}
                    onChange={(e) => setNewUrgency(e.target.value as any)}
                    className="w-full rounded-xl border border-white/15 bg-[#111D4A] p-2 text-xs text-white"
                  >
                    <option value="urgent">Urgent (&lt; 24h)</option>
                    <option value="high">High (1-2 days)</option>
                    <option value="medium">Medium (This week)</option>
                    <option value="low">Low (Flexible)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">
                    Preference
                  </label>
                  <select
                    value={newIsRental ? "rent" : "buy"}
                    onChange={(e) => setNewIsRental(e.target.value === "rent")}
                    className="w-full rounded-xl border border-white/15 bg-[#111D4A] p-2 text-xs text-white"
                  >
                    <option value="rent">Rental (Temporary use)</option>
                    <option value="buy">Purchase Outright</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer"
              >
                Broadcast Request to Campus
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MAKE OFFER MODAL */}
      {selectedRequestForOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0F172A] p-6 shadow-2xl text-slate-200">
            <button
              onClick={() => setSelectedRequestForOffer(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {offerSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Offer Dispatched! 🤝</h3>
                <p className="text-xs text-slate-300">
                  {selectedRequestForOffer.student.name} has been notified and can accept your offer.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendOffer} className="space-y-4">
                <div className="border-b border-white/10 pb-3">
                  <div className="text-[11px] font-bold uppercase text-cyan-400">Respond with Offer</div>
                  <h3 className="text-sm font-bold text-white mt-1">
                    {selectedRequestForOffer.title}
                  </h3>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Requested by {selectedRequestForOffer.student.name} • Budget: ${selectedRequestForOffer.budget}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">
                    Your Proposed Price / Rental Fee ($)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/15 bg-white/5 p-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">
                    Attach Your Existing Listing (Optional)
                  </label>
                  <select
                    value={offerListingId}
                    onChange={(e) => setOfferListingId(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-[#111D4A] p-2 text-xs text-white"
                  >
                    <option value="">No linked listing (direct offer)</option>
                    {listings
                      .filter((l) => l.seller.id === currentUser.id)
                      .map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.title} (${l.price})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">
                    Message to Student
                  </label>
                  <textarea
                    rows={2}
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    placeholder="e.g. I have this exact model with fresh batteries. Can meet at Library safe desk!"
                    className="w-full rounded-xl border border-white/15 bg-white/5 p-2 text-xs text-white outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer"
                >
                  Send Direct Offer
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
