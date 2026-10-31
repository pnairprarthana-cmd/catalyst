"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutSuccessPage() {
  const [pickupPass, setPickupPass] = useState("CE-7482-SAFE");

  useEffect(() => {
    setPickupPass(`CE-${Math.floor(1000 + Math.random() * 9000)}-SAFE`);
  }, []);

  return (
    <div className="min-h-screen bg-[#fff5f7]">
      <Navbar onOpenAddModal={() => {}} />

      <main className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#be185d] bg-pink-50 border border-pink-200 px-3 py-1 rounded-full">
            Checkout Completed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f1111]">
            Ready for Safe Campus Pickup! 🤝
          </h1>
          <p className="text-sm text-slate-600">
            Your request has been sent to the lenders. Items are reserved and ready for pickup at your designated campus safe desks.
          </p>
        </div>

        {/* Digital Pickup Code Card */}
        <div className="bg-white border-2 border-dashed border-pink-300 rounded-2xl p-6 shadow-sm space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Digital Campus Safe Pickup Pass
          </p>
          <div className="bg-[#fffdf5] rounded-xl p-3 border border-yellow-200 inline-block">
            <span className="font-mono text-3xl font-black text-[#78350f] tracking-widest">
              {pickupPass}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Show this digital code at the Campus Safe Desk to verify your identity and collect your gear.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            href="/"
            className="px-6 py-2.5 rounded-full bg-[#fde047] hover:bg-[#facc15] border border-[#fef08a] font-bold text-sm text-[#78350f] shadow-xs transition-all"
          >
            Return to Campus Store
          </Link>
        </div>
      </main>
    </div>
  );
}
