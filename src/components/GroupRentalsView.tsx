"use client";

import React, { useState } from "react";
import { useCampus } from "@/context/CampusContext";
import {
  Users,
  Calendar,
  Sparkles,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  PlusCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function GroupRentalsView({ onOpenListing }: { onOpenListing: (listing: any) => void }) {
  const { rentals, joinGroupRental, currentUser, listings } = useCampus();

  // Find all active group bookings
  const groupBookings = rentals.filter((r) => r.isGroupRental);

  const [joinedSuccessId, setJoinedSuccessId] = useState<string | null>(null);

  const handleJoin = (rentalId: string) => {
    const success = joinGroupRental(rentalId);
    if (success) {
      setJoinedSuccessId(rentalId);
      setTimeout(() => setJoinedSuccessId(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/50 via-[#0B132B] to-[#111D4A] p-6 lg:p-8">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-300 border border-purple-500/30">
            <Users className="h-3.5 w-3.5" />
            <span>Cooperative Resource Sharing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Group Rentals & Shared Kits
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            High-end cinema cameras, IoT sensor test kits, robotics parts, and surveying tools can be expensive.
            Co-rent them with classmates, split the rental deposit, and collaborate on your campus projects.
          </p>
        </div>
      </div>

      {/* Group Rentals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groupBookings.map((booking) => {
          const totalSlots = booking.groupSlotsTotal || 3;
          const filledSlots = booking.participants?.length || 1;
          const slotsRemaining = totalSlots - filledSlots;
          const perStudentShare = Math.round(booking.totalAmount / totalSlots);
          const hasAlreadyJoined = booking.participants?.some((p) => p.user.id === currentUser.id);

          return (
            <div
              key={booking.id}
              className="glass-card flex flex-col justify-between rounded-2xl border border-white/10 bg-[#111D4A]/60 p-5 transition-all hover:border-purple-500/30"
            >
              <div>
                {/* Media & Tags */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={booking.listing.images[0]}
                    alt={booking.listing.title}
                    className="h-20 w-20 rounded-xl object-cover border border-white/10 shrink-0"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300 border border-purple-500/30">
                        {slotsRemaining > 0 ? `${slotsRemaining} Slots Open` : "Fully Booked"}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {booking.startDate} - {booking.endDate} ({booking.totalDays}d)
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white line-clamp-2">
                      {booking.listing.title}
                    </h3>
                  </div>
                </div>

                {/* Split Calculation Banner */}
                <div className="rounded-xl bg-purple-950/30 p-3 border border-purple-500/20 text-xs space-y-1.5 mb-4">
                  <div className="flex justify-between text-slate-300">
                    <span>Total Booking Cost:</span>
                    <span className="font-bold text-white">₹{booking.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-purple-300 font-bold border-t border-white/10 pt-1">
                    <span>Your Split Share:</span>
                    <span className="text-sm text-cyan-300">₹{perStudentShare} / student</span>
                  </div>
                </div>

                {/* Participants List */}
                <div className="space-y-2 mb-4">
                  <div className="text-[11px] font-bold uppercase text-slate-400">
                    Group Co-Renters ({filledSlots}/{totalSlots})
                  </div>
                  <div className="space-y-1.5">
                    {booking.participants?.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between rounded-lg bg-white/5 p-2 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={p.user.avatar}
                            alt={p.user.name}
                            className="h-5 w-5 rounded-full object-cover"
                          />
                          <span className="text-slate-200 font-semibold">{p.user.name}</span>
                          <span className="text-[10px] text-slate-400">({p.user.course.split(" ")[0]})</span>
                        </div>
                        <span className="text-emerald-400 text-[10px] font-bold">✓ Committed</span>
                      </div>
                    ))}

                    {/* Empty slots representation */}
                    {Array.from({ length: Math.max(0, slotsRemaining) }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg border border-dashed border-white/10 p-2 text-xs text-slate-400"
                      >
                        <span className="italic">Empty Slot {filledSlots + i + 1}</span>
                        <span className="text-cyan-400 font-semibold">Available to Join</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                {hasAlreadyJoined ? (
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 p-2.5 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>You have secured your slot in this shared booking</span>
                  </div>
                ) : slotsRemaining > 0 ? (
                  <button
                    onClick={() => handleJoin(booking.id)}
                    className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-500/20 hover:from-purple-500 hover:to-cyan-400 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Join Shared Booking (₹{perStudentShare})</span>
                  </button>
                ) : (
                  <div className="text-center text-xs text-slate-500 py-2">
                    All group slots filled
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
