"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCampus } from "@/context/CampusContext";
import { PICKUP_HUBS } from "@/lib/mockData";
import {
  MapPin,
  MessageSquare,
  Heart,
  Star,
  ShieldCheck,
  Leaf,
  Clock,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ShoppingBag,
  Lock,
  ChevronRight,
  Plus,
  Minus,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import ChatDrawer from "@/components/ChatDrawer";

const CONDITION_INFO: Record<string, { label: string; desc: string }> = {
  brand_new: { label: "Brand New", desc: "Never used, in original packaging with all tags and accessories." },
  like_new: { label: "Like New", desc: "Barely used, zero scratches, fully tested and sanitized." },
  good: { label: "Good Condition", desc: "Minor cosmetic signs of normal student use, 100% fully functional." },
  fair: { label: "Fair Condition", desc: "Noticeable wear but completely operational for coursework." },
};

function ListingDetailPageContent() {
  const params = useParams();
  const router = useRouter();
  const listingId = params?.id as string;

  const {
    listings,
    savedListingIds,
    toggleSaveListing,
    borrowItem,
    bookRental,
    claimGiveaway,
    pickupHubs,
    setActiveTab,
    addToCart,
    setIsCartOpen,
  } = useCampus();

  // Find listing from state
  const listing = useMemo(() => {
    return listings.find((item) => item.id === listingId);
  }, [listings, listingId]);

  // Local interaction states
  const [borrowDays, setBorrowDays] = useState(listing?.maxBorrowDays || 2);
  const [selectedHubId, setSelectedHubId] = useState(listing?.pickupLocationId || "hub-1");
  const [purposeNote, setPurposeNote] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isSaved = listing ? savedListingIds.includes(listing.id) : false;

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <Navbar onOpenAddModal={() => router.push("/")} />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Item Not Found</h1>
          <p className="mt-2 text-slate-500">The requested resource may have been claimed or removed.</p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ffd814] border border-[#fcd200] font-medium text-[#0f1111] hover:bg-[#f7ca00]"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const pickupHub = pickupHubs.find((h) => h.id === selectedHubId) || PICKUP_HUBS[0];
  const isBorrow = listing.transactionType === "borrow";
  const isRent = listing.transactionType === "rent";
  const isGiveaway = listing.transactionType === "giveaway";
  const isExchange = listing.transactionType === "exchange";
  const isSell = listing.transactionType === "sell";

  const totalRentalAmount = isRent ? (listing.rentalRatePerDay || 0) * borrowDays : 0;

  // Handle Borrow / Rent Action
  const handleConfirmAction = () => {
    const today = new Date().toISOString().split("T")[0];
    const endDate = new Date(Date.now() + borrowDays * 86400000).toISOString().split("T")[0];

    if (isBorrow) {
      const result = borrowItem({
        listingId: listing.id,
        startDate: today,
        endDate: endDate,
        pickupHubId: selectedHubId,
      });
      if (result.success && result.booking) {
        setBookingSuccess({ ...result.booking, isBorrow: true });
      }
    } else if (isRent) {
      const result = bookRental({
        listingId: listing.id,
        startDate: today,
        endDate: endDate,
        isGroupRental: false,
        paymentMethod: "demo_sandbox",
        pickupHubId: selectedHubId,
      });
      if (result.success && result.booking) {
        setBookingSuccess({ ...result.booking, isRent: true });
      }
    } else if (isGiveaway) {
      const success = claimGiveaway(listing.id, selectedHubId);
      if (success) {
        setBookingSuccess({
          id: `give-${Date.now()}`,
          isGiveaway: true,
          qrHandoffCode: `FREE-${Math.floor(1000 + Math.random() * 9000)}`,
        });
      }
    } else {
      setBookingSuccess({
        id: `tx-${Date.now()}`,
        qrHandoffCode: `CE-${Math.floor(1000 + Math.random() * 9000)}-HUB`,
        isCustom: true,
      });
    }
  };

  const handleAddToCart = () => {
    addToCart(listing, { rentalDays: borrowDays, pickupHubId: selectedHubId });
  };

  const actionButtonText = isBorrow
    ? "Confirm & Borrow Now (₹0)"
    : isRent
    ? `Confirm & Rent Now (₹${totalRentalAmount})`
    : isGiveaway
    ? "Confirm & Claim Free"
    : isExchange
    ? "Propose Swap"
    : `Buy from Store (₹${listing.price})`;

  return (
    <div className="min-h-screen bg-[#fff5f7]">
      <Navbar onOpenAddModal={() => router.push("/")} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* ── BREADCRUMBS & TOP BAR ── */}
        <div className="flex items-center justify-between gap-3 text-xs text-slate-500 mb-4 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-[#c45500] font-medium flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              Campus Store
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="capitalize">{listing.transactionType}</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-[400px]">
              {listing.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveListing(listing.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                isSaved
                  ? "bg-red-50 border-red-200 text-red-600"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Heart className="h-3.5 w-3.5" fill={isSaved ? "currentColor" : "none"} />
              {isSaved ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        {bookingSuccess ? (
          /* ── SUCCESSFUL BOOKING / BORROW CONFIRMATION ── */
          <div className="max-w-2xl mx-auto my-8 bg-white border border-[#e5e7eb] rounded-2xl p-6 sm:p-10 shadow-lg text-center space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                {isBorrow ? "Free Peer Loan Confirmed" : "Reservation Active"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f1111]">
                {isBorrow ? "Ready for Safe Campus Pickup! 🤝" : "Reservation Confirmed! 📦"}
              </h1>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                You have reserved <span className="font-semibold text-slate-900">"{listing.title}"</span> for{" "}
                <span className="font-semibold text-slate-900">{borrowDays} days</span> from peer student{" "}
                <span className="font-semibold text-slate-900">{listing.seller.name}</span>.
              </p>
            </div>

            {/* Digital Pickup Code Card */}
            <div className="bg-[#f7f7f7] border border-[#d5d9d9] rounded-xl p-5 max-w-sm mx-auto shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Campus Safe Pickup Pass
              </p>
              <div className="bg-white border-2 border-dashed border-teal-500 rounded-lg p-4">
                <p className="font-mono text-2xl font-black text-slate-900 tracking-wider">
                  {bookingSuccess.qrHandoffCode || "CE-9214-SAFE"}
                </p>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Show this digital pass at <span className="font-medium text-slate-800">{pickupHub.name}</span>.
              </p>
            </div>

            {/* Pickup Hub Details */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-left max-w-md mx-auto text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <MapPin className="h-4 w-4 text-teal-600 shrink-0" />
                <span>{pickupHub.name}</span>
              </div>
              <p className="text-slate-600">📍 Landmark: {pickupHub.landmark}</p>
              <p className="text-slate-600">🕒 Hours: {pickupHub.operatingHours}</p>
              <p className="text-emerald-700 font-medium">🛡️ Staffed desk with QR verification</p>
            </div>

            {/* Eco Impact Reward */}
            {listing.ecoCreditsAward > 0 && (
              <div className="flex items-center justify-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-3 max-w-md mx-auto">
                <Leaf className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>+{listing.ecoCreditsAward} Eco-Credits</strong> added to your Campus Green Score!
                </span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  setActiveTab("rentals");
                  router.push("/");
                }}
                className="px-6 py-2.5 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] font-semibold text-[#0f1111] text-sm shadow-sm"
              >
                View in My Rentals &amp; Loans
              </button>
              <Link
                href="/"
                className="px-6 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 font-semibold text-slate-700 text-sm"
              >
                Explore More Items
              </Link>
            </div>
          </div>
        ) : (
          /* ── MAIN PRODUCT DISPLAY (AMAZON 3-COLUMN HIERARCHY) ── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* ── LEFT COLUMN: Controlled Image Box & Badges (5 cols) ── */}
            <div className="lg:col-span-5 space-y-4">
              <div className="sticky top-20">
                {/* Image Box */}
                <div className="relative w-full h-[320px] sm:h-[400px] rounded-xl bg-[#f7f7f7] border border-[#e5e7eb] p-6 flex items-center justify-center overflow-hidden shadow-xs">
                  {!imgError ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      onError={() => setImgError(true)}
                      className="max-h-full max-w-full object-contain mx-auto transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="text-center text-slate-400">
                      <span className="text-6xl">📦</span>
                      <p className="mt-2 text-xs">Campus Resource</p>
                    </div>
                  )}

                  {/* Transaction Badge */}
                  <div className="absolute top-3 left-3">
                    {isBorrow && (
                      <span className="text-xs font-bold uppercase tracking-wider bg-emerald-700 text-white px-2.5 py-1 rounded shadow-xs">
                        ₹0 Free Peer Borrow
                      </span>
                    )}
                    {isRent && (
                      <span className="text-xs font-bold uppercase tracking-wider bg-[#0284c7] text-white px-2.5 py-1 rounded shadow-xs">
                        Campus Rental
                      </span>
                    )}
                    {isGiveaway && (
                      <span className="text-xs font-bold uppercase tracking-wider bg-[#d97706] text-white px-2.5 py-1 rounded shadow-xs">
                        Free Gift
                      </span>
                    )}
                  </div>
                </div>

                {/* Eco & Guarantee Badges below image */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                    <Leaf className="h-4 w-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold">+{listing.ecoCreditsAward} Eco-Credits</p>
                      <p className="text-[11px] text-emerald-600">Saves ~{listing.co2SavedKg} kg CO₂</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800">
                    <ShieldCheck className="h-4 w-4 text-teal-600 shrink-0" />
                    <div>
                      <p className="font-bold">Student Verified</p>
                      <p className="text-[11px] text-teal-600">Safe Hub Handoff</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── CENTER COLUMN: Product Info & Details (4 cols) ── */}
            <div className="lg:col-span-4 space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#0f1111] leading-snug">
                  {listing.title}
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Listed by{" "}
                  <button
                    onClick={() => setChatOpen(true)}
                    className="text-[#007185] hover:underline font-semibold"
                  >
                    {listing.seller.name}
                  </button>{" "}
                  • {listing.seller.college}
                </p>
              </div>

              {/* Rating Row */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-4 w-4 ${
                        s <= Math.floor(listing.rating || 5)
                          ? "text-[#de7921] fill-[#de7921]"
                          : "text-slate-200 fill-slate-100"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-slate-900 text-sm">{listing.rating?.toFixed(1) || "5.0"}</span>
                <span className="text-[#007185] hover:underline cursor-pointer">
                  ({listing.reviewsCount || 34} verified student borrows)
                </span>
              </div>

              {/* Price Row in Rupees */}
              <div className="border-b border-slate-200 pb-3">
                <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">
                  Student Rate
                </p>
                {isBorrow ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-[#0f1111] tracking-tight">₹0</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      100% Free Peer Loan
                    </span>
                  </div>
                ) : isRent ? (
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-[#0f1111] tracking-tight">
                      ₹{listing.rentalRatePerDay}
                    </span>
                    <span className="text-sm text-slate-500">/day</span>
                    {listing.rentalDeposit && (
                      <span className="text-xs text-slate-400 ml-2">
                        (+₹{listing.rentalDeposit} deposit)
                      </span>
                    )}
                  </div>
                ) : isGiveaway ? (
                  <span className="text-3xl font-black text-emerald-600">FREE GIVEAWAY</span>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <span className="text-4xl font-black text-[#0f1111] tracking-tight">₹{listing.price}</span>
                    <span className="text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md">
                      🏪 Campus Store
                    </span>
                  </div>
                )}
              </div>

              {/* Condition Section */}
              <div className="space-y-1.5 text-xs">
                <p className="font-bold text-slate-800">Condition:</p>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="font-bold text-slate-900">
                    {CONDITION_INFO[listing.condition]?.label || "Good Condition"}
                  </p>
                  <p className="text-slate-600 mt-0.5">
                    {CONDITION_INFO[listing.condition]?.desc || "Tested and verified for student use."}
                  </p>
                </div>
              </div>

              {/* Course relevance */}
              {listing.courseRelevant && (
                <div className="p-2.5 rounded-lg bg-teal-50/70 border border-teal-100 text-xs text-teal-800">
                  <p className="font-bold flex items-center gap-1.5">
                    📚 Course Relevance
                  </p>
                  <p className="text-teal-700 mt-0.5">
                    Recommended for <span className="font-semibold">{listing.courseRelevant}</span>
                    {listing.semesterRelevant ? ` (Semester ${listing.semesterRelevant})` : ""}
                  </p>
                </div>
              )}

              {/* Description */}
              <div className="space-y-1 text-xs text-slate-700">
                <p className="font-bold text-slate-800">Item Details:</p>
                <p className="leading-relaxed bg-white border border-slate-200 p-3 rounded-lg text-slate-600">
                  {listing.description}
                </p>
              </div>

              {/* Lender Card */}
              <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={listing.seller.avatar}
                      alt={listing.seller.name}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-teal-100"
                    />
                    <div>
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                        {listing.seller.name}
                        {listing.seller.isVerified && <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500">{listing.seller.course}</p>
                    </div>
                  </div>
                  <div className="text-right text-[11px]">
                    <p className="font-bold text-teal-700">{listing.seller.trustScore}% Trust</p>
                    <p className="text-slate-400">Verified Peer</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setChatOpen(true)}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-teal-600" />
                  Chat with {listing.seller.name.split(" ")[0]}
                </button>
              </div>
            </div>

            {/* ── RIGHT COLUMN: Amazon "Buy Box" / Borrow Now Checkout (3 cols) ── */}
            <div className="lg:col-span-3">
              <div className="sticky top-20 rounded-xl border border-[#d5d9d9] bg-white p-4 sm:p-5 shadow-xs space-y-4">
                {/* Price headline in buybox in Rupees */}
                <div>
                  <span className="text-2xl font-black text-[#0f1111]">
                    {isBorrow
                      ? "₹0"
                      : isRent
                      ? `₹${totalRentalAmount}`
                      : isGiveaway
                      ? "FREE"
                      : `₹${listing.price}`}
                  </span>
                  <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                    {isBorrow
                      ? "Free Student Loan"
                      : isRent
                      ? `(₹${listing.rentalRatePerDay}/day × ${borrowDays}d)`
                      : isGiveaway
                      ? "100% Free Gift"
                      : "🏪 Sold via Campus Store"}
                  </p>
                </div>

                {/* In stock / availability */}
                <div className="text-xs space-y-1">
                  <p className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Available for Immediate Handoff
                  </p>
                  <p className="text-slate-500">
                    Pickup: <span className="font-semibold text-slate-800">{pickupHub.zone}</span>
                  </p>
                </div>

                {/* Duration selector for borrow / rent */}
                {(isBorrow || isRent) && (
                  <div className="space-y-1.5 pt-1 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span>Rental / Borrow Duration:</span>
                      <span className="text-teal-700 font-extrabold">{borrowDays} {borrowDays === 1 ? "day" : "days"}</span>
                    </label>
                    <div className="grid grid-cols-4 gap-1">
                      {[1, 2, 3, 5].map((days) => (
                        <button
                          key={days}
                          type="button"
                          onClick={() => setBorrowDays(days)}
                          className={`py-1 text-xs font-semibold rounded-md border transition-all ${
                            borrowDays === days
                              ? "bg-teal-50 border-teal-600 text-teal-800"
                              : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          {days}d
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Campus Hub Selector */}
                <div className="space-y-1.5 pt-1 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-500" />
                    Pickup Location:
                  </label>
                  <select
                    value={selectedHubId}
                    onChange={(e) => setSelectedHubId(e.target.value)}
                    className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:border-teal-500 focus:outline-none"
                  >
                    {pickupHubs.map((hub) => (
                      <option key={hub.id} value={hub.id}>
                        {hub.name.split("(")[0].trim()} ({hub.zone})
                      </option>
                    ))}
                  </select>
                </div>

                {/* ── BIG YELLOW ACTION BUTTON ── */}
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={handleConfirmAction}
                    className="w-full py-2.5 px-4 text-sm font-semibold text-[#0f1111] rounded-full shadow-xs hover:shadow transition-all text-center flex items-center justify-center gap-1.5 active:scale-[0.99]"
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
                    <CheckCircle2 className="h-4 w-4 text-[#0f1111]" />
                    <span>{actionButtonText}</span>
                  </button>

                  {/* Add to Cart button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-[#0f1111] rounded-full border border-amber-300 bg-amber-100/70 hover:bg-amber-200 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChatOpen(true)}
                    className="w-full py-2 px-3 text-xs font-medium text-[#0f1111] rounded-full border border-[#d5d9d9] bg-[#f0f2f2] hover:bg-[#e3e6e6] transition-all flex items-center justify-center gap-1"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-slate-600" />
                    <span>Ask Lender a Question</span>
                  </button>
                </div>

                {/* Security Guarantee */}
                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 space-y-1">
                  <div className="flex items-center gap-1 text-slate-700 font-semibold">
                    <Lock className="h-3 w-3 text-teal-600" />
                    <span>CampusExchange Safe Handoff</span>
                  </div>
                  <p className="leading-snug">
                    Pick up in-person with your digital pass at verified campus safe desks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Chat Drawer */}
      <ChatDrawer
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        sellerId={listing.seller.id}
        listingId={listing.id}
      />
    </div>
  );
}

export default function ListingDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-8 text-slate-500 text-sm">
          Loading item details...
        </div>
      }
    >
      <ListingDetailPageContent />
    </Suspense>
  );
}
