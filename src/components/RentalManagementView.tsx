"use client";

import React, { useState } from "react";
import { useCampus } from "@/context/CampusContext";
import { RentalBooking } from "@/types";
import {
  Calendar,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  AlertCircle,
  X,
  CreditCard,
  Banknote,
  ArrowRight,
} from "lucide-react";
import { PICKUP_HUBS } from "@/lib/mockData";

export default function RentalManagementView() {
  const { rentals, verifyQRPickup, confirmRentalReturn, currentUser } = useCampus();

  const [activeTab, setActiveTab] = useState<"active" | "all">("active");
  const [selectedRentalForQR, setSelectedRentalForQR] = useState<RentalBooking | null>(null);
  const [qrInputCode, setQrInputCode] = useState("");
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const myRentals = rentals.filter(
    (r) =>
      r.renter.id === currentUser.id ||
      r.listing.seller.id === currentUser.id ||
      r.participants?.some((p) => p.user.id === currentUser.id)
  );

  const displayedRentals =
    activeTab === "active"
      ? myRentals.filter((r) => r.status === "confirmed" || r.status === "active")
      : myRentals;

  const handleVerifyHandoff = () => {
    if (!selectedRentalForQR) return;
    setVerificationError(null);

    const success = verifyQRPickup(selectedRentalForQR.id, qrInputCode || selectedRentalForQR.qrHandoffCode);
    if (success) {
      setVerificationSuccess(true);
      setTimeout(() => {
        setVerificationSuccess(false);
        setSelectedRentalForQR(null);
        setQrInputCode("");
      }, 1500);
    } else {
      setVerificationError("Invalid QR code or verification string. Please check with the student.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Calendar className="h-6 w-6 text-cyan-400" />
            <span>Rental Management & Safe QR Handoff</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track active reservations, schedule returns, split costs, and verify physical handoffs
          </p>
        </div>

        {/* Tab filters */}
        <div className="flex rounded-xl bg-white/5 p-1 border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("active")}
            className={`rounded-lg px-3 py-1.5 transition-all ${
              activeTab === "active" ? "bg-cyan-500 text-black font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            Active & Upcoming ({myRentals.filter((r) => r.status === "confirmed" || r.status === "active").length})
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`rounded-lg px-3 py-1.5 transition-all ${
              activeTab === "all" ? "bg-cyan-500 text-black font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            All Bookings ({myRentals.length})
          </button>
        </div>
      </div>

      {/* Rentals List */}
      <div className="space-y-4">
        {displayedRentals.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#111D4A]/40 p-8 text-center space-y-2">
            <Calendar className="mx-auto h-8 w-8 text-slate-500" />
            <h3 className="text-sm font-bold text-white">No rental bookings found</h3>
            <p className="text-xs text-slate-400">
              Browse the campus marketplace to rent calculators, lab gear, or textbooks!
            </p>
          </div>
        ) : (
          displayedRentals.map((booking) => {
            const hub = PICKUP_HUBS.find((h) => h.id === booking.pickupLocationId);
            const isRenter = booking.renter.id === currentUser.id;
            const isSeller = booking.listing.seller.id === currentUser.id;

            return (
              <div
                key={booking.id}
                className="glass-card rounded-2xl border border-white/10 bg-[#111D4A]/60 p-5 transition-all hover:border-cyan-500/30"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Item and Period Info */}
                  <div className="flex items-start gap-4">
                    <img
                      src={booking.listing.images[0]}
                      alt={booking.listing.title}
                      className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl object-cover shrink-0 border border-white/10"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                            booking.status === "active"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : booking.status === "confirmed"
                              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                              : booking.status === "returned"
                              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                              : "bg-white/10 text-slate-400"
                          }`}
                        >
                          {booking.status === "confirmed" ? "Upcoming Pickup" : booking.status}
                        </span>

                        {booking.isGroupRental && (
                          <span className="flex items-center gap-1 rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300 border border-purple-500/30">
                            <Users className="h-3 w-3" />
                            Group Split ({booking.participants?.length || 1}/{booking.groupSlotsTotal} slots)
                          </span>
                        )}

                        <span className="text-[11px] text-slate-400">
                          {isRenter ? "You are Renting" : isSeller ? "You are Owner" : "Co-Renter"}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-white">
                        {booking.listing.title}
                      </h3>

                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-cyan-400" />
                          <span>
                            {booking.startDate} to {booking.endDate} ({booking.totalDays} days)
                          </span>
                        </div>
                        {hub && (
                          <div className="flex items-center gap-1 text-slate-400">
                            <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                            <span>{hub.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Financial & Status Actions */}
                  <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 border-t lg:border-t-0 border-white/10 pt-3 lg:pt-0">
                    <div className="text-left lg:text-right">
                      <div className="text-[10px] uppercase text-slate-400 font-semibold">Total Amount</div>
                      <div className="text-base font-extrabold text-cyan-400">
                        ${booking.totalAmount}
                        {booking.depositAmount > 0 && (
                          <span className="text-xs text-slate-400 font-normal ml-1">
                            (+${booking.depositAmount} dep)
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-emerald-400 font-medium">
                        Payment: {booking.paymentStatus.replace("_", " ")}
                      </div>
                    </div>

                    {/* QR Code Trigger or Return Confirm */}
                    <div className="flex items-center gap-2">
                      {!booking.isHandoffVerified ? (
                        <button
                          onClick={() => {
                            setSelectedRentalForQR(booking);
                            setQrInputCode(booking.qrHandoffCode);
                          }}
                          className="flex items-center gap-1.5 rounded-xl bg-cyan-500 px-3.5 py-2 text-xs font-bold text-black shadow-md shadow-cyan-500/20 hover:bg-cyan-400 transition-all cursor-pointer"
                        >
                          <QrCode className="h-4 w-4" />
                          <span>{isRenter ? "Show QR Code" : "Verify Pickup QR"}</span>
                        </button>
                      ) : booking.status === "active" ? (
                        <button
                          onClick={() => confirmRentalReturn(booking.id)}
                          className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-black shadow-md shadow-emerald-500/20 hover:bg-emerald-400 transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Confirm Return & Release Deposit</span>
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-semibold text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-500/20">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Returned Punctually
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Group Co-renters list if group booking */}
                {booking.isGroupRental && booking.participants && (
                  <div className="mt-3 rounded-xl bg-black/30 p-2.5 border border-white/5 text-xs">
                    <div className="flex items-center justify-between text-[11px] font-bold text-purple-300 mb-1.5">
                      <span>Group Split Co-Renters ({booking.participants.length} joined)</span>
                      <span>${booking.participants[0]?.shareAmount} per student</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {booking.participants.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2 py-1 text-[11px] text-slate-300"
                        >
                          <img
                            src={p.user.avatar}
                            alt={p.user.name}
                            className="h-4 w-4 rounded-full object-cover"
                          />
                          <span>{p.user.name}</span>
                          <span className="text-emerald-400 font-bold">✓ Paid</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* QR VERIFICATION MODAL */}
      {selectedRentalForQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-[#0F172A] p-6 shadow-2xl text-center text-slate-200">
            <button
              onClick={() => setSelectedRentalForQR(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {verificationSuccess ? (
              <div className="py-6 space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-base font-bold text-white">Physical Handoff Verified! ✅</h3>
                <p className="text-xs text-slate-300">
                  Equipment released safely. Eco-credits credited to both student passports!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Campus Safe Hub QR Verification</span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">{selectedRentalForQR.listing.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Present this at designated pickup desk or scan with peer
                  </p>
                </div>

                {/* Stylized QR Code Graphic */}
                <div className="mx-auto w-48 h-48 rounded-2xl bg-white p-3 shadow-xl flex flex-col items-center justify-center border border-slate-200">
                  <div className="grid grid-cols-6 gap-1 w-full h-full p-2 bg-slate-950 rounded-lg">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${
                          (i % 2 === 0 && i % 3 === 0) || i === 0 || i === 5 || i === 30 || i === 35
                            ? "bg-cyan-400"
                            : i % 5 === 0
                            ? "bg-emerald-400"
                            : "bg-white"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Alphanumeric code */}
                <div className="rounded-xl bg-white/5 p-2.5 border border-white/10">
                  <div className="text-[10px] uppercase text-slate-400 font-bold">Verification Token</div>
                  <div className="font-mono text-lg font-extrabold text-cyan-300 tracking-wider">
                    {selectedRentalForQR.qrHandoffCode}
                  </div>
                </div>

                {verificationError && (
                  <div className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                    {verificationError}
                  </div>
                )}

                <button
                  onClick={handleVerifyHandoff}
                  className="w-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 py-2.5 text-xs font-bold text-black shadow-lg shadow-emerald-500/20 hover:from-emerald-300 hover:to-cyan-400 transition-all cursor-pointer"
                >
                  Confirm Physical Handover (Scan / Code)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
