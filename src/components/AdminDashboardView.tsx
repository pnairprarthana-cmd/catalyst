"use client";

import React, { useState } from "react";
import { useCampus } from "@/context/CampusContext";
import {
  ShieldAlert,
  UserCheck,
  CheckCircle2,
  XCircle,
  Flag,
  Trash2,
  Leaf,
  Layers,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";
import { CAMPUS_STATS } from "@/lib/mockData";

export default function AdminDashboardView() {
  const {
    listings,
    adminApproveListing,
    adminRemoveListing,
    users,
    adminVerifyStudent,
    pickupHubs,
  } = useCampus();

  const [auditLog, setAuditLog] = useState<string[]>([
    "Admin Miller approved student verification for APX-2024-BIO108 (Priya Sharma)",
    "Audit: Flagged item ID 'list-9' marked safe after manual review",
    "Central Library Safe Desk A scanner calibrated successfully",
  ]);

  const [pendingStudents, setPendingStudents] = useState([
    {
      id: "std-pending-1",
      name: "Daniel Rivera",
      email: "daniel.rivera@campus.edu",
      course: "B.Tech Electrical & Electronics",
      semester: 4,
      studentId: "APX-2024-EE044",
      domain: "campus.edu",
      appliedAt: "1 hour ago",
    },
    {
      id: "std-pending-2",
      name: "Amina Al-Mansoor",
      email: "amina.mansoor@campus.edu",
      course: "B.Des Product & Industrial Design",
      semester: 2,
      studentId: "APX-2025-DES12",
      domain: "campus.edu",
      appliedAt: "3 hours ago",
    },
  ]);

  const handleApproveStudent = (student: any) => {
    setPendingStudents((prev) => prev.filter((s) => s.id !== student.id));
    setAuditLog((prev) => [
      `Approved student verification: ${student.name} (${student.studentId})`,
      ...prev,
    ]);
  };

  const handleRejectStudent = (student: any) => {
    setPendingStudents((prev) => prev.filter((s) => s.id !== student.id));
    setAuditLog((prev) => [
      `Rejected verification request: ${student.name} (Incomplete credentials)`,
      ...prev,
    ]);
  };

  const handleRemoveListing = (listingId: string, title: string) => {
    adminRemoveListing(listingId);
    setAuditLog((prev) => [`Moderator removed listing: "${title}" (ID: ${listingId})`, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-[#0B132B] to-[#111D4A] p-6 lg:p-8">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30">
            <UserCheck className="h-3.5 w-3.5" />
            <span>Campus Safety & Operations Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Admin & Moderation Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Verify student identity credentials, moderate reported listings, inspect designated safe campus pickup
            points, and view tamper-evident circular audit logs.
          </p>
        </div>
      </div>

      {/* Admin Quick Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#111D4A]/60 p-4">
          <div className="text-xs text-slate-400 font-semibold">Active Campus Listings</div>
          <div className="text-2xl font-black text-white mt-1">{listings.length}</div>
          <div className="text-[10px] text-cyan-400 mt-0.5">100% verified campus students</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111D4A]/60 p-4">
          <div className="text-xs text-slate-400 font-semibold">Pending Verifications</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{pendingStudents.length}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Approved university domains only</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111D4A]/60 p-4">
          <div className="text-xs text-slate-400 font-semibold">Safe Pickup Hubs</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{pickupHubs.length}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Active QR handoff stations</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111D4A]/60 p-4">
          <div className="text-xs text-slate-400 font-semibold">Reported Disputes</div>
          <div className="text-2xl font-black text-rose-400 mt-1">0</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">All tickets resolved</div>
        </div>
      </div>

      {/* Main Grid: Student Verifications & Listings Moderation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Student Verifications */}
        <div className="rounded-2xl border border-white/10 bg-[#111D4A]/60 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-cyan-400" />
              <span>Pending Student Verification Requests</span>
            </h3>
            <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
              {pendingStudents.length} waiting
            </span>
          </div>

          {pendingStudents.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              All student verification applications processed!
            </div>
          ) : (
            <div className="space-y-3">
              {pendingStudents.map((std) => (
                <div
                  key={std.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-white">{std.name}</div>
                      <div className="text-[11px] text-slate-300">{std.course}</div>
                      <div className="text-[10px] font-mono text-cyan-400">
                        {std.email} • ID: {std.studentId}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">{std.appliedAt}</span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-white/10">
                    <button
                      onClick={() => handleRejectStudent(std)}
                      className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleApproveStudent(std)}
                      className="flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1 text-[11px] font-bold text-black hover:bg-emerald-400 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Approve Scholar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Listings Moderation Queue */}
        <div className="rounded-2xl border border-white/10 bg-[#111D4A]/60 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              <span>Campus Listings Moderation</span>
            </h3>
            <span className="text-xs text-slate-400">{listings.length} Active</span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {listings.map((l) => (
              <div
                key={l.id}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3 text-xs gap-3"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <img
                    src={l.images[0]}
                    alt={l.title}
                    className="h-10 w-10 rounded-lg object-cover shrink-0 border border-white/10"
                  />
                  <div className="overflow-hidden">
                    <div className="font-bold text-white truncate max-w-[200px]">{l.title}</div>
                    <div className="text-[10px] text-slate-400">
                      Seller: {l.seller.name} • ${l.price}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                    Safe
                  </span>
                  <button
                    onClick={() => handleRemoveListing(l.id, l.title)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                    title="Remove Listing"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Audit Log */}
      <div className="rounded-2xl border border-white/10 bg-[#111D4A]/60 p-5 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-400" />
          <span>Campus Moderation Audit Log (Immutable Record)</span>
        </h3>
        <div className="space-y-2 text-xs font-mono">
          {auditLog.map((log, index) => (
            <div
              key={index}
              className="rounded-lg bg-black/40 p-2.5 text-slate-300 border border-white/5"
            >
              <span className="text-cyan-400 mr-2">[{new Date().toLocaleTimeString()}]</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
