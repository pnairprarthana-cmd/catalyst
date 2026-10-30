"use client";

import React, { useState } from "react";
import { useCampus } from "@/context/CampusContext";
import { CATEGORIES } from "@/lib/mockData";
import {
  X,
  Upload,
  Leaf,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Calendar,
  Layers,
} from "lucide-react";

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddListingModal({ isOpen, onClose }: AddListingModalProps) {
  const { addListing, pickupHubs, currentUser } = useCampus();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id);
  const [transactionType, setTransactionType] = useState<"borrow" | "rent" | "sell" | "giveaway">("borrow");
  const [maxBorrowDays, setMaxBorrowDays] = useState(2);
  const [condition, setCondition] = useState<"brand_new" | "like_new" | "good" | "fair">("like_new");
  const [price, setPrice] = useState(25);
  const [rentalRatePerDay, setRentalRatePerDay] = useState(4);
  const [rentalDeposit, setRentalDeposit] = useState(15);
  const [courseRelevant, setCourseRelevant] = useState("");
  const [semesterRelevant, setSemesterRelevant] = useState(currentUser.semester || 4);
  const [pickupLocationId, setPickupLocationId] = useState(pickupHubs[0]?.id || "hub-1");
  const [imageUrl, setImageUrl] = useState(
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
  );
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addListing({
      title,
      description,
      categoryId,
      transactionType,
      condition,
      price: transactionType === "giveaway" || transactionType === "borrow" ? 0 : Number(price),
      rentalRatePerDay: transactionType === "rent" ? Number(rentalRatePerDay) : undefined,
      rentalDeposit: transactionType === "rent" ? Number(rentalDeposit) : undefined,
      maxBorrowDays: transactionType === "borrow" ? Number(maxBorrowDays) : undefined,
      courseRelevant: courseRelevant.trim() || undefined,
      semesterRelevant: Number(semesterRelevant),
      pickupLocationId,
      images: [imageUrl],
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  const PRESET_IMAGES = [
    { label: "Book / Notes", url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80" },
    { label: "Calculator / Tech", url: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80" },
    { label: "Lab Hardware", url: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80" },
    { label: "Fest Outfit", url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80" },
    { label: "Lab Coat", url: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0F172A] p-5 sm:p-6 shadow-2xl text-slate-200 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-slate-300 hover:bg-white/20 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="text-xl font-extrabold text-white">Resource Listed Successfully! 🚀</h2>
            <p className="text-xs text-slate-300">
              Your resource is now live across the campus network. +50 Eco-Credits credited!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">List Campus Resource</h2>
                <p className="text-[11px] text-slate-400">
                  Share, rent, sell, or donate academic items within {currentUser.college}
                </p>
              </div>
            </div>

            {/* Category Grid */}
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 mb-1.5 block">
                Resource Category (9 Official Campus Categories)
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#111D4A] p-2.5 text-xs text-white outline-none focus:border-cyan-400"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Transaction Type Buttons */}
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 mb-1.5 block">
                How do you want to share?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setTransactionType("borrow")}
                  className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    transactionType === "borrow"
                      ? "border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow-sm"
                      : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <span>🤝 Free Borrow</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTransactionType("rent")}
                  className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    transactionType === "rent"
                      ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-sm"
                      : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Peer Rent</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTransactionType("sell")}
                  className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    transactionType === "sell"
                      ? "border-blue-400 bg-blue-500/20 text-blue-300 shadow-sm"
                      : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <DollarSign className="h-3.5 w-3.5" />
                  <span>Sell</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTransactionType("giveaway")}
                  className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    transactionType === "giveaway"
                      ? "border-purple-400 bg-purple-500/20 text-purple-300 shadow-sm"
                      : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <Leaf className="h-3.5 w-3.5" />
                  <span>Donation</span>
                </button>
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400 mb-1 block">
                  Listing Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Casio fx-991EX Calculator / Wireless Presentation Clicker"
                  className="w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400 mb-1 block">
                  Description & Condition Details
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mention edition, highlighting, accessories included, cleanliness..."
                  className="w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 resize-none"
                />
              </div>
            </div>

            {/* Pricing / Borrow Controls depending on Type */}
            {transactionType === "borrow" ? (
              <div className="rounded-2xl bg-emerald-950/20 p-3 border border-emerald-500/25 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300">Free Peer Loan Duration</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">$0.00 Fee</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "1 Day (Quick lab/exam)", val: 1 },
                    { label: "2 Days (Standard)", val: 2 },
                    { label: "3 Days (Full weekend)", val: 3 },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setMaxBorrowDays(opt.val)}
                      className={`p-2 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                        maxBorrowDays === opt.val
                          ? "border-emerald-400 bg-emerald-500/20 text-white"
                          : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : transactionType === "rent" ? (
              <div className="grid grid-cols-2 gap-3 rounded-2xl bg-white/5 p-3 border border-white/10">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">
                    Daily Rental Rate ($)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={rentalRatePerDay}
                    onChange={(e) => setRentalRatePerDay(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/15 bg-black/40 p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">
                    Security Deposit ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={rentalDeposit}
                    onChange={(e) => setRentalDeposit(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/15 bg-black/40 p-2 text-xs text-white"
                  />
                </div>
              </div>
            ) : transactionType === "sell" ? (
              <div className="rounded-2xl bg-white/5 p-3 border border-white/10">
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">
                  Selling Price ($)
                </label>
                <input
                  type="number"
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/15 bg-black/40 p-2 text-xs text-white"
                />
              </div>
            ) : (
              <div className="rounded-2xl bg-emerald-950/30 p-3 border border-emerald-500/20 text-xs text-emerald-300">
                100% Free Senior Donation! You earn <strong>+100 Eco-Credits</strong> when handed off.
              </div>
            )}

            {/* Condition & Course tag */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">
                  Item Condition
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full rounded-xl border border-white/15 bg-[#111D4A] p-2 text-xs text-white"
                >
                  <option value="like_new">Like New (Flawless)</option>
                  <option value="brand_new">Brand New (Unopened)</option>
                  <option value="good">Good (Normal Study Use)</option>
                  <option value="fair">Fair (Visible Wear)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">
                  Course Relevance Tag (Optional)
                </label>
                <input
                  type="text"
                  value={courseRelevant}
                  onChange={(e) => setCourseRelevant(e.target.value)}
                  placeholder="e.g. CS-302 / Bio-101"
                  className="w-full rounded-xl border border-white/15 bg-white/5 p-2 text-xs text-white"
                />
              </div>
            </div>

            {/* Safe Pickup Hub */}
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">
                Designated Safe Campus Pickup Point
              </label>
              <select
                value={pickupLocationId}
                onChange={(e) => setPickupLocationId(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#111D4A] p-2 text-xs text-white"
              >
                {pickupHubs.map((hub) => (
                  <option key={hub.id} value={hub.id}>
                    {hub.name} ({hub.zone})
                  </option>
                ))}
              </select>
            </div>

            {/* Image Preview & Presets */}
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">
                Select Photo Preset or Paste Image URL
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-medium border transition-all ${
                      imageUrl === preset.url
                        ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                        : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border border-white/15 bg-white/5 p-2 text-xs text-white"
              />
            </div>

            {/* Eco Impact Preview Card */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-2.5 flex items-center justify-between text-xs text-emerald-300">
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-emerald-400" />
                <span>Estimated Circular Reward:</span>
              </div>
              <span className="font-bold text-emerald-400">+50 Eco-Credits (~5.5 kg CO2 avoided)</span>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer"
            >
              Publish to Campus Marketplace
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
