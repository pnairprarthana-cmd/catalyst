"use client";

import React from "react";
import { useCampus } from "@/context/CampusContext";
import {
  ShieldCheck,
  CheckCircle2,
  Award,
  Star,
  Clock,
  Calendar,
  Sparkles,
  GraduationCap,
  Leaf,
  Users,
} from "lucide-react";

export default function CampusTrustPassportView() {
  const { currentUser } = useCampus();

  const SAMPLE_REVIEWS = [
    {
      id: "rev-1",
      author: "Marcus Vance",
      course: "B.Tech Mechanical",
      rating: 5,
      punctuality: 5,
      comment: "Super punctual! Returned the Casio scientific calculator in pristine shape at Library Safe Desk A. Highly recommend!",
      date: "3 days ago",
    },
    {
      id: "rev-2",
      author: "Priya Sharma",
      course: "Bioengineering",
      rating: 5,
      punctuality: 5,
      comment: "Campbell Biology notes were immaculate and helped me pass my genetics quiz. Seamless QR code handoff.",
      date: "Oct 22, 2026",
    },
    {
      id: "rev-3",
      author: "Chloe Dupont",
      course: "Architecture",
      rating: 5,
      punctuality: 5,
      comment: "Shared the cinema camera kit smoothly. Honest, communicative, and very respectful with expensive equipment.",
      date: "Oct 15, 2026",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Passport Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-[#0F172A] via-[#111D4A] to-[#1E1B4B] p-6 lg:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-20 w-20 rounded-2xl object-cover ring-2 ring-cyan-400 shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-cyan-400 text-black shadow-lg">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  {currentUser.name}
                </h1>
                <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-xs font-bold text-cyan-300 border border-cyan-500/30">
                  Verified Student Scholar
                </span>
              </div>
              <div className="text-xs text-slate-300 flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-cyan-400" />
                <span>
                  {currentUser.college} • {currentUser.course} (Sem {currentUser.semester})
                </span>
              </div>
              <div className="text-[11px] font-mono text-cyan-300">
                Institutional ID: {currentUser.studentId} • Domain: @{currentUser.domain}
              </div>
            </div>
          </div>

          {/* Trust Gauge Badge */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md shrink-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Campus Trust Score
            </div>
            <div className="text-3xl font-black text-cyan-300 mt-1 flex items-center justify-center gap-1">
              <ShieldCheck className="h-7 w-7 text-cyan-400" />
              <span>{currentUser.trustScore}</span>
              <span className="text-sm font-normal text-slate-400">/ 100</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-bold mt-1">
              Top 2% Punctuality Rating
            </div>
          </div>
        </div>
      </div>

      {/* Trust Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#111D4A]/60 p-4 text-center">
          <div className="text-[11px] text-slate-400 font-semibold uppercase">Punctuality Rate</div>
          <div className="mt-1 text-2xl font-extrabold text-emerald-400">
            {currentUser.returnPunctuality}%
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Returned items on or before due date</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111D4A]/60 p-4 text-center">
          <div className="text-[11px] text-slate-400 font-semibold uppercase">Completed Deals</div>
          <div className="mt-1 text-2xl font-extrabold text-white">
            {currentUser.completedTransactions}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Zero reported violations or disputes</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111D4A]/60 p-4 text-center">
          <div className="text-[11px] text-slate-400 font-semibold uppercase">Successful Rentals</div>
          <div className="mt-1 text-2xl font-extrabold text-cyan-400">
            {currentUser.successfulRentals}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Both borrower and lender roles</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111D4A]/60 p-4 text-center">
          <div className="text-[11px] text-slate-400 font-semibold uppercase">Average Rating</div>
          <div className="mt-1 text-2xl font-extrabold text-amber-400 flex items-center justify-center gap-1">
            <Star className="h-5 w-5 fill-amber-400" />
            <span>5.0</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Across 22 peer reviews</p>
        </div>
      </div>

      {/* Earned Badges Section */}
      <div className="rounded-2xl border border-white/10 bg-[#111D4A]/60 p-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
          <Award className="h-4 w-4 text-cyan-400" />
          <span>Earned Campus Badges & Certifications</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { title: "Verified Scholar", desc: "Approved .edu institutional credentials", icon: "🎓", color: "cyan" },
            { title: "Zero-Waste Champion", desc: "Diverted over 50kg CO2 emissions", icon: "🌿", color: "emerald" },
            { title: "Prompt Returner", desc: "100% on-time equipment returns", icon: "⚡", color: "amber" },
            { title: "Safe Trader", desc: "10+ QR verified safe hub handoffs", icon: "🛡️", color: "violet" },
          ].map((badge) => (
            <div
              key={badge.title}
              className="rounded-xl border border-white/10 bg-white/5 p-3 text-center space-y-1 hover:border-cyan-400/30 transition-colors"
            >
              <div className="text-2xl">{badge.icon}</div>
              <div className="text-xs font-bold text-white">{badge.title}</div>
              <div className="text-[10px] text-slate-400 leading-tight">{badge.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Peer Reviews History */}
      <div className="rounded-2xl border border-white/10 bg-[#111D4A]/60 p-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
          <span>Verified Peer Reviews & Ratings ({SAMPLE_REVIEWS.length})</span>
        </h3>

        <div className="space-y-3">
          {SAMPLE_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="rounded-xl border border-white/5 bg-white/5 p-3.5 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="font-bold text-white">{rev.author}</div>
                  <span className="text-[10px] text-slate-400">({rev.course})</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-400" />
                  ))}
                  <span className="text-[10px] text-slate-400 ml-1">{rev.date}</span>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">{rev.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
