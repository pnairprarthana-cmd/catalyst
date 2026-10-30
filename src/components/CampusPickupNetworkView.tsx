"use client";

import React from "react";
import { useCampus } from "@/context/CampusContext";
import {
  MapPin,
  ShieldCheck,
  Clock,
  QrCode,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Building,
} from "lucide-react";

export default function CampusPickupNetworkView() {
  const { pickupHubs } = useCampus();

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-[#111D4A] via-[#0B132B] to-[#0F172A] p-6 lg:p-8">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/30">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Designated Safe Exchange Locations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Campus Pickup & Safe Hub Network
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Never meet in isolated places or share personal addresses. CampusExchange partners with university administration
            to designate high-visibility, well-lit safe exchange zones with digital QR handoff kiosks and 24/7 security desks.
          </p>
        </div>
      </div>

      {/* Safe Hubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pickupHubs.map((hub) => (
          <div
            key={hub.id}
            className="glass-card rounded-2xl border border-white/10 bg-[#111D4A]/60 p-5 space-y-4 hover:border-cyan-500/30 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">{hub.name}</h3>
                  <div className="text-xs text-slate-400">{hub.zone}</div>
                </div>
              </div>

              <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-300 border border-emerald-500/30 shrink-0">
                {hub.badgeText}
              </span>
            </div>

            <div className="space-y-2 rounded-xl bg-white/5 p-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Building className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>
                  <strong>Landmark:</strong> {hub.landmark}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Hours:</strong> {hub.operatingHours}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Security Desk:</strong>{" "}
                  {hub.securityStaffPresent ? "Staff / Guard Present on Site" : "Open STEM Study Common"}
                </span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-3 text-[11px] text-slate-300">
              <span className="font-bold text-slate-200">Pickup Instructions: </span>
              {hub.instructions}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>{hub.activeExchangesCount} safe exchanges completed today</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> QR Scanner Ready
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* QR Handoff Protocol Card */}
      <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-5 sm:p-6 text-xs text-slate-300 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <QrCode className="h-4 w-4 text-cyan-400" />
          <span>How the 3-Step QR Safe Handoff Works</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="rounded-xl bg-white/5 p-3 space-y-1">
            <div className="font-bold text-cyan-300">1. Reserve & Schedule</div>
            <p className="text-[11px] text-slate-400">
              Student locks reservation and selects a designated Safe Hub. Both receive digital tokens.
            </p>
          </div>

          <div className="rounded-xl bg-white/5 p-3 space-y-1">
            <div className="font-bold text-cyan-300">2. Physical Meet & Inspection</div>
            <p className="text-[11px] text-slate-400">
              Meet at the safe hub desk. Inspect equipment condition, textbooks, or notes together.
            </p>
          </div>

          <div className="rounded-xl bg-white/5 p-3 space-y-1">
            <div className="font-bold text-cyan-300">3. Scan QR to Seal</div>
            <p className="text-[11px] text-slate-400">
              Buyer/Renter shows QR code. Owner verifies it to release deposit, record transfer, and credit GreenScore!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
