"use client";

import React, { useState } from "react";
import { useCampus } from "@/context/CampusContext";
import { CATEGORIES } from "@/lib/mockData";
import {
  X,
  Leaf,
  Sparkles,
  CheckCircle2,
  Calendar,
  Tag,
  HandHeart,
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
  const [price, setPrice] = useState(250);
  const [rentalRatePerDay, setRentalRatePerDay] = useState(40);
  const [rentalDeposit, setRentalDeposit] = useState(150);
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
    }, 1400);
  };

  const PRESET_IMAGES = [
    { label: "Book / Notes", url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80" },
    { label: "Calculator / Tech", url: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80" },
    { label: "Lab Hardware", url: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80" },
    { label: "Hostel Appliance", url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80" },
    { label: "Lab Coat", url: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-2xl text-slate-900 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Resource Listed Successfully! 🚀</h2>
            <p className="text-sm text-slate-600">
              Your item is now live for verified students on campus. +50 Eco-Credits awarded!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700 shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Post Item on CampusExchange</h2>
                <p className="text-xs text-slate-500">
                  Share, rent, sell, or donate to fellow students on campus
                </p>
              </div>
            </div>

            {/* Transaction Type Tabs */}
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                How would you like to share this item?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setTransactionType("borrow")}
                  className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    transactionType === "borrow"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span>🤝 Free Loan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTransactionType("rent")}
                  className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    transactionType === "rent"
                      ? "border-sky-600 bg-sky-50 text-sky-800 shadow-xs"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Rent (₹/day)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTransactionType("sell")}
                  className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    transactionType === "sell"
                      ? "border-[#f08804] bg-amber-50 text-amber-900 shadow-xs"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Tag className="h-3.5 w-3.5" />
                  <span>Sell (₹)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTransactionType("giveaway")}
                  className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    transactionType === "giveaway"
                      ? "border-purple-600 bg-purple-50 text-purple-800 shadow-xs"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <HandHeart className="h-3.5 w-3.5" />
                  <span>Free Gift</span>
                </button>
              </div>
            </div>

            {/* Pricing Options Box */}
            {transactionType === "borrow" ? (
              <div className="rounded-xl bg-emerald-50/70 p-3.5 border border-emerald-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">Free Peer Loan (₹0)</span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    100% Free for Students
                  </span>
                </div>
                <p className="text-xs text-emerald-800">Choose how many days peers can keep the item:</p>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { label: "1 Day (Lab/Exam)", val: 1 },
                    { label: "2 Days (Standard)", val: 2 },
                    { label: "3 Days (Weekend)", val: 3 },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setMaxBorrowDays(opt.val)}
                      className={`py-2 px-2 rounded-lg border text-xs font-semibold text-center transition-all ${
                        maxBorrowDays === opt.val
                          ? "border-emerald-600 bg-emerald-600 text-white shadow-xs"
                          : "border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-100/50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : transactionType === "rent" ? (
              <div className="rounded-xl bg-sky-50/70 p-3.5 border border-sky-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-950">Set Rental Pricing</span>
                  <span className="text-[11px] text-sky-700 font-medium">Daily fee + Refundable deposit</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">
                      Daily Rental Rate (₹) *
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-slate-500 font-bold text-sm">₹</span>
                      <input
                        type="number"
                        min="1"
                        required
                        value={rentalRatePerDay}
                        onChange={(e) => setRentalRatePerDay(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
                        placeholder="50"
                      />
                      <span className="absolute right-3 text-xs text-slate-400">/day</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">
                      Refundable Deposit (₹)
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-slate-500 font-bold text-sm">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={rentalDeposit}
                        onChange={(e) => setRentalDeposit(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
                        placeholder="200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : transactionType === "sell" ? (
              <div className="rounded-xl bg-amber-50/70 p-3.5 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950">Set Selling Price</span>
                  <span className="text-[11px] text-amber-700 font-medium">Fair student resale rate</span>
                </div>
                <div className="max-w-xs">
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">
                    Selling Price (₹) *
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-slate-500 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      min="1"
                      required
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-3 py-2 text-sm text-slate-900 outline-none focus:border-[#f08804] focus:ring-1 focus:ring-[#f08804]"
                      placeholder="350"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-purple-50/70 p-3.5 border border-purple-200/80 text-xs text-purple-900">
                🎁 <strong>100% Free Senior Gift!</strong> Pass this on to a junior and receive <strong>+100 Eco-Credits</strong> when handed off at a campus safe hub.
              </div>
            )}

            {/* Title & Description */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  Item Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Casio fx-991EX Calculator / White Lab Coat (Medium)"
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  Description & Item Condition Details
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mention edition, highlighting, accessories included, cleanliness..."
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 resize-none"
                />
              </div>
            </div>

            {/* Category & Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 outline-none focus:border-teal-600"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  Item Condition
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 outline-none focus:border-teal-600"
                >
                  <option value="like_new">Like New (Flawless / Barely Used)</option>
                  <option value="brand_new">Brand New (Unopened)</option>
                  <option value="good">Good (Normal Study Use)</option>
                  <option value="fair">Fair (Visible Wear / Highlighted)</option>
                </select>
              </div>
            </div>

            {/* Designated Safe Pickup Point */}
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">
                Designated Campus Pickup Point
              </label>
              <select
                value={pickupLocationId}
                onChange={(e) => setPickupLocationId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 outline-none focus:border-teal-600"
              >
                {pickupHubs.map((hub) => (
                  <option key={hub.id} value={hub.id}>
                    {hub.name} ({hub.zone})
                  </option>
                ))}
              </select>
            </div>

            {/* Photo Preset / URL */}
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                Item Photo (Select preset or enter URL)
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium border transition-all ${
                      imageUrl === preset.url
                        ? "border-teal-600 bg-teal-50 text-teal-800"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
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
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 outline-none focus:border-teal-600"
              />
            </div>

            {/* Eco Impact Preview Card */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-2.5 flex items-center justify-between text-xs text-emerald-800">
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-emerald-600" />
                <span className="font-medium">Estimated Impact:</span>
              </div>
              <span className="font-bold text-emerald-700">+50 Eco-Credits (~5.5 kg CO₂ avoided)</span>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full rounded-xl bg-[#fde047] hover:bg-[#facc15] py-3 text-sm font-bold text-[#78350f] border border-[#fef08a] shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Publish Item to Campus Marketplace</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
