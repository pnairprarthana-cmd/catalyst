"use client";

import React, { useState } from "react";
import { useCampus } from "@/context/CampusContext";
import {
  IndianRupee,
  TrendingUp,
  Wallet,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  Download,
  ShieldCheck,
  Building,
  HelpCircle,
  Tag,
  ShoppingBag,
  Send,
  X,
  Search,
  Filter,
} from "lucide-react";

export default function StudentEarningsView() {
  const {
    currentUser,
    earningsTransactions,
    totalEarnings,
    availableEarnings,
    pendingEscrowEarnings,
    withdrawEarnings,
    setActiveTab,
  } = useCampus();

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [upiId, setUpiId] = useState<string>(`${currentUser.email.split("@")[0]}@oksbi`);
  const [withdrawMsg, setWithdrawMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filter transactions for current student
  const userTransactions = earningsTransactions.filter((t) => t.userId === currentUser.id);

  const filteredTransactions = userTransactions.filter((txn) => {
    if (activeFilter === "sales" && txn.type !== "store_sale" && txn.type !== "craft_order") return false;
    if (activeFilter === "rentals" && txn.type !== "rental_income") return false;
    if (activeFilter === "withdrawals" && txn.type !== "withdrawal") return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        txn.title.toLowerCase().includes(q) ||
        txn.referenceCode.toLowerCase().includes(q) ||
        txn.buyerOrRenterName?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate earnings by category
  const craftEarnings = userTransactions
    .filter((t) => t.type === "craft_order")
    .reduce((sum, t) => sum + t.amount, 0);

  const storeSalesEarnings = userTransactions
    .filter((t) => t.type === "store_sale")
    .reduce((sum, t) => sum + t.amount, 0);

  const rentalEarnings = userTransactions
    .filter((t) => t.type === "rental_income")
    .reduce((sum, t) => sum + t.amount, 0);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setWithdrawMsg({ type: "error", text: "Please enter a valid withdrawal amount." });
      return;
    }
    if (amountNum > availableEarnings) {
      setWithdrawMsg({
        type: "error",
        text: `Amount exceeds available balance of ₹${availableEarnings}.`,
      });
      return;
    }

    const result = withdrawEarnings(amountNum, upiId);
    if (result.success) {
      setWithdrawMsg({ type: "success", text: result.message });
      setWithdrawAmount("");
      setTimeout(() => {
        setIsWithdrawModalOpen(false);
        setWithdrawMsg(null);
      }, 2000);
    } else {
      setWithdrawMsg({ type: "error", text: result.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Top Hero Card ── */}
      <div className="relative overflow-hidden rounded-3xl border border-pink-200/80 bg-gradient-to-br from-[#FFFBEB] via-[#FFF5F7] to-[#FCE7F3] p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fde047] px-3 py-1 text-xs font-bold text-[#78350f] border border-[#fef08a] shadow-2xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Campus Student Wallet & Earnings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Earnings on CampusExchange
            </h1>
            <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
              Track money made from selling store items, student-crafted crochet, hampers, and peer gear rentals. Instant zero-fee payouts directly to your UPI ID.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setWithdrawAmount(String(availableEarnings));
                setIsWithdrawModalOpen(true);
              }}
              disabled={availableEarnings <= 0}
              className={`px-5 py-2.5 rounded-full font-bold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer ${
                availableEarnings > 0
                  ? "bg-[#fde047] hover:bg-[#facc15] text-[#78350f] border border-[#fef08a] hover:scale-102"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
              }`}
            >
              <Send className="h-3.5 w-3.5" />
              <span>Withdraw to UPI</span>
            </button>
            <button
              onClick={() => setActiveTab("explore")}
              className="px-4 py-2.5 rounded-full border border-pink-200 bg-white/90 hover:bg-white text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-pink-600" />
              <span>Campus Store</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Key Metrics Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Earned */}
        <div className="rounded-2xl border border-pink-100 bg-white p-4 sm:p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Earned</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            ₹{totalEarnings.toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <span>↑ All-time student revenue</span>
          </p>
        </div>

        {/* Available Balance */}
        <div className="rounded-2xl border border-amber-200/90 bg-gradient-to-br from-[#FFFBEB] to-white p-4 sm:p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Available Balance</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-[#78350f]">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#78350f] tracking-tight">
            ₹{availableEarnings.toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-amber-800 font-medium flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            <span>Ready for UPI transfer</span>
          </p>
        </div>

        {/* In Escrow */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">In Escrow</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            ₹{pendingEscrowEarnings.toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-slate-500">
            Releases upon peer pickup confirmation
          </p>
        </div>

        {/* Peer Borrow Savings */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 sm:p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Peer Savings</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-900 tracking-tight">
            ₹{(currentUser.greenScore * 8).toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-emerald-700">
            Saved by borrowing ₹0 items on campus
          </p>
        </div>
      </div>

      {/* ── Revenue Stream Distribution ── */}
      <div className="rounded-2xl border border-pink-100 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Earnings by Category</h2>
            <p className="text-xs text-slate-500">Where your earnings come from</p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {userTransactions.length} Total Transactions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Crafts & Handmade */}
          <div className="rounded-xl border border-pink-100 bg-pink-50/40 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-pink-900 flex items-center gap-1.5">
                <span>🧶</span> Student Crafts & Hampers
              </span>
              <span className="font-black text-pink-700">₹{craftEarnings}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-pink-200/60 overflow-hidden">
              <div
                className="h-full bg-pink-500 rounded-full"
                style={{ width: `${totalEarnings > 0 ? (craftEarnings / totalEarnings) * 100 : 0}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500">Bouquets, amigurumi & care hampers</p>
          </div>

          {/* Store Sales */}
          <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-amber-900 flex items-center gap-1.5">
                <span>🏪</span> Store Items & Clothes
              </span>
              <span className="font-black text-amber-800">₹{storeSalesEarnings}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-amber-200/60 overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full"
                style={{ width: `${totalEarnings > 0 ? (storeSalesEarnings / totalEarnings) * 100 : 0}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500">Blazers, books, tech & dorm living</p>
          </div>

          {/* Rentals */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-blue-900 flex items-center gap-1.5">
                <span>⚙️</span> Peer Gear Rentals
              </span>
              <span className="font-black text-blue-800">₹{rentalEarnings}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-blue-200/60 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${totalEarnings > 0 ? (rentalEarnings / totalEarnings) * 100 : 0}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500">Cameras, scientific calculators & kits</p>
          </div>
        </div>
      </div>

      {/* ── Transaction History & Ledger ── */}
      <div className="rounded-2xl border border-pink-100 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Earnings Ledger & History</h2>
            <p className="text-xs text-slate-500">Detailed record of sales, rentals, and UPI payouts</p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transaction..."
                className="pl-8 pr-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:border-pink-300 w-44"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-full text-xs font-semibold">
              {[
                { id: "all", label: "All" },
                { id: "sales", label: "Sales & Crafts" },
                { id: "rentals", label: "Rentals" },
                { id: "withdrawals", label: "Payouts" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    activeFilter === f.id
                      ? "bg-white text-slate-900 shadow-2xs font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mx-auto">
              <HelpCircle className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">No transactions match your search</p>
            <p className="text-xs text-slate-400">Try clearing filters or posting a new item for sale!</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredTransactions.map((txn) => {
              const isPayout = txn.type === "withdrawal";
              const isEscrow = txn.status === "pending_escrow";

              return (
                <div
                  key={txn.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50/20 transition-all text-xs"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-sm ${
                        isPayout
                          ? "bg-amber-100 text-amber-900"
                          : isEscrow
                          ? "bg-blue-100 text-blue-700"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {isPayout ? "💸" : isEscrow ? "⏳" : "₹"}
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900">{txn.title}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            txn.type === "craft_order"
                              ? "bg-pink-100 text-pink-700"
                              : txn.type === "rental_income"
                              ? "bg-blue-100 text-blue-700"
                              : txn.type === "withdrawal"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {txn.type === "craft_order"
                            ? "Student Craft"
                            : txn.type === "rental_income"
                            ? "Rental Fee"
                            : txn.type === "withdrawal"
                            ? "UPI Payout"
                            : "Store Sale"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{txn.date}</span>
                        <span>•</span>
                        <span>{txn.paymentMethod}</span>
                        <span>•</span>
                        <span className="font-mono text-slate-500">{txn.referenceCode}</span>
                        {txn.buyerOrRenterName && (
                          <>
                            <span>•</span>
                            <span className="text-slate-600 font-medium">Buyer: {txn.buyerOrRenterName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <span
                      className={`text-sm sm:text-base font-black ${
                        isPayout
                          ? "text-slate-700"
                          : isEscrow
                          ? "text-blue-700"
                          : "text-emerald-700"
                      }`}
                    >
                      {isPayout ? `-₹${txn.amount}` : `+₹${txn.amount}`}
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        txn.status === "credited"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : txn.status === "pending_escrow"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {txn.status === "credited"
                        ? "Credited"
                        : txn.status === "pending_escrow"
                        ? "In Escrow"
                        : "Withdrawn"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Tips to Boost Campus Earnings ── */}
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-[#FFFBEB] to-[#FEF9C3]/50 p-5 sm:p-6 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 mb-2">
          <span>💡</span> Ways to Earn More on CampusExchange
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
          <div className="p-3 bg-white/80 rounded-xl border border-amber-100">
            <p className="font-bold text-slate-900 mb-0.5">Post Handmade Crafts</p>
            <p className="text-slate-600 text-[11px]">
              Hostel students love buying crochet keychains, bouquets, and exam gift hampers.
            </p>
          </div>
          <div className="p-3 bg-white/80 rounded-xl border border-amber-100">
            <p className="font-bold text-slate-900 mb-0.5">Rent Tech & Lab Gear</p>
            <p className="text-slate-600 text-[11px]">
              Scientific calculators, lab coats, and camera accessories earn continuous daily fees.
            </p>
          </div>
          <div className="p-3 bg-white/80 rounded-xl border border-amber-100">
            <p className="font-bold text-slate-900 mb-0.5">Sell Course Reference Books</p>
            <p className="text-slate-600 text-[11px]">
              Junior batches eagerly buy solved past question papers and annotated lecture binders.
            </p>
          </div>
        </div>
      </div>

      {/* ── Withdraw to UPI Modal ── */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-pink-200 bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fde047] text-[#78350f]">
                  <Send className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Withdraw to UPI</h3>
                  <p className="text-[11px] text-slate-500">Instant transfer to your student bank account</p>
                </div>
              </div>
              <button
                onClick={() => { setIsWithdrawModalOpen(false); setWithdrawMsg(null); }}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Available to Withdraw</label>
                <div className="text-2xl font-black text-emerald-700">
                  ₹{availableEarnings.toLocaleString("en-IN")}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your UPI ID (VPA)</label>
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="name@okaxis or name@upi"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Withdrawal Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={availableEarnings}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount (e.g. 1000)"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-400"
                />

                {/* Quick preset chips */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {[500, 1000, 2000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setWithdrawAmount(String(Math.min(preset, availableEarnings)))}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      ₹{preset}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(String(availableEarnings))}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full border border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors"
                  >
                    All (₹{availableEarnings})
                  </button>
                </div>
              </div>

              {withdrawMsg && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold ${
                    withdrawMsg.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {withdrawMsg.text}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={availableEarnings <= 0}
                  className="px-5 py-2.5 rounded-full bg-[#fde047] hover:bg-[#facc15] border border-[#fef08a] font-bold text-xs text-[#78350f] shadow-sm transition-all cursor-pointer"
                >
                  Confirm UPI Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
