"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCampus } from "@/context/CampusContext";
import Navbar from "@/components/Navbar";
import {
  ShoppingBag,
  Trash2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Leaf,
  Plus,
  Minus,
  CheckCircle2,
} from "lucide-react";
import { PICKUP_HUBS } from "@/lib/mockData";

export default function CartPage() {
  const router = useRouter();
  const {
    cartItems,
    removeFromCart,
    updateCartItemDays,
    clearCart,
    pickupHubs,
    borrowItem,
    bookRental,
  } = useCampus();

  const subtotal = cartItems.reduce((acc, item) => {
    const l = item.listing;
    if (l.transactionType === "rent") {
      return acc + (l.rentalRatePerDay || 0) * (item.rentalDays || 1);
    }
    if (l.transactionType === "sell") {
      return acc + (l.price || 0);
    }
    return acc;
  }, 0);

  const totalDeposit = cartItems.reduce((acc, item) => {
    const l = item.listing;
    if (l.transactionType === "rent") {
      return acc + (l.rentalDeposit || 0);
    }
    return acc;
  }, 0);

  const totalEcoCredits = cartItems.reduce((acc, item) => {
    return acc + (item.listing.ecoCreditsAward || 0);
  }, 0);

  const handleCheckout = () => {
    const today = new Date().toISOString().split("T")[0];
    cartItems.forEach((item) => {
      const l = item.listing;
      const end = new Date(Date.now() + (item.rentalDays || 2) * 86400000).toISOString().split("T")[0];
      if (l.transactionType === "borrow") {
        borrowItem({
          listingId: l.id,
          startDate: today,
          endDate: end,
          pickupHubId: item.pickupHubId,
        });
      } else if (l.transactionType === "rent") {
        bookRental({
          listingId: l.id,
          startDate: today,
          endDate: end,
          isGroupRental: false,
          paymentMethod: "demo_sandbox",
          pickupHubId: item.pickupHubId,
        });
      }
    });

    clearCart();
    router.push("/cart/success");
  };

  return (
    <div className="min-h-screen bg-[#fff5f7]">
      <Navbar onOpenAddModal={() => router.push("/")} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
          <Link href="/" className="hover:text-[#c45500] font-medium flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" />
            Back to Campus Store
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Shopping Cart</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f1111] mb-6">
          Your Campus Cart ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
        </h1>

        {cartItems.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-4 max-w-xl mx-auto shadow-xs">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Your Cart is Empty</h2>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Looking for scientific calculators, course textbooks, or laboratory kits? Borrow or rent verified student gear for ₹0.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] font-semibold text-sm text-[#0f1111] shadow-xs"
              >
                Browse Campus Items
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Items */}
            <div className="lg:col-span-8 space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100 shadow-xs">
                {cartItems.map((item) => {
                  const l = item.listing;
                  const isBorrow = l.transactionType === "borrow";
                  const isRent = l.transactionType === "rent";
                  const isSell = l.transactionType === "sell";
                  const hub = pickupHubs.find((h) => h.id === item.pickupHubId) || PICKUP_HUBS[0];

                  return (
                    <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between">
                      <div className="flex gap-4">
                        {/* Thumbnail */}
                        <div className="h-24 w-24 rounded-lg bg-[#f7f7f7] border border-slate-200 p-2 flex items-center justify-center shrink-0">
                          <img
                            src={l.images[0]}
                            alt={l.title}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        {/* Info */}
                        <div className="space-y-1">
                          <Link
                            href={`/listing/${l.id}`}
                            className="text-sm sm:text-base font-semibold text-[#0f1111] hover:text-[#c45500] line-clamp-2 leading-snug"
                          >
                            {l.title}
                          </Link>

                          <div className="flex items-center gap-2 flex-wrap text-xs">
                            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              {isBorrow ? "Free Borrow" : isRent ? "Rental" : isSell ? "Buy" : "Gift"}
                            </span>
                            <span className="text-slate-500">•</span>
                            <span className="text-slate-600">Condition: {l.condition.replace("_", " ")}</span>
                          </div>

                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            Pickup Station: <strong className="text-slate-700">{hub.name}</strong>
                          </p>

                          {/* Duration selector */}
                          {(isBorrow || isRent) && (
                            <div className="pt-2 flex items-center gap-3 text-xs">
                              <span className="font-medium text-slate-700">Days:</span>
                              <div className="flex items-center gap-1.5 border border-slate-300 rounded-md p-0.5">
                                <button
                                  onClick={() => updateCartItemDays(item.id, (item.rentalDays || 2) - 1)}
                                  disabled={(item.rentalDays || 2) <= 1}
                                  className="h-6 w-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="font-bold text-slate-900 min-w-[2rem] text-center">
                                  {item.rentalDays || 2}d
                                </span>
                                <button
                                  onClick={() => updateCartItemDays(item.id, (item.rentalDays || 2) + 1)}
                                  disabled={(item.rentalDays || 2) >= 14}
                                  className="h-6 w-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <span className="text-slate-400">
                                {isBorrow ? "(Free loan)" : `(@ ₹${l.rentalRatePerDay}/day)`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Price & Delete */}
                      <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2 text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="text-base sm:text-lg font-extrabold text-[#0f1111]">
                          {isBorrow
                            ? "₹0"
                            : isRent
                            ? `₹${(l.rentalRatePerDay || 0) * (item.rentalDays || 1)}`
                            : `₹${l.price}`}
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-[#007185] hover:text-red-600 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Amazon Buy Box Summary */}
            <div className="lg:col-span-4">
              <div className="rounded-xl border border-[#d5d9d9] bg-white p-5 shadow-xs space-y-4 sticky top-20">
                <h3 className="text-base font-bold text-[#0f1111] pb-3 border-b border-slate-100">
                  Order Summary
                </h3>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Items ({cartItems.length}):</span>
                    <span className="font-bold text-slate-900">₹{subtotal}</span>
                  </div>
                  {totalDeposit > 0 && (
                    <div className="flex justify-between text-slate-500">
                      <span>Refundable Deposit:</span>
                      <span>₹{totalDeposit}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Campus Safe Desk Pickup:</span>
                    <span>FREE</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
                    <span>Total:</span>
                    <span className="text-teal-800">₹{subtotal + totalDeposit}</span>
                  </div>
                </div>

                {totalEcoCredits > 0 && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Earn <strong>+{totalEcoCredits} Eco-Credits</strong> on return!</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full py-3 px-4 rounded-full font-semibold text-sm text-[#0f1111] shadow-xs hover:shadow transition-all flex items-center justify-center gap-2"
                  style={{
                    background: "#ffd814",
                    border: "1px solid #fcd200",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f7ca00";
                    e.currentTarget.style.borderColor = "#f2c200";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#ffd814";
                    e.currentTarget.style.borderColor = "#fcd200";
                  }}
                >
                  <span>Proceed to Campus Pickup (₹{subtotal + totalDeposit})</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center gap-1 text-slate-700 font-semibold">
                    <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
                    <span>Verified Student Handoff Guarantee</span>
                  </div>
                  <p>Pick up safely with your digital pass at designated campus hub safe desks.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
