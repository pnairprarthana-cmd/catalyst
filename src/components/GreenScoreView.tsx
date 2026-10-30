"use client";

import React, { useState } from "react";
import { useCampus } from "@/context/CampusContext";
import { ECO_LEADERBOARD, CAMPUS_STATS } from "@/lib/mockData";
import {
  Leaf,
  Trophy,
  Award,
  TrendingUp,
  Droplets,
  Zap,
  ShieldCheck,
  Calendar,
  Sparkles,
  CheckCircle2,
  TreeDeciduous,
} from "lucide-react";

export default function GreenScoreView() {
  const { currentUser, ecoActions } = useCampus();
  const [leaderboardTab, setLeaderboardTab] = useState<"weekly" | "monthly" | "hostel">("weekly");

  const tier =
    currentUser.greenScore > 600
      ? "Planet Guardian"
      : currentUser.greenScore > 400
      ? "Eco Hero"
      : currentUser.greenScore > 200
      ? "Zero-Waste Star"
      : "Campus Seedling";

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/60 via-[#0B132B] to-[#111D4A] p-6 lg:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
              <Leaf className="h-3.5 w-3.5" />
              <span>Campus Circular Sustainability Platform</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              GreenScore & Eco-Credits
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every verified textbook reuse, peer equipment rental, and donation diverts measurable CO2
              and electronic waste from university landfills. Earn rewards, unlock campus badges, and compete on the leaderboard.
            </p>
          </div>

          {/* User Score Gauge */}
          <div className="rounded-2xl border border-emerald-500/40 bg-[#0B132B]/80 p-5 text-center shadow-xl backdrop-blur-md shrink-0 min-w-[220px]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Your Current Balance
            </div>
            <div className="mt-1 flex items-center justify-center gap-2">
              <Leaf className="h-6 w-6 text-emerald-400" />
              <span className="text-3xl font-black text-emerald-400">{currentUser.greenScore}</span>
            </div>
            <div className="text-xs font-bold text-cyan-300 mt-1">Tier: {tier}</div>
            <div className="mt-3 text-[11px] text-slate-400 border-t border-white/10 pt-2 flex justify-between">
              <span>Campus Rank</span>
              <span className="font-bold text-white">#2 of 1,840 Students</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Impact Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#111D4A]/60 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold">CO2 Avoided</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <TreeDeciduous className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white">
            {((currentUser.greenScore * 0.12).toFixed(1))} kg
          </div>
          <p className="text-[10px] text-slate-400 mt-1">~{Math.round(currentUser.greenScore / 40)} trees equivalent</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111D4A]/60 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold">Water Saved</span>
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Droplets className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white">
            {Math.round(currentUser.greenScore * 14)} L
          </div>
          <p className="text-[10px] text-slate-400 mt-1">From recycled paper & fabric</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111D4A]/60 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold">E-Waste Diverted</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white">
            {((currentUser.successfulRentals * 0.6).toFixed(1))} kg
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Batteries, sensors & chips</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111D4A]/60 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold">Money Circulated</span>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white">
            ${currentUser.completedTransactions * 22}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Saved within campus community</p>
        </div>
      </div>

      {/* Main Grid: Leaderboard & Scientific Rationale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Leaderboard */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#111D4A]/60 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Campus Sustainability Leaderboard</h3>
              </div>

              {/* Tabs */}
              <div className="flex rounded-xl bg-white/5 p-1 text-xs">
                <button
                  onClick={() => setLeaderboardTab("weekly")}
                  className={`rounded-lg px-3 py-1 font-semibold transition-all ${
                    leaderboardTab === "weekly" ? "bg-cyan-500 text-black" : "text-slate-400 hover:text-white"
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setLeaderboardTab("monthly")}
                  className={`rounded-lg px-3 py-1 font-semibold transition-all ${
                    leaderboardTab === "monthly" ? "bg-cyan-500 text-black" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setLeaderboardTab("hostel")}
                  className={`rounded-lg px-3 py-1 font-semibold transition-all ${
                    leaderboardTab === "hostel" ? "bg-cyan-500 text-black" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Hostel Quads
                </button>
              </div>
            </div>

            {leaderboardTab === "hostel" ? (
              <div className="space-y-3 text-xs">
                {[
                  { name: "Hostel 4 (Engineering Quad)", score: 4820, co2: "580 kg", rank: 1 },
                  { name: "Hostel 2 (Biotech & Sciences)", score: 4190, co2: "492 kg", rank: 2 },
                  { name: "Hostel 7 (Arts & Architecture)", score: 3840, co2: "410 kg", rank: 3 },
                  { name: "Off-Campus Day Scholars Guild", score: 3200, co2: "360 kg", rank: 4 },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-xl bg-white/5 p-3 border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 font-bold text-cyan-400 text-xs">
                        {item.rank}
                      </span>
                      <div>
                        <div className="font-bold text-white">{item.name}</div>
                        <div className="text-[10px] text-slate-400">{item.co2} avoided emissions</div>
                      </div>
                    </div>
                    <span className="font-extrabold text-emerald-400 text-sm">{item.score} pts</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2.5">
                {ECO_LEADERBOARD.map((item) => {
                  const isUser = item.user?.id === currentUser.id;
                  return (
                    <div
                      key={item.rank}
                      className={`flex items-center justify-between rounded-xl p-3 text-xs transition-colors ${
                        isUser
                          ? "bg-cyan-500/15 border border-cyan-500/30 font-semibold"
                          : "bg-white/5 hover:bg-white/10 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full font-extrabold text-xs ${
                            item.rank === 1
                              ? "bg-amber-400 text-black"
                              : item.rank === 2
                              ? "bg-slate-300 text-black"
                              : item.rank === 3
                              ? "bg-amber-700 text-white"
                              : "bg-white/10 text-slate-400"
                          }`}
                        >
                          {item.rank}
                        </span>

                        <div className="flex items-center gap-2">
                          {item.user ? (
                            <img
                              src={item.user.avatar}
                              alt={item.user.name}
                              className="h-8 w-8 rounded-full object-cover ring-1 ring-cyan-400"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-slate-400">
                              🎓
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-white">
                              {item.user ? item.user.name : item.name}
                              {isUser && <span className="ml-1 text-[10px] text-cyan-400 font-bold">(You)</span>}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {item.itemsShared} items circulated • {item.co2SavedKg} kg CO2
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-extrabold text-emerald-400 text-sm">{item.points} pts</div>
                        <div className="text-[9px] text-slate-400">{item.tier}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Activity Log */}
          <div className="rounded-2xl border border-white/10 bg-[#111D4A]/60 p-5">
            <h3 className="text-sm font-bold text-white mb-3">Your Eco-Credit Activity Log</h3>
            <div className="space-y-2 text-xs">
              {ecoActions.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between rounded-xl bg-white/5 p-3 border border-white/5"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                      <Leaf className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{log.actionTitle}</div>
                      <div className="text-[10px] text-slate-400">
                        {log.date} • {log.category}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-400">+{log.credits} Credits</div>
                    <div className="text-[10px] text-slate-400">{log.co2SavedKg} kg CO2</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Transparent Formula Assumptions */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 text-xs text-emerald-200">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Scientific Impact Assumptions</span>
            </h3>
            <p className="text-[11px] text-slate-300 mb-3 leading-relaxed">
              CampusExchange transparently documents all carbon and waste avoidance formulas based on lifecycle analysis (LCA) data:
            </p>

            <div className="space-y-3 text-[11px]">
              <div className="rounded-xl bg-black/40 p-2.5 border border-white/10">
                <div className="font-bold text-cyan-300">📚 Textbooks & Hardcovers</div>
                <div className="text-slate-300 mt-0.5">
                  Reusing 1 textbook avoids <strong>~4.5 kg CO2</strong> in pulp harvesting, printing, and shipping, plus <strong>~1,200 Liters of water</strong>.
                </div>
              </div>

              <div className="rounded-xl bg-black/40 p-2.5 border border-white/10">
                <div className="font-bold text-cyan-300">🔬 Lab Kits & Electronics</div>
                <div className="text-slate-300 mt-0.5">
                  Peer rental prevents manufacturing redundant PCB semiconductors, avoiding <strong>~12.0 kg CO2</strong> and toxic lithium/silicon disposal.
                </div>
              </div>

              <div className="rounded-xl bg-black/40 p-2.5 border border-white/10">
                <div className="font-bold text-cyan-300">👗 Cultural & Formal Attire</div>
                <div className="text-slate-300 mt-0.5">
                  One-time event rental avoids fast-fashion textile waste, conserving <strong>~18 kg CO2</strong> per garment lifecycle.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
