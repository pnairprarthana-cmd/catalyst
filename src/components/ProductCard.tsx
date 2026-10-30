"use client";

import React, { useState } from "react";
import { Listing } from "@/types";
import {
  MapPin,
  MessageSquare,
  Heart,
  Star,
  ShieldCheck,
  Leaf,
  Clock,
  ArrowRight,
} from "lucide-react";
import { PICKUP_HUBS } from "@/lib/mockData";
import { useCampus } from "@/context/CampusContext";

interface ProductCardProps {
  listing: Listing;
  onSelect: (listing: Listing) => void;
  onOpenChat?: (sellerId: string, listingId: string) => void;
}

const CONDITION_LABEL: Record<string, string> = {
  brand_new: "Brand New",
  like_new: "Like New",
  good: "Good",
  fair: "Fair",
};

const CONDITION_COLOR: Record<string, string> = {
  brand_new: "text-emerald-600 bg-emerald-50",
  like_new: "text-teal-600 bg-teal-50",
  good: "text-blue-600 bg-blue-50",
  fair: "text-amber-600 bg-amber-50",
};

export default function ProductCard({ listing, onSelect, onOpenChat }: ProductCardProps) {
  const { savedListingIds, toggleSaveListing } = useCampus();
  const [imgError, setImgError] = useState(false);

  const pickupHub = PICKUP_HUBS.find((h) => h.id === listing.pickupLocationId);
  const isSaved = savedListingIds.includes(listing.id);

  const isBorrow = listing.transactionType === "borrow";
  const isRent = listing.transactionType === "rent";
  const isGiveaway = listing.transactionType === "giveaway";
  const isExchange = listing.transactionType === "exchange";
  const isSell = listing.transactionType === "sell";

  const priceDisplay = isBorrow
    ? { label: "Free Borrow", value: "$0", sub: `up to ${listing.maxBorrowDays || 2}d`, tagClass: "tag-free" }
    : isRent
    ? { label: "Rent", value: `$${listing.rentalRatePerDay}/day`, sub: `+$${listing.rentalDeposit || 0} deposit`, tagClass: "tag-rent" }
    : isGiveaway
    ? { label: "Free Gift", value: "Free", sub: "Pickup only", tagClass: "tag-free-gift" }
    : isExchange
    ? { label: "Exchange", value: "Trade", sub: "Smart Swap", tagClass: "tag-buy" }
    : { label: "Buy", value: `$${listing.price}`, sub: "Fixed price", tagClass: "tag-buy" };

  const handleContactClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenChat?.(listing.seller.id, listing.id);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveListing(listing.id);
  };

  return (
    <div
      className="ce-card overflow-hidden cursor-pointer"
      onClick={() => onSelect(listing)}
    >
      {/* Image */}
      <div className="ce-card-image">
        {!imgError ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-100">
            <span className="text-4xl">📦</span>
          </div>
        )}

        {/* Transaction badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className={priceDisplay.tagClass}>{priceDisplay.label}</span>
        </div>

        {/* Save heart */}
        <button
          onClick={handleSaveClick}
          className={`absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full border transition-all ${
            isSaved
              ? "bg-red-500 border-red-500 text-white"
              : "bg-white border-slate-200 text-slate-400 hover:text-red-400"
          }`}
        >
          <Heart className="h-3.5 w-3.5" fill={isSaved ? "currentColor" : "none"} />
        </button>

        {/* Eco credit badge */}
        {listing.ecoCreditsAward > 0 && (
          <div className="absolute bottom-2.5 right-2.5">
            <span className="eco-badge">
              <Leaf className="h-2.5 w-2.5" />
              +{listing.ecoCreditsAward} eco
            </span>
          </div>
        )}

        {/* Featured glow */}
        {listing.isFeatured && (
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2">
            <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full shadow-sm">
              ★ Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5 space-y-2">
        {/* Price + condition row */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-base font-extrabold text-slate-900">{priceDisplay.value}</span>
            {!isBorrow && !isGiveaway && (
              <span className="text-[11px] text-slate-400 ml-1">{priceDisplay.sub}</span>
            )}
          </div>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${CONDITION_COLOR[listing.condition] || "text-slate-500 bg-slate-50"}`}>
            {CONDITION_LABEL[listing.condition]}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[13px] font-bold text-slate-900 line-clamp-2 leading-snug">
          {listing.title}
        </h3>

        {/* Location */}
        {pickupHub && (
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
            <span className="truncate">{pickupHub.zone}</span>
            {listing.maxBorrowDays && (
              <>
                <span className="text-slate-300">•</span>
                <Clock className="h-2.5 w-2.5 text-slate-400 shrink-0" />
                <span>{listing.maxBorrowDays}d max</span>
              </>
            )}
          </div>
        )}

        {/* Course relevant */}
        {listing.courseRelevant && (
          <p className="text-[11px] text-teal-600 font-medium truncate">
            📚 {listing.courseRelevant}
          </p>
        )}

        {/* Divider */}
        <div className="ce-divider" />

        {/* Seller + action */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={listing.seller.avatar}
              alt={listing.seller.name}
              className="h-6 w-6 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[12px] font-semibold text-slate-800 truncate">
                  {listing.seller.name.split(" ")[0]}
                </span>
                {listing.seller.isVerified && (
                  <ShieldCheck className="h-3 w-3 text-teal-500 shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-0.5">
                <Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400" />
                <span className="text-[10px] text-slate-500">{listing.rating.toFixed(1)}</span>
                <span className="text-[10px] text-slate-400">({listing.reviewsCount})</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleContactClick}
            className="flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1.5 text-[11px] font-bold text-teal-700 hover:bg-teal-100 hover:border-teal-300 transition-all whitespace-nowrap"
          >
            {isBorrow ? "Borrow" : isGiveaway ? "Claim" : isExchange ? "Exchange" : "Contact"}
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
