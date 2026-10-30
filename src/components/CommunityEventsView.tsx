"use client";

import React, { useState } from "react";
import { useCampus } from "@/context/CampusContext";
import {
  Calendar,
  Users,
  MapPin,
  Leaf,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
} from "lucide-react";

export default function CommunityEventsView() {
  const { communityEvents } = useCampus();

  const [joinedEvents, setJoinedEvents] = useState<string[]>([]);

  const toggleJoin = (id: string) => {
    if (joinedEvents.includes(id)) {
      setJoinedEvents(joinedEvents.filter((e) => e !== id));
    } else {
      setJoinedEvents([...joinedEvents, id]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#111D4A] via-[#0F172A] to-[#1E1B4B] p-6 lg:p-8">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/30">
            <Users className="h-3.5 w-3.5" />
            <span>Community Drives & Swap Meets</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Campus Reuse Drives & Challenges
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Join collective campus initiatives: exchange textbooks before the term begins, participate in
            the hostel move-out blitz, and track our university-wide 1-Ton carbon avoidance milestone.
          </p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {communityEvents.map((evt) => {
          const isJoined = joinedEvents.includes(evt.id);
          const percent = Math.min(100, Math.round((evt.itemsCurrent / evt.itemsTarget) * 100));

          return (
            <div
              key={evt.id}
              className="glass-card flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#111D4A]/60 transition-all hover:border-cyan-500/30"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                <img
                  src={evt.imageUrl}
                  alt={evt.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-3 left-3 rounded-full bg-black/70 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 border border-white/10 backdrop-blur-md">
                  {evt.badge}
                </div>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-sm font-bold text-white line-clamp-1">{evt.title}</h3>
                <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {evt.description}
                </p>

                {/* Event Details */}
                <div className="mt-3 space-y-1.5 rounded-xl bg-white/5 p-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    <span>{evt.eventDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>{evt.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                    <span>{evt.participantsCount + (isJoined ? 1 : 0)} students participating</span>
                  </div>
                </div>

                {/* Progress bar towards collective target */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Campus Target Progress</span>
                    <span className="font-bold text-emerald-400">
                      {evt.itemsCurrent}/{evt.itemsTarget} ({percent}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* RSVP / Join Button */}
                <div className="mt-4 pt-2 border-t border-white/10">
                  <button
                    onClick={() => toggleJoin(evt.id)}
                    className={`w-full rounded-xl py-2 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      isJoined
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-cyan-500 text-black hover:bg-cyan-400 shadow-md shadow-cyan-500/20"
                    }`}
                  >
                    {isJoined ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Registered to Attend ✓</span>
                      </>
                    ) : (
                      <>
                        <Users className="h-4 w-4" />
                        <span>RSVP / Join Drive</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
