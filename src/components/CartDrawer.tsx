"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCampus } from "@/context/CampusContext";
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Clock,
  Leaf,
  Plus,
  Minus,
} from "lucide-react";
import { PICKUP_HUBS } from "@/lib/mockData";

export default function CartDrawer() {
  const router = useRouter();
  const {
    cartItems,
    removeFromCart,
    updateCartItemDays,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    pickupHubs,
    borrowItem,
    bookRental,
  } = useCampus();

  if (!isCartOpen) return null;

  // Calculate totals in Rupees
  const subtotal = cartItems.reduce((acc, item) => {
    const l = item.listing;
    if (l.transactionType === "rent") {
      return acc + (l.rentalRatePerDay || 0) * (item.rentalDays || 1);
    }
    if (l.transactionType === "sell") {
      return acc + (l.price || 0);
    }
    return acc; // borrow and giveaway are ₹0
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
    // Process all items in cart
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
    setIsCartOpen(false);
    router.push("/cart/success");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Your Campus Cart</h2>
                <p className="text-[11px] text-slate-500">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"} selected
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Your Cart is Empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Browse verified textbooks, scientific calculators, and lab tools to borrow or rent for ₹0.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-5 py-2 rounded-full bg-[#ffd814] border border-[#fcd200] font-semibold text-xs text-[#0f1111] hover:bg-[#f7ca00]"
                  >
                    Start Exploring Items
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => {
                  const l = item.listing;
                  const isBorrow = l.transactionType === "borrow";
                  const isRent = l.transactionType === "rent";
                  const isSell = l.transactionType === "sell";
                  const hub = pickupHubs.find((h) => h.id === item.pickupHubId) || PICKUP_HUBS[0];

                  const itemPriceFormatted = isBorrow
                    ? "₹0 Free Borrow"
                    : isRent
                    ? `₹${(l.rentalRatePerDay || 0) * (item.rentalDays || 1)} (₹${l.rentalRatePerDay}/day)`
                    : isSell
                    ? `₹${l.price}`
                    : "Free Gift";

                  return (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-3 shadow-xs"
                    >
                      <div className="flex gap-3">
                        {/* Thumbnail */}
                        <div className="h-16 w-16 rounded-lg bg-[#f7f7f7] border border-slate-200 p-1 flex items-center justify-center shrink-0">
                          <img
                            src={l.images[0]}
                            alt={l.title}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-xs font-semibold text-slate-900 line-clamp-2 leading-tight">
                              {l.title}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-slate-400 hover:text-red-500 p-0.5 shrink-0"
                              title="Remove item"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                              {l.condition.replace("_", " ")}
                            </span>
                            <span className="text-xs font-bold text-teal-700">
                              {itemPriceFormatted}
                            </span>
                          </div>

                          <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1 truncate">
                            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                            Pickup: {hub.zone}
                          </p>
                        </div>
                      </div>

                      {/* Rental / Borrow Duration Adjuster */}
                      {(isBorrow || isRent) && (
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-slate-600 font-medium">Rental Duration:</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCartItemDays(item.id, (item.rentalDays || 2) - 1)}
                              disabled={(item.rentalDays || 2) <= 1}
                              className="h-6 w-6 rounded border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-bold text-slate-800 text-xs min-w-[3rem] text-center">
                              {item.rentalDays || 2} {item.rentalDays === 1 ? "day" : "days"}
                            </span>
                            <button
                              onClick={() => updateCartItemDays(item.id, (item.rentalDays || 2) + 1)}
                              disabled={(item.rentalDays || 2) >= 14}
                              className="h-6 w-6 rounded border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer & Checkout in Rupees */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-900">₹{subtotal}</span>
                </div>
                {totalDeposit > 0 && (
                  <div className="flex justify-between text-slate-500">
                    <span>Refundable Deposit:</span>
                    <span>₹{totalDeposit}</span>
                  </div>
                )}
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Campus Safe Pickup Desk:</span>
                  <span>FREE</span>
                </div>
                <div className="pt-1 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                  <span>Total Amount:</span>
                  <span className="text-base text-teal-800">₹{subtotal + totalDeposit}</span>
                </div>
              </div>

              {totalEcoCredits > 0 && (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-2">
                  <Leaf className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>You'll earn <strong>+{totalEcoCredits} Eco-Credits</strong> on pickup!</span>
                </div>
              )}

              {/* Big Yellow Amazon Button */}
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-2.5 px-4 rounded-full font-semibold text-sm text-[#0f1111] shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
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

              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
                <span>Zero fraud • Instant campus safe desk pickup pass</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
