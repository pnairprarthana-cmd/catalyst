"use client";

import React, { useState } from "react";
import { useCampus } from "@/context/CampusContext";
import {
  Gift,
  Heart,
  Leaf,
  CheckCircle2,
  Sparkles,
  MapPin,
  ShieldCheck,
  PlusCircle,
  X,
} from "lucide-react";
import { PICKUP_HUBS } from "@/lib/mockData";

export default function GivebackCornerView({ onOpenAddModal }: { onOpenAddModal: () => void }) {
  const { listings, claimGiveaway, pickupHubs, currentUser } = useCampus();

  const [selectedListingForClaim, setSelectedListingForClaim] = useState<any>(null);
  const [selectedHubId, setSelectedHubId] = useState(pickupHubs[0]?.id || "hub-1");
  const [claimSuccess, setClaimSuccess] = useState(false);

  const giveaways = listings.filter((l) => l.transactionType === "giveaway" && l.status === "active");

  const handleClaim = () => {
    if (!selectedListingForClaim) return;
    const success = claimGiveaway(selectedListingForClaim.id, selectedHubId);
    if (success) {
      setClaimSuccess(true);
      setTimeout(() => {
        setClaimSuccess(false);
        setSelectedListingForClaim(null);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/60 via-[#0B132B] to-[#111D4A] p-6 lg:p-8">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
            <Gift className="h-3.5 w-3.5" />
            <span>Zero-Dollar Campus Circulation</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Giveback Corner
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Graduating seniors and generous campus peers pass down usable lab coats, textbooks,
            notes, and hostel dorm essentials for <strong>100% free</strong>. Nothing goes to waste.
          </p>

          <div className="pt-2">
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-xs font-bold text-black shadow-lg shadow-emerald-500/25 hover:bg-emerald-400 transition-all cursor-pointer"
            >
              <Heart className="h-4 w-4" />
              <span>Donate an Item for Free</span>
            </button>
          </div>
        </div>
      </div>

      {/* Giveaways Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {giveaways.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-white/10 bg-[#111D4A]/40 p-8 text-center space-y-2">
            <Gift className="mx-auto h-8 w-8 text-slate-500" />
            <h3 className="text-sm font-bold text-white">All current donations have been claimed!</h3>
            <p className="text-xs text-slate-400">
              Be the first to donate an unused textbook or lab coat to support incoming freshers.
            </p>
          </div>
        ) : (
          giveaways.map((item) => {
            const hub = PICKUP_HUBS.find((h) => h.id === item.pickupLocationId);

            return (
              <div
                key={item.id}
                className="glass-card flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-500/20 bg-[#111D4A]/60 transition-all hover:border-emerald-500/40"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-3 left-3 rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-black text-black uppercase shadow-lg">
                    Free Giveaway
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-emerald-950/90 px-2.5 py-1 text-[11px] font-bold text-emerald-400 border border-emerald-500/40">
                    <Leaf className="h-3 w-3" />
                    <span>+{item.ecoCreditsAward}</span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  {item.courseRelevant && (
                    <div className="text-[11px] font-semibold text-emerald-400 mb-1">
                      {item.courseRelevant}
                    </div>
                  )}

                  <h3 className="text-sm font-bold text-white line-clamp-1">{item.title}</h3>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.seller.avatar}
                        alt={item.seller.name}
                        className="h-6 w-6 rounded-full object-cover ring-1 ring-emerald-400"
                      />
                      <div className="text-xs">
                        <div className="font-semibold text-white">{item.seller.name}</div>
                        <div className="text-[10px] text-slate-400">Donor Scholar</div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedListingForClaim(item)}
                      className="rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-bold text-black shadow-md shadow-emerald-500/20 hover:bg-emerald-400 transition-all cursor-pointer"
                    >
                      Claim Free ($0)
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Claim Modal */}
      {selectedListingForClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm rounded-3xl border border-emerald-500/30 bg-[#0F172A] p-6 shadow-2xl text-center text-slate-200">
            <button
              onClick={() => setSelectedListingForClaim(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {claimSuccess ? (
              <div className="py-6 space-y-3">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Resource Claimed! 🎉</h3>
                <p className="text-xs text-slate-300">
                  Pickup confirmed at safe hub. Please collect punctually to keep the campus circular!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Gift className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">
                    {selectedListingForClaim.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Donated generously by {selectedListingForClaim.seller.name}
                  </p>
                </div>

                <div className="text-left">
                  <label className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block">
                    Choose Safe Pickup Point
                  </label>
                  <select
                    value={selectedHubId}
                    onChange={(e) => setSelectedHubId(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-[#111D4A] p-2 text-xs text-white"
                  >
                    {pickupHubs.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-xl bg-emerald-950/30 p-2.5 text-[11px] text-emerald-300 border border-emerald-500/20">
                  Total price: <strong>$0.00 (Free)</strong>. You will earn +40 Eco-Credits on collection.
                </div>

                <button
                  onClick={handleClaim}
                  className="w-full rounded-full bg-emerald-500 py-2.5 text-xs font-bold text-black shadow-lg shadow-emerald-500/25 hover:bg-emerald-400 transition-all cursor-pointer"
                >
                  Confirm Free Claim
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
