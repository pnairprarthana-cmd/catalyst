"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Listing } from "@/types";
import {
  MapPin,
  MessageSquare,
  Heart,
  Star,
  ShieldCheck,
  ArrowRight,
  Diamond,
} from "lucide-react";
import { PICKUP_HUBS } from "@/lib/mockData";
import { useCampus } from "@/context/CampusContext";

interface ProductCardProps {
  listing: Listing;
  onSelect?: (listing: Listing) => void;
  onOpenChat?: (sellerId: string, listingId: string) => void;
}

const CONDITION_LABEL: Record<string, string> = {
  brand_new: "Brand New",
  like_new: "Like New",
  good: "Good Condition",
  fair: "Fair Condition",
};

export default function ProductCard({ listing, onSelect, onOpenChat }: ProductCardProps) {
  const router = useRouter();
  const { savedListingIds, toggleSaveListing } = useCampus();
  const [imgError, setImgError] = useState(false);

  const pickupHub = PICKUP_HUBS.find((h) => h.id === listing.pickupLocationId);
  const isSaved = savedListingIds.includes(listing.id);

  const isBorrow = listing.transactionType === "borrow";
  const isRent = listing.transactionType === "rent";
  const isGiveaway = listing.transactionType === "giveaway";
  const isExchange = listing.transactionType === "exchange";

  // Action button label in simple, clear student terms
  const actionLabel = isBorrow
    ? "Request / Borrow Now"
    : isRent
    ? "Rent Now"
    : isGiveaway
    ? "Claim for Free"
    : isExchange
    ? "Swap Item"
    : "Buy from Store";

  const ratingScore = listing.rating || 5.0;
  const borrowCount = listing.reviewsCount || 24;

  const handleNavigate = () => {
    if (onSelect) {
      onSelect(listing);
    }
    router.push(`/listing/${listing.id}`);
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenChat?.(listing.seller.id, listing.id);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveListing(listing.id);
  };

  // ── Cohesive CampusExchange Brand Card for Free Borrows (Butter Yellow & Pink Palette) ──
  if (isBorrow) {
    return (
      <div
        onClick={handleNavigate}
        className="group relative flex flex-col justify-between border border-pink-100 bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-1 duration-200 rounded-2xl p-4 cursor-pointer"
      >
        <div className="flex flex-col">
          {/* Soft rounded image frame */}
          <div className="relative w-full h-[200px] rounded-xl overflow-hidden bg-pink-50/40 p-3 flex items-center justify-center border border-pink-100/50">
            {!imgError ? (
              <img
                src={listing.images[0]}
                alt={listing.title}
                onError={() => setImgError(true)}
                className="max-h-full max-w-full object-contain mx-auto transition-transform duration-200 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 gap-1">
                <span className="text-3xl">🤝</span>
                <span className="text-[11px] text-slate-400">Free Peer Loan</span>
              </div>
            )}

            {/* Butter yellow pill badge top-left */}
            <div className="absolute top-2.5 left-2.5">
              <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                Free Borrow (₹0)
              </span>
            </div>

            {/* Subtle pink circular wishlist heart top-right */}
            <button
              type="button"
              onClick={handleSaveClick}
              aria-label="Save item"
              className="absolute top-2.5 right-2.5 bg-white/90 text-pink-500 hover:bg-pink-50 p-1.5 rounded-full shadow-xs transition-colors"
            >
              <Heart className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Card Information */}
          <div className="pt-3 space-y-2">
            {/* Title: clean sans-serif semibold slate */}
            <h3
              className="text-slate-900 font-semibold text-sm line-clamp-2 hover:text-pink-600 transition-colors leading-[1.35]"
              title={listing.title}
            >
              {listing.title}
            </h3>

            {/* Diamond Rating System (Replaced Stars) */}
            <div className="flex items-center gap-1.5 text-xs">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((d) => (
                  <Diamond
                    key={d}
                    className={`h-3 w-3 ${
                      d <= Math.floor(ratingScore)
                        ? "text-rose-400 fill-rose-400"
                        : "text-slate-200 fill-slate-100"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-800">
                {ratingScore.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">
                ({borrowCount} borrows)
              </span>
            </div>

            {/* Price Headline: ₹0 Free Peer Loan */}
            <div className="flex items-baseline gap-1.5 pt-0.5">
              <span className="text-2xl font-black text-slate-900 leading-none">₹0</span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                100% Free Peer Loan
              </span>
            </div>

            {/* Metadata chips / badges: neat mini-pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="bg-slate-50 text-slate-600 border border-slate-100 text-[11px] px-2 py-0.5 rounded-md">
                Loan: {listing.maxBorrowDays || 2}-3 days
              </span>
              <span className="bg-slate-50 text-slate-600 border border-slate-100 text-[11px] px-2 py-0.5 rounded-md">
                {CONDITION_LABEL[listing.condition] || "Good Condition"}
              </span>
              {pickupHub && (
                <span className="bg-slate-50 text-slate-600 border border-slate-100 text-[11px] px-2 py-0.5 rounded-md flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                  <span className="truncate max-w-[130px]">{pickupHub.zone}</span>
                </span>
              )}
            </div>

            {/* Owner / Lender info */}
            <div className="flex items-center justify-between gap-1 pt-2 border-t border-pink-50 text-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <img
                  src={listing.seller.avatar}
                  alt={listing.seller.name}
                  className="h-5 w-5 rounded-full object-cover ring-1 ring-pink-200 shrink-0"
                />
                <span className="text-slate-500 text-[11px] truncate">
                  Lender: <strong className="text-slate-700 font-medium">{listing.seller.name.split(" ")[0]}</strong>
                </span>
                {listing.seller.isVerified && (
                  <span title="Verified Campus Student">
                    <ShieldCheck className="h-3.5 w-3.5 text-pink-500 shrink-0" />
                  </span>
                )}
              </div>
              {listing.courseRelevant && (
                <span className="text-[10px] text-slate-400 truncate max-w-[110px]" title={listing.courseRelevant}>
                  {listing.courseRelevant.split(" ")[0]}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Call to Action Button: Butter Yellow Pill with small forward arrow */}
        <div className="pt-3 mt-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate();
            }}
            className="bg-amber-300 hover:bg-amber-400 text-slate-900 font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 w-full cursor-pointer hover:shadow-sm active:scale-[0.99]"
          >
            <span>Request / Borrow Now</span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-900" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleNavigate}
      className="group relative flex flex-col justify-between bg-white border border-[#e5e7eb] rounded-lg p-3 transition-all duration-200 hover:shadow-md hover:border-[#d5d9d9] cursor-pointer"
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {/* ── TOP: Clean Amazon Image Box ── */}
      <div className="flex flex-col">
        <div className="relative w-full h-[210px] rounded-md bg-[#f7f7f7] p-3 flex items-center justify-center overflow-hidden border border-[#f0f0f0]">
          {!imgError ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              onError={() => setImgError(true)}
              className="max-h-full max-w-full object-contain mx-auto transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 gap-1">
              <span className="text-3xl">📦</span>
              <span className="text-[11px] text-slate-400">Campus Resource</span>
            </div>
          )}

          {/* Single clean tag top-left */}
          <div className="absolute top-2 left-2">
            {isBorrow ? (
              <span className="text-[11px] font-bold text-[#78350f] bg-[#fef9c3] border border-[#fef08a] px-2 py-0.5 rounded shadow-xs">
                Free Borrow (₹0)
              </span>
            ) : isRent ? (
              <span className="text-[11px] font-bold text-[#9d174d] bg-[#fdf2f8] border border-[#fbcfe8] px-2 py-0.5 rounded shadow-xs">
                Rent
              </span>
            ) : isGiveaway ? (
              <span className="text-[11px] font-bold text-[#be185d] bg-[#fff1f2] border border-[#fecdd3] px-2 py-0.5 rounded shadow-xs">
                Free Gift
              </span>
            ) : listing.categoryId === "cat-11" ? (
              <span className="text-[11px] font-bold text-pink-700 bg-pink-50 border border-pink-200 px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                🏪 Student Store
              </span>
            ) : (
              <span className="text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                🏪 Campus Store
              </span>
            )}
          </div>

          {/* Clean heart button top-right */}
          <button
            type="button"
            onClick={handleSaveClick}
            aria-label="Save item"
            className={`absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full border shadow-xs transition-all ${
              isSaved
                ? "bg-red-500 border-red-500 text-white"
                : "bg-white/95 border-slate-200 text-slate-400 hover:text-red-500 hover:bg-white"
            }`}
          >
            <Heart className="h-3.5 w-3.5" fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>

        {/* ── CARD INFORMATION HIERARCHY ── */}
        <div className="pt-2.5 space-y-1.5">
          {/* 1. Item Title (2-line truncate, dark text #0f1111) */}
          <h3
            className="text-[14px] font-medium text-[#0f1111] line-clamp-2 leading-[1.3] group-hover:text-[#c45500] transition-colors"
            title={listing.title}
          >
            {listing.title}
          </h3>

          {/* 2. Rating & Borrow Count */}
          <div className="flex items-center gap-1.5 text-xs">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-3 w-3 ${
                    s <= Math.floor(ratingScore)
                      ? "text-[#de7921] fill-[#de7921]"
                      : "text-slate-200 fill-slate-100"
                  }`}
                />
              ))}
            </div>
            <span className="text-[12px] font-semibold text-slate-800">
              {ratingScore.toFixed(1)}
            </span>
            <span className="text-[12px] text-[#007185] hover:underline">
              ({borrowCount} borrows)
            </span>
          </div>

          {/* 3. Bold Price Display */}
          <div className="pt-0.5">
            {isBorrow ? (
              <div className="flex items-baseline gap-1.5">
                <div className="flex items-start">
                  <span className="text-xs font-semibold text-[#0f1111] leading-none pt-0.5">₹</span>
                  <span className="text-2xl font-black text-[#0f1111] leading-none tracking-tight">0</span>
                </div>
                <span className="text-xs font-semibold text-emerald-700">
                  Free Borrow
                </span>
              </div>
            ) : isRent ? (
              <div className="flex items-baseline gap-1">
                <div className="flex items-start">
                  <span className="text-xs font-semibold text-[#0f1111] leading-none pt-0.5">₹</span>
                  <span className="text-2xl font-black text-[#0f1111] leading-none tracking-tight">
                    {listing.rentalRatePerDay}
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-normal">/day</span>
              </div>
            ) : isGiveaway ? (
              <span className="text-xl font-black text-emerald-600 leading-none">FREE</span>
            ) : (
              <div className="flex items-start">
                <span className="text-xs font-semibold text-[#0f1111] leading-none pt-0.5">₹</span>
                <span className="text-2xl font-black text-[#0f1111] leading-none tracking-tight">
                  {listing.price}
                </span>
              </div>
            )}
          </div>

          {/* 4. Simple Secondary Tag: Loan Duration or Pickup */}
          <div className="text-[12px] text-slate-600 truncate flex items-center gap-1">
            {isBorrow ? (
              <span>Loan for <strong className="text-slate-800">{listing.maxBorrowDays || 2}-3 days</strong></span>
            ) : pickupHub ? (
              <span className="truncate flex items-center gap-1">
                <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                <span className="truncate">{pickupHub.zone}</span>
              </span>
            ) : (
              <span>Available now</span>
            )}
          </div>

          {/* 5. Condition Pill & Student Lender */}
          <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-100 text-[11px]">
            <span className="text-[10px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
              {CONDITION_LABEL[listing.condition] || "Good Condition"}
            </span>

            <div className="flex items-center gap-1 min-w-0">
              <span className="text-slate-500 truncate">
                {listing.transactionType === "sell" ? (
                  <span className="text-amber-800 font-semibold">Store • {listing.seller.name.split(" ")[0]}</span>
                ) : (
                  listing.seller.name.split(" ")[0]
                )}
              </span>
              {listing.seller.isVerified && (
                <span title="Verified Campus Student">
                  <ShieldCheck className="h-3 w-3 text-teal-600 shrink-0" />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 6. BIG YELLOW ACTION BUTTON ── */}
      <div className="pt-3 mt-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNavigate();
          }}
          className="w-full py-2 px-3 text-[13px] font-medium text-[#0f1111] rounded-full shadow-sm hover:shadow transition-all text-center flex items-center justify-center gap-1.5 active:scale-[0.99]"
          style={{
            background: "#ffd814",
            border: "1px solid #fcd200",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f7ca00";
            e.currentTarget.style.borderColor = "#f2c200";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ffd814";
            e.currentTarget.style.borderColor = "#fcd200";
          }}
        >
          <span>{actionLabel}</span>
          <ArrowRight className="h-3 w-3 text-[#0f1111]" />
        </button>
      </div>
    </div>
  );
}
