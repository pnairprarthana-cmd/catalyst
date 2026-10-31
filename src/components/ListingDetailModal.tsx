"use client";

import React, { useState, useEffect } from "react";
import { Listing } from "@/types";
import { useCampus } from "@/context/CampusContext";
import {
  X,
  ShieldCheck,
  Leaf,
  Calendar,
  MapPin,
  MessageSquare,
  CheckCircle2,
  HandHelping,
  Star,
  Heart,
  Flag,
  Clock,
  Users,
  QrCode,
  ArrowRight,
} from "lucide-react";

interface ListingDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
  onOpenChat: (sellerId: string, listingId: string) => void;
}

export default function ListingDetailModal({ listing, onClose, onOpenChat }: ListingDetailModalProps) {
  const { pickupHubs, bookRental, borrowItem, checkRentalAvailability, claimGiveaway, reportContent, savedListingIds, toggleSaveListing } = useCampus();

  const [startDate, setStartDate] = useState("2026-11-05");
  const [endDate, setEndDate] = useState("2026-11-08");
  const [borrowDays, setBorrowDays] = useState(2);
  const [isGroupRental, setIsGroupRental] = useState(false);
  const [groupSlots, setGroupSlots] = useState(3);
  const [selectedHubId, setSelectedHubId] = useState(listing?.pickupLocationId || pickupHubs[0]?.id || "hub-1");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cash_handoff" | "demo_sandbox">("upi");
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState("");

  useEffect(() => {
    try {
      const now = new Date();
      setStartDate(new Date(now.getTime() + 86400000).toISOString().split("T")[0]);
      setEndDate(new Date(now.getTime() + 86400000 * 4).toISOString().split("T")[0]);
    } catch {}
  }, []);

  if (!listing) return null;

  const isBorrow = listing.transactionType === "borrow";
  const isRent = listing.transactionType === "rent";
  const isGiveaway = listing.transactionType === "giveaway";
  const isSell = listing.transactionType === "sell";
  const isSaved = savedListingIds.includes(listing.id);

  const start = new Date(startDate);
  const end = new Date(endDate);
  const rentalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1);
  const dailyRate = listing.rentalRatePerDay || 5;
  const subtotal = rentalDays * dailyRate;
  const deposit = listing.rentalDeposit || 20;
  const totalDue = subtotal + deposit;
  const splitShare = Math.round(totalDue / groupSlots);
  const isAvailable = isBorrow ? true : checkRentalAvailability(listing.id, startDate, endDate);

  const handleConfirmBorrow = () => {
    setBookingError(null);
    const returnDate = new Date(Date.now() + 86400000 * borrowDays).toISOString().split("T")[0];
    const result = borrowItem({ listingId: listing.id, endDate: returnDate, pickupHubId: selectedHubId });
    if (result.success && result.booking) setBookingSuccess({ ...result.booking, isBorrow: true });
    else setBookingError(result.error || "Failed to borrow item.");
  };

  const handleBookRental = () => {
    setBookingError(null);
    if (!isAvailable) { setBookingError("These dates conflict with an existing reservation. Please pick alternative dates."); return; }
    const result = bookRental({ listingId: listing.id, startDate, endDate, isGroupRental, groupSlots, paymentMethod, pickupHubId: selectedHubId });
    if (result.success && result.booking) setBookingSuccess(result.booking);
    else setBookingError(result.error || "Failed to book rental.");
  };

  const handleClaimFree = () => {
    if (claimGiveaway(listing.id, selectedHubId)) setBookingSuccess({ id: `give-${Date.now()}`, status: "confirmed", isGiveaway: true });
  };

  const handleReport = () => {
    if (reportReason.trim()) { reportContent("listing", listing.id, reportReason); setIsReporting(false); setReportReason(""); }
  };

  const selectedHub = pickupHubs.find((h) => h.id === selectedHubId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto slide-up sm:fade-in-up">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
          <div className="flex items-center gap-2">
            {isBorrow && <span className="tag-free">Free Borrow</span>}
            {isRent && <span className="tag-rent">Rental</span>}
            {isGiveaway && <span className="tag-free-gift">Free Gift</span>}
            {isSell && <span className="tag-buy">Buy</span>}
            <span className="text-sm font-bold text-slate-900 truncate max-w-[220px] sm:max-w-none">{listing.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveListing(listing.id)}
              className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${isSaved ? "bg-red-500 border-red-500 text-white" : "border-slate-200 text-slate-400 hover:text-red-400"}`}
            >
              <Heart className="h-3.5 w-3.5" fill={isSaved ? "currentColor" : "none"} />
            </button>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {bookingSuccess ? (
          /* ── Confirmation ── */
          <div className="px-5 py-10 text-center space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                {bookingSuccess.isBorrow ? "Borrowed for Free! 🤝" : bookingSuccess.isGiveaway ? "Claimed! 🎉" : "Reservation Confirmed! 📦"}
              </h2>
              <p className="mt-1.5 text-sm text-slate-500 max-w-sm mx-auto">
                {bookingSuccess.isBorrow
                  ? `You have ${borrowDays}-day free borrow of "${listing.title}". Meet at ${selectedHub?.name || "the pickup hub"}.`
                  : `Your reservation for "${listing.title}" is confirmed.`}
              </p>
            </div>
            {bookingSuccess.qrHandoffCode && (
              <div className="mx-auto max-w-xs rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Campus Safe Pickup Code</p>
                <div className="rounded-lg bg-white border border-slate-200 p-3 inline-block shadow-sm">
                  <p className="font-mono text-lg font-extrabold text-slate-900 tracking-widest">{bookingSuccess.qrHandoffCode}</p>
                </div>
                <p className="mt-2 text-[11px] text-slate-400">Show this code at the campus safe desk</p>
              </div>
            )}
            <div className="flex items-center justify-center gap-2">
              <span className="eco-badge"><Leaf className="h-2.5 w-2.5" />+{listing.ecoCreditsAward} Eco-Credits earned</span>
            </div>
            <button onClick={onClose} className="ce-btn-primary mx-auto">Done — View in Rentals</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {/* Left: Image + Seller */}
            <div className="p-5 space-y-4 border-b sm:border-b-0 sm:border-r border-slate-100">
              {/* Image */}
              <div className="h-[240px] overflow-hidden rounded-xl bg-[#f7f7f7] border border-slate-100 flex items-center justify-center p-4">
                <img src={listing.images[0]} alt={listing.title} className="max-h-full max-w-full object-contain mx-auto" />
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {isBorrow ? "Peer Loan" : isRent ? "Daily Rate" : isGiveaway ? "Donation" : "Purchase Price"}
                  </p>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {isBorrow ? <span className="text-teal-600">Free (₹0)</span> : isRent ? <span>₹{listing.rentalRatePerDay}<span className="text-sm font-normal text-slate-400">/day</span></span> : isGiveaway ? <span className="text-teal-600">Free</span> : <span>₹{listing.price}</span>}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((s) => <Star key={s} className={`h-3.5 w-3.5 ${s <= Math.floor(listing.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />)}
                  </div>
                  <p className="text-[11px] text-slate-400">{listing.rating.toFixed(1)} · {listing.reviewsCount} reviews</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-[13px] text-slate-600 leading-relaxed">{listing.description}</p>

              {/* Eco */}
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-100 p-2.5">
                <Leaf className="h-4 w-4 text-emerald-500 shrink-0" />
                <p className="text-[11px] text-emerald-700 leading-snug">
                  Reusing this item saves ~{listing.co2SavedKg} kg CO₂. You'll earn +{listing.ecoCreditsAward} Eco-Credits.
                </p>
              </div>

              {/* Seller */}
              <div className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <img src={listing.seller.avatar} alt={listing.seller.name} className="h-9 w-9 rounded-full object-cover ring-2 ring-teal-100" />
                    <div>
                      <div className="flex items-center gap-1 text-[13px] font-bold text-slate-900">
                        {listing.seller.name}
                        {listing.seller.isVerified && <ShieldCheck className="h-3.5 w-3.5 text-teal-500" />}
                      </div>
                      <p className="text-[11px] text-slate-400">{listing.seller.course.split(" ")[0]}</p>
                    </div>
                  </div>
                  <div className="text-right text-[11px]">
                    <p className="font-bold text-teal-700">{listing.seller.trustScore}% Trust</p>
                    <p className="text-slate-400">{listing.seller.returnPunctuality}% Punctual</p>
                  </div>
                </div>
                <button
                  onClick={() => { onOpenChat(listing.seller.id, listing.id); onClose(); }}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <MessageSquare className="h-4 w-4 text-teal-500" />
                  Message {listing.seller.name.split(" ")[0]}
                </button>
              </div>
            </div>

            {/* Right: Action Panel */}
            <div className="p-5 space-y-4">
              {/* Pickup hub picker */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Campus Pickup Hub</label>
                <select
                  value={selectedHubId}
                  onChange={(e) => setSelectedHubId(e.target.value)}
                  className="ce-input"
                >
                  {pickupHubs.map((h) => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
                {selectedHub && (
                  <p className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />{selectedHub.operatingHours}
                    {selectedHub.securityStaffPresent && <span className="text-teal-600">· Secured</span>}
                  </p>
                )}
              </div>

              {/* BORROW */}
              {isBorrow && (
                <div className="space-y-3 rounded-xl border border-teal-200 bg-teal-50/50 p-4">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-teal-700">
                    <HandHelping className="h-4 w-4" /> Free Peer Borrow
                  </div>
                  <p className="text-[12px] text-slate-600">{listing.seller.name.split(" ")[0]} is lending this for free. Return within {listing.maxBorrowDays || 2} days.</p>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Borrow Duration</label>
                    <select value={borrowDays} onChange={(e) => setBorrowDays(Number(e.target.value))} className="ce-input">
                      {[1,2,3].map((d) => (
                        <option key={d} value={d}>{d} Day{d > 1 ? "s" : ""}{d === 1 ? " (return tomorrow)" : d === 2 ? " (short use)" : " (exam week)"}</option>
                      ))}
                    </select>
                  </div>
                  {bookingError && <p className="text-xs text-red-500 bg-red-50 rounded-lg p-2">{bookingError}</p>}
                  <button onClick={handleConfirmBorrow} className="w-full ce-btn-primary justify-center py-2.5">
                    Confirm Borrow — ₹0 Free
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* RENT */}
              {isRent && (
                <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                    <Calendar className="h-4 w-4 text-blue-500" /> Rental Dates
                    <span className="ml-auto text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{rentalDays} days</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">Start</label>
                      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="ce-input text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">End</label>
                      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="ce-input text-sm" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="group-rental" checked={isGroupRental} onChange={(e) => setIsGroupRental(e.target.checked)} className="rounded" />
                    <label htmlFor="group-rental" className="text-[12px] text-slate-600 font-medium cursor-pointer">Split with group?</label>
                    {isGroupRental && (
                      <input type="number" min={2} max={6} value={groupSlots} onChange={(e) => setGroupSlots(Number(e.target.value))} className="w-14 ce-input text-xs text-center" />
                    )}
                  </div>

                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-[12px] space-y-1">
                    <div className="flex justify-between"><span className="text-slate-500">Rental ({rentalDays}d × ₹{dailyRate})</span><span className="font-semibold">₹{subtotal}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Refundable deposit</span><span className="font-semibold">₹{deposit}</span></div>
                    <div className="ce-divider" />
                    <div className="flex justify-between font-bold text-slate-900"><span>Total due</span><span className="text-teal-700">₹{totalDue}</span></div>
                    {isGroupRental && <div className="flex justify-between text-teal-600 font-bold"><span>Your share ({groupSlots} students)</span><span>₹{splitShare}</span></div>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Payment Method</label>
                    <div className="flex gap-2 text-[12px]">
                      {(["upi", "cash_handoff"] as const).map((m) => (
                        <button key={m} onClick={() => setPaymentMethod(m)} className={`flex-1 rounded-lg border py-1.5 font-semibold transition-all ${paymentMethod === m ? "border-teal-400 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-500"}`}>
                          {m === "upi" ? "UPI / QR" : "Cash on Pickup"}
                        </button>
                      ))}
                    </div>
                    {paymentMethod === "upi" && <p className="text-[10px] text-amber-600 mt-1">⚠ UPI payment gateway requires configuration. Demo only.</p>}
                  </div>

                  {!isAvailable && <p className="text-xs text-red-500 bg-red-50 rounded-lg p-2">⚠ These dates conflict with an existing booking. Choose different dates.</p>}
                  {bookingError && <p className="text-xs text-red-500 bg-red-50 rounded-lg p-2">{bookingError}</p>}

                  <button onClick={handleBookRental} disabled={!isAvailable} className={`w-full ce-btn-primary justify-center py-2.5 ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}>
                    Reserve Now — ₹{isGroupRental ? splitShare : totalDue}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* GIVEAWAY */}
              {isGiveaway && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 space-y-3">
                  <p className="text-sm font-bold text-amber-800">Free Community Donation 🎁</p>
                  <p className="text-[12px] text-slate-600">Claim this for free. Collect at the selected campus hub.</p>
                  <button onClick={handleClaimFree} className="w-full ce-btn-primary justify-center py-2.5" style={{ background: "#d97706" }}>
                    Claim for Free
                  </button>
                </div>
              )}

              {/* BUY */}
              {isSell && (
                <div className="rounded-xl border border-slate-200 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <span>Campus Store Purchase</span>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">Store</span>
                    </span>
                    <span className="text-xl font-extrabold text-slate-900">₹{listing.price}</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Payment Method</label>
                    <div className="flex gap-2 text-[12px]">
                      {(["upi", "cash_handoff"] as const).map((m) => (
                        <button key={m} onClick={() => setPaymentMethod(m)} className={`flex-1 rounded-lg border py-1.5 font-semibold transition-all ${paymentMethod === m ? "border-teal-400 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-500"}`}>
                          {m === "upi" ? "UPI / QR" : "Cash Handoff"}
                        </button>
                      ))}
                    </div>
                    {paymentMethod === "upi" && <p className="text-[10px] text-amber-600 mt-1">⚠ UPI requires gateway configuration. Demo mode.</p>}
                  </div>
                  <button
                    onClick={() => setBookingSuccess({ id: `buy-${Date.now()}`, status: "confirmed", qrHandoffCode: `CX-BUY-${Math.floor(1000 + Math.random() * 9000)}` })}
                    className="w-full ce-btn-primary justify-center py-2.5"
                  >
                    Buy from Store — ₹{listing.price}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Report */}
              <div className="pt-1 border-t border-slate-100">
                <button onClick={() => setIsReporting(!isReporting)} className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-500 transition-colors">
                  <Flag className="h-3 w-3" /> Report this listing
                </button>
                {isReporting && (
                  <div className="mt-2 space-y-2">
                    <input
                      type="text"
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      placeholder="Describe the issue…"
                      className="ce-input text-sm"
                    />
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setIsReporting(false)} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
                      <button onClick={handleReport} className="rounded-lg bg-red-500 px-3 py-1 text-xs font-bold text-white hover:bg-red-600">Submit Report</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
