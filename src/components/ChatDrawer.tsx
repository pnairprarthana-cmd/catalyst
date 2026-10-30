"use client";

import React, { useState } from "react";
import { useCampus } from "@/context/CampusContext";
import {
  X,
  Send,
  MessageSquare,
  ShieldCheck,
  MapPin,
  Sparkles,
} from "lucide-react";

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sellerId: string;
  listingId?: string;
}

export default function ChatDrawer({ isOpen, onClose, sellerId, listingId }: ChatDrawerProps) {
  const { users, currentUser, listings, chatMessages, sendChatMessage } = useCampus();

  const [inputMessage, setInputMessage] = useState("");

  if (!isOpen) return null;

  const targetUser = users.find((u) => u.id === sellerId) || users[1];
  const listing = listings.find((l) => l.id === listingId);

  const filteredMessages = chatMessages.filter(
    (m) =>
      (m.senderId === currentUser.id && m.recipientId === targetUser.id) ||
      (m.senderId === targetUser.id && m.recipientId === currentUser.id)
  );

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    sendChatMessage(targetUser.id, listingId, text);
    setInputMessage("");

    // Simulate friendly automatic peer response if chatting with Priya or Marcus
    if (targetUser.id === "user-2" || targetUser.id === "user-3") {
      setTimeout(() => {
        sendChatMessage(
          targetUser.id,
          listingId,
          "Sounds good! Let's meet at Central Library Safe Desk A between classes."
        );
      }, 1200);
    }
  };

  const QUICK_PROMPTS = [
    "Hi! Is this still available?",
    "Can we meet at Central Library Safe Desk A?",
    "Would you consider a 3-day rental?",
    "Does it come with original cables/charger?",
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-[#0F172A] border-l border-white/10 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={targetUser.avatar}
              alt={targetUser.name}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-cyan-400"
            />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-[#0F172A]" />
          </div>
          <div>
            <div className="flex items-center gap-1 text-sm font-bold text-white">
              <span>{targetUser.name}</span>
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-[11px] text-slate-400">{targetUser.course}</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Pinned Listing Preview */}
      {listing && (
        <div className="flex items-center gap-3 bg-[#111D4A] p-3 border-b border-white/10">
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="h-12 w-12 rounded-lg object-cover shrink-0 border border-white/10"
          />
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-white truncate">{listing.title}</div>
            <div className="text-[11px] text-cyan-400 font-semibold">
              {listing.transactionType === "rent"
                ? `$${listing.rentalRatePerDay}/day`
                : listing.transactionType === "giveaway"
                ? "Free Donation"
                : `$${listing.price}`}
            </div>
          </div>
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4 text-xs">
        <div className="rounded-xl bg-cyan-500/10 p-2.5 text-center text-[11px] text-cyan-300 border border-cyan-500/20">
          🔒 Safe Campus Chat: Both students verified with approved institutional email.
        </div>

        {filteredMessages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-3 leading-relaxed ${
                  isMe
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/15"
                    : "bg-[#111D4A] text-slate-200 border border-white/10"
                }`}
              >
                {msg.text}
              </div>
              <span className="mt-1 text-[9px] text-slate-500 px-1">{msg.timestamp}</span>
            </div>
          );
        })}
      </div>

      {/* Quick Prompts */}
      <div className="border-t border-white/10 p-2 bg-[#111D4A]/50">
        <div className="text-[10px] text-slate-400 font-semibold mb-1 px-1">QUICK PROMPTS</div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="rounded-full bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-300 px-2.5 py-1 text-[11px] whitespace-nowrap border border-white/10 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <div className="border-t border-white/10 p-3 bg-[#0F172A]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message to peer..."
            className="flex-1 rounded-full border border-white/15 bg-white/5 py-2 px-4 text-xs text-white placeholder-slate-400 outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500 text-black hover:bg-cyan-400 transition-colors cursor-pointer shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
