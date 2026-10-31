"use client";

import React, { useState } from "react";
import { useCampus } from "@/context/CampusContext";
import {
  Sparkles,
  ShieldCheck,
  Award,
  Leaf,
  PlusCircle,
  CheckCircle2,
  Gift,
  Coffee,
  Zap,
  Timer,
  QrCode,
  RotateCcw,
  AlertTriangle,
  Ban,
  ArrowRight,
  X,
  Check,
  ChevronRight,
  Info,
  Scale,
  Users,
  Percent,
} from "lucide-react";

interface KarmaGuidelinesViewProps {
  isModal?: boolean;
  onClose?: () => void;
}

export default function KarmaGuidelinesView({
  isModal = false,
  onClose,
}: KarmaGuidelinesViewProps) {
  const { currentUser, setActiveTab } = useCampus();

  // Interactive points simulator state for students
  const [simListings, setSimListings] = useState(4);
  const [simRentals, setSimRentals] = useState(6);
  const calculatedPoints = simListings * 3 + simRentals * 5;
  const milestoneReached = calculatedPoints >= 50;

  // Track user's actual progress towards 50 Karma points
  const userCurrentKarma = currentUser.greenScore || 35;
  const progressPercent = Math.min(100, Math.round((userCurrentKarma / 50) * 100));

  const content = (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* ── 1. Header & Overview ── */}
      <div className="relative overflow-hidden rounded-3xl border border-pink-200/90 bg-gradient-to-br from-[#FFFBEB] via-[#FFF7ED] to-[#FCE7F3] p-6 sm:p-10 shadow-sm">
        {/* Subtle decorative background circles */}
        <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-pink-200/40 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-amber-200/40 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-300/80 bg-white/90 px-3.5 py-1 text-xs font-bold text-[#BE185D] shadow-2xs backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5 text-pink-500 animate-pulse" />
              <span>Official Campus Marketplace Guidelines</span>
            </div>

            {/* Title & Subtitle */}
            <h1 className="font-display text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Campus Karma & Eco-Credits Policy
            </h1>
            <p className="text-sm sm:text-base font-semibold text-[#DB2777]">
              How you earn trust, unlock rewards, and protect our circular campus ecosystem.
            </p>

            {/* Brief Intro */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal pt-1">
              Karma Points reflect your <strong className="text-slate-800">peer trust rating</strong>,{" "}
              <strong className="text-slate-800">sustainability impact</strong>, and{" "}
              <strong className="text-slate-800">active campus participation</strong>. By sharing, renting,
              and borrowing responsibly, you build an unforgeable campus reputation while keeping valuable
              study resources and equipment out of landfills.
            </p>
          </div>

          {/* Student's Current Karma Snapshot */}
          <div className="shrink-0 rounded-2xl border border-pink-200 bg-white/95 p-5 shadow-sm backdrop-blur-md min-w-[240px]">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <span>Your Karma Balance</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{userCurrentKarma}</span>
              <span className="text-xs font-bold text-pink-600">Karma Points</span>
            </div>

            {/* Progress to 50 Milestone */}
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 mb-1">
                <span>50-Point Campus Drop:</span>
                <span className="font-bold text-slate-800">{userCurrentKarma}/50 Pts</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                Verified Student ID Active
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Earning Structure (Values & Milestones) ── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <span>Earning Structure & Point Values</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Points are awarded automatically upon algorithmic verification of mutual student actions.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 self-start sm:self-auto">
            <Zap className="h-3.5 w-3.5 text-amber-600" />
            Instant Crediting
          </span>
        </div>

        {/* 3 Core Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Rule 1: Item Listing */}
          <div className="group rounded-2xl border border-pink-100 bg-white p-5 shadow-xs hover:shadow-md hover:border-pink-300 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
                  <PlusCircle className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#fde047] border border-[#fef08a] px-3 py-1 text-xs font-black text-[#78350f]">
                  +3 Karma
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Item Listing / Dedication</h3>
                <p className="text-xs font-medium text-amber-800 mt-0.5">
                  Per verified item listed or dedicated to pool
                </p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Add an active pre-loved textbook, scientific calculator, lab coat, or craft to the campus
                repository. Points credit once the item passes automated spam & relevance checks.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
              <span>Action: Post New Listing</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            </div>
          </div>

          {/* Rule 2: Completed Purchase / Rental */}
          <div className="group rounded-2xl border border-pink-100 bg-white p-5 shadow-xs hover:shadow-md hover:border-pink-300 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 border border-pink-200 text-pink-700">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-pink-100 border border-pink-300 px-3 py-1 text-xs font-black text-pink-900">
                  +5 Karma
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Completed Purchase / Rental</h3>
                <p className="text-xs font-medium text-pink-800 mt-0.5">
                  Upon successful handoff and verified return
                </p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Earned after finishing an entire transaction cycle. For rentals and borrows, points trigger
                only after both students complete return verification with zero damage flags.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
              <span>Action: Verified Handoff Cycle</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            </div>
          </div>

          {/* Milestone Card: 50 Karma Points */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-[#FFFBEB] via-[#FEF9C3]/70 to-[#FCE7F3] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="absolute top-2 right-2">
              <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-xs">
                  <Gift className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-3 py-1 text-xs font-black text-white shadow-2xs">
                  Milestone Reward
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                  50 Karma Points Threshold
                </h3>
                <p className="text-xs font-semibold text-amber-900 mt-0.5">
                  Unlocks exclusive campus incentives & perks
                </p>
              </div>

              {/* Specific reward bullet points */}
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Coffee className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                  <span><strong>Canteen Discount Coupons</strong> (Campus cafes)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Gift className="h-3.5 w-3.5 text-pink-700 shrink-0" />
                  <span><strong>Sponsored Giveaways</strong> (Tech & stationery)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span><strong>Freebie Drop Pass</strong> (First dibs on campus gifts)</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-200/70 flex items-center justify-between text-[11px] font-bold text-amber-900">
              <span>Automated Coupon Drop</span>
              <span>Unlocked in App</span>
            </div>
          </div>
        </div>

        {/* Interactive Student Karma Calculator */}
        <div className="rounded-2xl border border-amber-200/80 bg-white p-5 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Interactive Student Simulator
              </span>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                Calculate your Karma Earnings & Milestone ETA
              </h4>
              <p className="text-xs text-slate-500">
                Estimate how many items you need to share or borrow to unlock the 50-point incentives.
              </p>
            </div>

            {/* Slider Controls */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="space-y-1 min-w-[130px]">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Listings (+3):</span>
                  <span className="font-bold text-amber-700">{simListings}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={simListings}
                  onChange={(e) => setSimListings(parseInt(e.target.value) || 0)}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1 min-w-[130px]">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Rentals (+5):</span>
                  <span className="font-bold text-pink-700">{simRentals}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={simRentals}
                  onChange={(e) => setSimRentals(parseInt(e.target.value) || 0)}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </div>

              {/* Output Result */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-center min-w-[110px]">
                <div className="text-[10px] font-bold uppercase text-slate-500">Total Karma</div>
                <div className="text-lg font-black text-slate-900">{calculatedPoints} pts</div>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${
                    milestoneReached
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {milestoneReached ? "🎉 Perks Unlocked!" : `${50 - calculatedPoints} pts to Perks`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Integrity & Algorithmic Guardrails ── */}
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800 border border-blue-200">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
            <span>Anti-Fraud & Algorithmic Verification</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900">
            Integrity & Algorithmic Guardrails
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            To ensure genuine sustainability and equal access, three algorithmic guardrails safeguard point issuance.
          </p>
        </div>

        {/* Structured 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Guardrail 1: Velocity Capping */}
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50/40 to-white p-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <Timer className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-2 py-0.5">
                  Guardrail 1
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Velocity Capping</h3>
                <p className="text-xs font-semibold text-blue-700 mt-0.5">
                  14-Day Rolling Interaction Limit
                </p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Users can only earn points once per unique peer interaction within any rolling 14-day window.
                This prevents circular farming, repetitive dummy swaps, or collusion between roommates.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-100/70 text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Check className="h-3.5 w-3.5 text-blue-500" />
              <span>Prevents circular peer farming</span>
            </div>
          </div>

          {/* Guardrail 2: Verified Physical Handoff */}
          <div className="rounded-2xl border border-purple-100 bg-gradient-to-b from-purple-50/40 to-white p-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                  <QrCode className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 rounded-md px-2 py-0.5">
                  Guardrail 2
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Verified Physical Handoff</h3>
                <p className="text-xs font-semibold text-purple-700 mt-0.5">
                  Dual OTP / Safe-Desk QR Scan
                </p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Points trigger only when both lender and borrower confirm the in-person exchange via one-time dual
                OTP entry or QR code scan at designated campus pickup zones (Hostel Desks, Central Library, or Student Union).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-100/70 text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Check className="h-3.5 w-3.5 text-purple-500" />
              <span>Verifies in-person item custody</span>
            </div>
          </div>

          {/* Guardrail 3: Substantive Cycle Thresholds */}
          <div className="rounded-2xl border border-teal-100 bg-gradient-to-b from-teal-50/40 to-white p-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-200 rounded-md px-2 py-0.5">
                  Guardrail 3
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Substantive Cycle Thresholds</h3>
                <p className="text-xs font-semibold text-teal-700 mt-0.5">
                  Full Return & Mutual Peer Review
                </p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Points are strictly issued upon fully completed, verified, and mutual peer-reviewed return cycles—never
                on simple booking clicks, temporary holds, or reserved carts.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-teal-100/70 text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Check className="h-3.5 w-3.5 text-teal-500" />
              <span>Guarantees verified item completion</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Fair Play & Violation Consequences (Warning Box) ── */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-red-200 bg-gradient-to-r from-red-50 via-rose-50/60 to-amber-50/50 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 border border-red-300 text-red-700 shadow-2xs">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-600 text-white">
                Zero Tolerance Policy
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Fair Play & Violation Consequences
              </h3>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 space-y-2 leading-relaxed">
              <p>
                CampusExchange maintains a <strong className="text-red-900 font-bold">strict zero-tolerance policy</strong> for
                bad-faith transactions, dummy accounts, circular trading, or item tampering.
              </p>
              <p className="bg-white/80 border border-red-200/80 rounded-xl p-3 text-red-950 font-medium text-xs">
                ⚠️ <strong>Administrative Action:</strong> Violations, gaming attempts, and fraud are subject to
                immediate disciplinary action by the Campus Ecosystem Management team, resulting in{" "}
                <span className="underline decoration-red-400 font-bold">immediate Karma forfeiture</span>,{" "}
                <span className="underline decoration-red-400 font-bold">platform suspension</span>, and{" "}
                <span className="underline decoration-red-400 font-bold">
                  escalation to student administrative oversight
                </span>.
              </p>
            </div>

            {/* Quick Actions / Disclaimers */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <span className="font-medium text-slate-500">
                Notice suspicious transactions or artificial point inflation?
              </span>
              <button
                onClick={() => alert("Thank you. Our student integrity team will review flagged interactions within 2 hours.")}
                className="text-red-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Report to Campus Integrity Desk</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer / Navigation Actions ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-200">
        <p className="text-xs text-slate-500">
          Last updated: Academic Year 2026 • Verified Circular Campus Program
        </p>
        <div className="flex items-center gap-3">
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Close
            </button>
          )}
          <button
            onClick={() => {
              if (onClose) onClose();
              setActiveTab("greenscore");
            }}
            className="px-5 py-2 rounded-full bg-amber-300 hover:bg-amber-400 text-slate-900 font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>View Eco-Credits Leaderboard</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  // If opened as a modal, wrap in full backdrop
  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <div className="relative w-full max-w-5xl rounded-3xl bg-[#f8fafc] border border-pink-200 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close guidelines"
              className="absolute top-5 right-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer shadow-xs"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {content}
        </div>
      </div>
    );
  }

  // Normal view page
  return content;
}
