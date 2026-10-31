"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  Listing,
  RequestItem,
  RequestOffer,
  RentalBooking,
  CampusPickupHub,
  CommunityEvent,
  EcoCreditAction,
  AcademicDocument,
  ExchangeProposal,
  EarningsTransaction,
} from "@/types";
import {
  SAMPLE_USERS,
  SAMPLE_LISTINGS,
  SAMPLE_REQUESTS,
  SAMPLE_RENTALS,
  PICKUP_HUBS,
  COMMUNITY_EVENTS,
  CATEGORIES,
  ACADEMIC_DOCUMENTS,
  SAMPLE_EXCHANGES,
  SAMPLE_EARNINGS,
} from "@/lib/mockData";


export interface CartItem {
  id: string;
  listing: Listing;
  rentalDays: number;
  pickupHubId: string;
  addedAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  recipientId: string;
  listingId?: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: "offer" | "rental" | "eco_reward" | "system" | "message";
  timestamp: string;
  isRead: boolean;
  linkTab?: string;
}

interface CampusContextType {
  currentUser: User;
  switchUser: (userId: string) => void;
  users: User[];
  listings: Listing[];
  requests: RequestItem[];
  rentals: RentalBooking[];
  pickupHubs: CampusPickupHub[];
  communityEvents: CommunityEvent[];
  ecoActions: EcoCreditAction[];
  notifications: InAppNotification[];
  chatMessages: ChatMessage[];
  theme: "dark" | "light";
  toggleTheme: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (catId: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  transactionFilter: string;
  setTransactionFilter: (filter: string) => void;

  // Academic Vault
  academicDocuments: AcademicDocument[];
  uploadAcademicDocument: (docData: Partial<AcademicDocument>) => AcademicDocument;
  downloadAcademicDocument: (docId: string) => void;
  paperSavedPages: number;

  // Smart Exchange
  exchangeProposals: ExchangeProposal[];
  createExchangeProposal: (proposalData: Partial<ExchangeProposal>) => ExchangeProposal;
  acceptExchangeProposal: (proposalId: string) => void;
  declineExchangeProposal: (proposalId: string) => void;

  // Wishlist / Saved Items
  savedListingIds: string[];
  toggleSaveListing: (listingId: string) => void;

  // Shopping Cart
  cartItems: CartItem[];
  addToCart: (listing: Listing, options?: { rentalDays?: number; pickupHubId?: string }) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartItemDays: (cartItemId: string, days: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Authentication & Verification
  isAuthModalOpen: boolean;
  authModalMode: "login" | "register" | "verify" | "forgot";
  openAuthModal: (mode?: "login" | "register" | "verify" | "forgot") => void;
  closeAuthModal: () => void;
  registerStudent: (data: {
    name: string;
    email: string;
    college: string;
    course: string;
    semester: number;
    studentId: string;
  }) => Promise<{ success: boolean; error?: string; message?: string }>;
  loginStudent: (email: string) => Promise<{ success: boolean; error?: string }>;
  logoutStudent: () => void;
  verifyStudentEmail: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  resetStudentPassword: (email: string) => Promise<{ success: boolean; message?: string }>;

  // Safety & Reporting
  reportModalData: { isOpen: boolean; type: "listing" | "user"; id: string; title: string } | null;
  openReportModal: (type: "listing" | "user", id: string, title: string) => void;
  closeReportModal: () => void;
  submitReport: (reason: string, details?: string) => void;

  // Earnings & Wallet
  earningsTransactions: EarningsTransaction[];
  totalEarnings: number;
  availableEarnings: number;
  pendingEscrowEarnings: number;
  withdrawEarnings: (amount: number, upiId: string) => { success: boolean; message: string; transaction?: EarningsTransaction };

  // Actions
  addListing: (listingData: Partial<Listing>) => Listing;
  createRequest: (requestData: Partial<RequestItem>) => RequestItem;
  submitOffer: (requestId: string, offerData: Partial<RequestOffer>) => void;
  acceptOffer: (requestId: string, offerId: string) => void;
  checkRentalAvailability: (listingId: string, startDate: string, endDate: string) => boolean;
  bookRental: (params: {
    listingId: string;
    startDate: string;
    endDate: string;
    isGroupRental: boolean;
    groupSlots?: number;
    paymentMethod: "upi" | "cash_handoff" | "demo_sandbox";
    pickupHubId: string;
  }) => { success: boolean; booking?: RentalBooking; error?: string };
  borrowItem: (params: {
    listingId: string;
    startDate?: string;
    endDate?: string;
    pickupHubId: string;
  }) => { success: boolean; booking?: RentalBooking; error?: string };
  joinGroupRental: (rentalId: string) => boolean;
  verifyQRPickup: (rentalId: string, inputCode: string) => boolean;
  confirmRentalReturn: (rentalId: string) => boolean;
  claimGiveaway: (listingId: string, pickupHubId: string) => boolean;
  sendChatMessage: (recipientId: string, listingId: string | undefined, text: string) => void;
  markNotificationRead: (id: string) => void;
  reportContent: (type: string, id: string, reason: string) => void;
  adminApproveListing: (id: string) => void;
  adminRemoveListing: (id: string) => void;
  adminVerifyStudent: (userId: string) => void;
}


const CampusContext = createContext<CampusContextType | undefined>(undefined);

export function CampusProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(SAMPLE_USERS);
  const [currentUser, setCurrentUser] = useState<User>(SAMPLE_USERS[0]); // Alex Morgan
  const [listings, setListings] = useState<Listing[]>(SAMPLE_LISTINGS);
  const [requests, setRequests] = useState<RequestItem[]>(SAMPLE_REQUESTS);
  const [rentals, setRentals] = useState<RentalBooking[]>(SAMPLE_RENTALS);
  const [pickupHubs] = useState<CampusPickupHub[]>(PICKUP_HUBS);
  const [communityEvents] = useState<CommunityEvent[]>(COMMUNITY_EVENTS);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeTab, setActiveTab] = useState<string>("home");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [transactionFilter, setTransactionFilter] = useState<string>("all");

  // Academic Vault State
  const [academicDocuments, setAcademicDocuments] = useState<AcademicDocument[]>(ACADEMIC_DOCUMENTS);
  const [paperSavedPages, setPaperSavedPages] = useState<number>(28400);

  // Smart Exchange State
  const [exchangeProposals, setExchangeProposals] = useState<ExchangeProposal[]>(SAMPLE_EXCHANGES);

  // Wishlist State
  const [savedListingIds, setSavedListingIds] = useState<string[]>(["list-borrow-1", "list-4"]);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Authentication & Verification State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register" | "verify" | "forgot">("login");

  // Earnings & Wallet State
  const [earningsTransactions, setEarningsTransactions] = useState<EarningsTransaction[]>(SAMPLE_EARNINGS);

  // Safety & Reporting Modal State
  const [reportModalData, setReportModalData] = useState<{
    isOpen: boolean;
    type: "listing" | "user";
    id: string;
    title: string;
  } | null>(null);

  const [ecoActions, setEcoActions] = useState<EcoCreditAction[]>([
    {
      id: "eco-1",
      userId: "user-1",
      actionTitle: "Listed Casio Scientific Calculator for Peer Rental",
      credits: 45,
      co2SavedKg: 2.8,
      date: "Oct 28, 2026",
      category: "Electronics Sharing",
    },
    {
      id: "eco-2",
      userId: "user-1",
      actionTitle: "Transferred Campbell Biology textbook to junior",
      credits: 85,
      co2SavedKg: 9.4,
      date: "Oct 27, 2026",
      category: "Textbook Reuse",
    },
  ]);

  const [notifications, setNotifications] = useState<InAppNotification[]>([
    {
      id: "notif-1",
      title: "New Offer on Your Request!",
      message: "Marcus offered an Arduino IoT kit for your capstone project.",
      type: "offer",
      timestamp: "10 mins ago",
      isRead: false,
      linkTab: "requests",
    },
    {
      id: "notif-2",
      title: "Eco-Credits Awarded! 🌿",
      message: "You earned +45 Eco-Credits for listing an academic resource.",
      type: "eco_reward",
      timestamp: "2 hours ago",
      isRead: false,
      linkTab: "greenscore",
    },
    {
      id: "notif-3",
      title: "Upcoming Rental Pickup",
      message: "Sony A7 Cinema kit reservation confirmed at SAC Atrium Hub.",
      type: "rental",
      timestamp: "Yesterday",
      isRead: true,
      linkTab: "rentals",
    },
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      senderId: "user-2",
      recipientId: "user-1",
      listingId: "list-1",
      text: "Hi Alex! Is the Casio calculator still available for tomorrow's midterm?",
      timestamp: "10:14 AM",
      isRead: true,
    },
    {
      id: "msg-2",
      senderId: "user-1",
      recipientId: "user-2",
      listingId: "list-1",
      text: "Yes Priya! It is fully charged and ready. We can meet at Central Library Safe Desk A.",
      timestamp: "10:18 AM",
      isRead: true,
    },
  ]);

  // Load state from localStorage on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedListings = localStorage.getItem("cx_listings");
      if (savedListings) {
        try {
          setListings(JSON.parse(savedListings));
        } catch (e) {
          console.error(e);
        }
      }

      const savedRentals = localStorage.getItem("cx_rentals");
      if (savedRentals) {
        try {
          setRentals(JSON.parse(savedRentals));
        } catch (e) {
          console.error(e);
        }
      }

      const savedTheme = localStorage.getItem("cx_theme") as "dark" | "light" | null;
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.className = savedTheme;
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("cx_theme", nextTheme);
      document.documentElement.className = nextTheme;
    }
  };

  const switchUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  const addListing = (listingData: Partial<Listing>): Listing => {
    const newListing: Listing = {
      id: `list-${Date.now()}`,
      title: listingData.title || "Untitled Resource",
      description: listingData.description || "",
      categoryId: listingData.categoryId || "cat-1",
      condition: listingData.condition || "good",
      transactionType: listingData.transactionType || "sell",
      price: listingData.price || 0,
      rentalRatePerDay: listingData.rentalRatePerDay,
      rentalDeposit: listingData.rentalDeposit,
      images:
        listingData.images && listingData.images.length > 0
          ? listingData.images
          : ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"],
      seller: currentUser,
      status: "active",
      pickupLocationId: listingData.pickupLocationId || "hub-1",
      courseRelevant: listingData.courseRelevant,
      semesterRelevant: listingData.semesterRelevant,
      rating: 5.0,
      reviewsCount: 0,
      ecoCreditsAward: 50,
      co2SavedKg: 5.5,
      createdAt: new Date().toISOString(),
      views: 1,
      likes: 0,
    };

    const updated = [newListing, ...listings];
    setListings(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("cx_listings", JSON.stringify(updated));
    }

    // Award eco-credits
    const ecoLog: EcoCreditAction = {
      id: `eco-${Date.now()}`,
      userId: currentUser.id,
      actionTitle: `Listed "${newListing.title}" on Campus Exchange`,
      credits: 50,
      co2SavedKg: 5.5,
      date: "Just now",
      category: "Circulation",
    };
    setEcoActions((prev) => [ecoLog, ...prev]);

    // Update user score
    setCurrentUser((prev) => ({
      ...prev,
      greenScore: prev.greenScore + 50,
      completedTransactions: prev.completedTransactions + 1,
    }));

    // Add notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Listing Published! 🚀",
        message: `Your resource "${newListing.title}" is live. +50 Eco-Credits awarded.`,
        type: "eco_reward",
        timestamp: "Just now",
        isRead: false,
        linkTab: "explore",
      },
      ...prev,
    ]);

    return newListing;
  };

  const createRequest = (requestData: Partial<RequestItem>): RequestItem => {
    const newRequest: RequestItem = {
      id: `req-${Date.now()}`,
      title: requestData.title || "Requested Item",
      description: requestData.description || "",
      categoryId: requestData.categoryId || "cat-1",
      student: currentUser,
      neededByDate: requestData.neededByDate || "Within 2 days",
      budget: requestData.budget || 10,
      isRental: requestData.isRental ?? true,
      rentalDaysNeeded: requestData.rentalDaysNeeded || 2,
      urgency: requestData.urgency || "medium",
      status: "open",
      offersCount: 0,
      matchedListingsCount: 1,
      createdAt: new Date().toISOString(),
    };

    const updated = [newRequest, ...requests];
    setRequests(updated);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Request Broadcasted to Campus 📡",
        message: `Other verified students can now propose offers for your request.`,
        type: "system",
        timestamp: "Just now",
        isRead: false,
        linkTab: "requests",
      },
      ...prev,
    ]);

    return newRequest;
  };

  const submitOffer = (requestId: string, offerData: Partial<RequestOffer>) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          return { ...req, offersCount: req.offersCount + 1 };
        }
        return req;
      })
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Offer Submitted! 🤝",
        message: `You offered ₹${offerData.proposedPrice} on the campus request.`,
        type: "offer",
        timestamp: "Just now",
        isRead: false,
        linkTab: "requests",
      },
      ...prev,
    ]);
  };

  const acceptOffer = (requestId: string, _offerId: string) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          return { ...req, status: "fulfilled" };
        }
        return req;
      })
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Offer Accepted! 🎉",
        message: "You agreed on terms. Safe handoff scheduled at Campus Safe Hub.",
        type: "system",
        timestamp: "Just now",
        isRead: false,
        linkTab: "requests",
      },
      ...prev,
    ]);
  };

  // Double-booking check: returns false if dates overlap an active booking for this item
  const checkRentalAvailability = (listingId: string, startDate: string, endDate: string): boolean => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (isNaN(start) || isNaN(end) || start > end) return false;

    // Check existing active or confirmed rentals for same listing
    const collisions = rentals.filter((r) => {
      if (r.listingId !== listingId) return false;
      if (r.status === "cancelled" || r.status === "returned") return false;
      const rStart = new Date(r.startDate).getTime();
      const rEnd = new Date(r.endDate).getTime();

      // Check date range overlap
      return Math.max(start, rStart) <= Math.min(end, rEnd);
    });

    return collisions.length === 0;
  };

  const bookRental = (params: {
    listingId: string;
    startDate: string;
    endDate: string;
    isGroupRental: boolean;
    groupSlots?: number;
    paymentMethod: "upi" | "cash_handoff" | "demo_sandbox";
    pickupHubId: string;
  }) => {
    const listing = listings.find((l) => l.id === params.listingId);
    if (!listing) return { success: false, error: "Listing not found" };

    // Prevent double booking
    const isAvailable = checkRentalAvailability(params.listingId, params.startDate, params.endDate);
    if (!isAvailable) {
      return {
        success: false,
        error: "This item is already reserved for the selected dates. Please select alternative dates.",
      };
    }

    const start = new Date(params.startDate);
    const end = new Date(params.endDate);
    const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1);
    const dailyRate = listing.rentalRatePerDay || 5;
    const totalAmount = days * dailyRate;
    const depositAmount = listing.rentalDeposit || 20;

    const code = `CX-RENT-${Math.floor(1000 + Math.random() * 9000)}-${listing.id.slice(-4).toUpperCase()}`;

    const newBooking: RentalBooking = {
      id: `rent-${Date.now()}`,
      listingId: listing.id,
      listing,
      renter: currentUser,
      startDate: params.startDate,
      endDate: params.endDate,
      totalDays: days,
      dailyRate,
      totalAmount,
      depositAmount,
      status: "confirmed",
      isGroupRental: params.isGroupRental,
      groupSlotsTotal: params.groupSlots || 3,
      participants: params.isGroupRental
        ? [
            {
              id: `gp-${Date.now()}`,
              user: currentUser,
              shareAmount: Math.round(totalAmount / (params.groupSlots || 3)),
              hasPaid: true,
              joinedAt: new Date().toISOString().split("T")[0],
            },
          ]
        : undefined,
      pickupLocationId: params.pickupHubId,
      qrHandoffCode: code,
      isHandoffVerified: false,
      isReturnVerified: false,
      paymentMethod: params.paymentMethod,
      paymentStatus: params.paymentMethod === "cash_handoff" ? "pending_cash" : "escrow_held",
      createdAt: new Date().toISOString(),
    };

    const updatedRentals = [newBooking, ...rentals];
    setRentals(updatedRentals);
    if (typeof window !== "undefined") {
      localStorage.setItem("cx_rentals", JSON.stringify(updatedRentals));
    }

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Rental Confirmed! 📅",
        message: `Your reservation for "${listing.title}" is locked. Present your QR code at the safe pickup hub.`,
        type: "rental",
        timestamp: "Just now",
        isRead: false,
        linkTab: "rentals",
      },
      ...prev,
    ]);

    return { success: true, booking: newBooking };
  };

  const borrowItem = (params: {
    listingId: string;
    startDate?: string;
    endDate?: string;
    pickupHubId: string;
  }) => {
    const listing = listings.find((l) => l.id === params.listingId);
    if (!listing) return { success: false, error: "Listing not found" };

    const today = new Date();
    const startStr = params.startDate || today.toISOString().split("T")[0];
    const defaultEnd = new Date(today.getTime() + 86400000 * (listing.maxBorrowDays || 2));
    const endStr = params.endDate || defaultEnd.toISOString().split("T")[0];

    const code = `CX-BORROW-${Math.floor(1000 + Math.random() * 9000)}-${listing.id.slice(-4).toUpperCase()}`;

    const newBooking: RentalBooking = {
      id: `borrow-${Date.now()}`,
      listingId: listing.id,
      listing,
      renter: currentUser,
      startDate: startStr,
      endDate: endStr,
      totalDays: listing.maxBorrowDays || 2,
      dailyRate: 0,
      totalAmount: 0,
      depositAmount: 0,
      status: "confirmed",
      isGroupRental: false,
      pickupLocationId: params.pickupHubId,
      qrHandoffCode: code,
      isHandoffVerified: false,
      isReturnVerified: false,
      paymentMethod: "demo_sandbox",
      paymentStatus: "paid",
      createdAt: new Date().toISOString(),
    };

    const updatedRentals = [newBooking, ...rentals];
    setRentals(updatedRentals);
    if (typeof window !== "undefined") {
      localStorage.setItem("cx_rentals", JSON.stringify(updatedRentals));
    }

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Item Borrowed for Free! 🤝",
        message: `You borrowed "${listing.title}". Meet at the safe hub desk and return punctually.`,
        type: "rental",
        timestamp: "Just now",
        isRead: false,
        linkTab: "rentals",
      },
      ...prev,
    ]);

    return { success: true, booking: newBooking };
  };

  const joinGroupRental = (rentalId: string): boolean => {
    let joined = false;
    const updated = rentals.map((r) => {
      if (r.id === rentalId && r.isGroupRental && r.participants) {
        if (r.participants.some((p) => p.user.id === currentUser.id)) {
          return r; // already joined
        }
        if (r.participants.length < (r.groupSlotsTotal || 3)) {
          joined = true;
          const share = Math.round(r.totalAmount / (r.groupSlotsTotal || 3));
          return {
            ...r,
            participants: [
              ...r.participants,
              {
                id: `gp-${Date.now()}`,
                user: currentUser,
                shareAmount: share,
                hasPaid: true,
                joinedAt: new Date().toISOString().split("T")[0],
              },
            ],
          };
        }
      }
      return r;
    });

    if (joined) {
      setRentals(updated);
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: "Joined Group Rental! 👥",
          message: "You have secured your split-cost slot for the shared gear booking.",
          type: "rental",
          timestamp: "Just now",
          isRead: false,
          linkTab: "rentals",
        },
        ...prev,
      ]);
    }
    return joined;
  };

  const verifyQRPickup = (rentalId: string, inputCode: string): boolean => {
    let verified = false;
    const updated = rentals.map((r) => {
      if (r.id === rentalId) {
        if (r.qrHandoffCode.toUpperCase().trim() === inputCode.toUpperCase().trim()) {
          verified = true;
          return {
            ...r,
            isHandoffVerified: true,
            status: "active" as const,
            paymentStatus: r.paymentMethod === "cash_handoff" ? ("paid" as const) : r.paymentStatus,
          };
        }
      }
      return r;
    });

    if (verified) {
      setRentals(updated);
      // Award eco credits for verified physical reuse
      const ecoLog: EcoCreditAction = {
        id: `eco-${Date.now()}`,
        userId: currentUser.id,
        actionTitle: "QR Verified Peer Physical Exchange Completed",
        credits: 60,
        co2SavedKg: 8.2,
        date: "Just now",
        category: "Verified Handoff",
      };
      setEcoActions((prev) => [ecoLog, ...prev]);

      setCurrentUser((prev) => ({
        ...prev,
        greenScore: prev.greenScore + 60,
        successfulRentals: prev.successfulRentals + 1,
      }));

      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: "Safe Handoff Verified! ✅",
          message: "Campus Safe Hub confirmed physical exchange. +60 Eco-credits credited to your Trust Passport.",
          type: "eco_reward",
          timestamp: "Just now",
          isRead: false,
          linkTab: "rentals",
        },
        ...prev,
      ]);
    }

    return verified;
  };

  const confirmRentalReturn = (rentalId: string): boolean => {
    let confirmed = false;
    const updated = rentals.map((r) => {
      if (r.id === rentalId) {
        confirmed = true;
        return {
          ...r,
          isReturnVerified: true,
          status: "returned" as const,
        };
      }
      return r;
    });

    if (confirmed) {
      setRentals(updated);
      setCurrentUser((prev) => ({
        ...prev,
        greenScore: prev.greenScore + 40,
        trustScore: Math.min(100, prev.trustScore + 1),
      }));

      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: "Resource Returned Punctually! 🏆",
          message: "Thank you for supporting zero waste! Security deposit released.",
          type: "eco_reward",
          timestamp: "Just now",
          isRead: false,
          linkTab: "rentals",
        },
        ...prev,
      ]);
    }
    return confirmed;
  };

  const claimGiveaway = (listingId: string, pickupHubId: string): boolean => {
    const item = listings.find((l) => l.id === listingId);
    if (!item) return false;

    // Update listing status
    setListings((prev) =>
      prev.map((l) => {
        if (l.id === listingId) {
          return { ...l, status: "completed" };
        }
        return l;
      })
    );

    // Create eco credit
    const ecoLog: EcoCreditAction = {
      id: `eco-${Date.now()}`,
      userId: currentUser.id,
      actionTitle: `Claimed Free Community Giveaway: ${item.title}`,
      credits: 40,
      co2SavedKg: item.co2SavedKg || 4.0,
      date: "Just now",
      category: "Giveback Corner",
    };
    setEcoActions((prev) => [ecoLog, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Free Resource Claimed! 🎁",
        message: `Pickup confirmed at safe hub: ${PICKUP_HUBS.find((h) => h.id === pickupHubId)?.name || "Safe Desk"}.`,
        type: "system",
        timestamp: "Just now",
        isRead: false,
        linkTab: "explore",
      },
      ...prev,
    ]);

    return true;
  };

  // Cart Handlers
  const addToCart = (listing: Listing, options?: { rentalDays?: number; pickupHubId?: string }) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.listing.id === listing.id);
      if (existing) {
        return prev.map((item) =>
          item.listing.id === listing.id
            ? {
                ...item,
                rentalDays: options?.rentalDays || item.rentalDays,
                pickupHubId: options?.pickupHubId || item.pickupHubId,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}`,
          listing,
          rentalDays: options?.rentalDays || listing.maxBorrowDays || 2,
          pickupHubId: options?.pickupHubId || listing.pickupLocationId || "hub-1",
          addedAt: new Date().toISOString(),
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartItemDays = (cartItemId: string, days: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, rentalDays: Math.max(1, days) } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const sendChatMessage = (recipientId: string, listingId: string | undefined, text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      recipientId,
      listingId,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isRead: false,
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const reportContent = (_type: string, _id: string, reason: string) => {
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Report Received 🛡️",
        message: `Thank you for keeping CampusExchange safe. Moderation team is reviewing reason: "${reason}".`,
        type: "system",
        timestamp: "Just now",
        isRead: false,
      },
      ...prev,
    ]);
  };

  const adminApproveListing = (id: string) => {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status: "active" } : l)));
  };

  const adminRemoveListing = (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  const adminVerifyStudent = (userId: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isVerified: true } : u)));
  };


  // Academic Vault Handlers
  const uploadAcademicDocument = (docData: Partial<AcademicDocument>): AcademicDocument => {
    const newDoc: AcademicDocument = {
      id: `doc-${Date.now()}`,
      title: docData.title || "Untitled Academic Resource",
      subject: docData.subject || "General Academic",
      department: docData.department || currentUser.course.split(" ")[0] || "General",
      semester: docData.semester || currentUser.semester || 1,
      college: docData.college || currentUser.college,
      author: currentUser,
      fileType: docData.fileType || "PDF",
      pagesCount: docData.pagesCount || 16,
      fileSize: docData.fileSize || "2.8 MB",
      downloadsCount: 0,
      rating: 5.0,
      reviewsCount: 1,
      isFree: docData.isFree ?? true,
      price: docData.price || 0,
      tags: docData.tags || ["Study Guide", "Exam Notes"],
      description: docData.description || "Uploaded by verified campus peer.",
      documentType: docData.documentType || "notes",
      previewPages: docData.previewPages && docData.previewPages.length > 0
        ? docData.previewPages
        : [
            {
              pageNumber: 1,
              title: "Introduction & Key Formulations",
              excerpt: "Comprehensive lecture overview and essential formula reference.",
              keyPoints: [
                "Key theorems and fundamental definitions",
                "Worked sample problems with step-by-step solutions",
                "Professor exam tips and typical pitfall warnings",
              ],
            },
            {
              pageNumber: 2,
              title: "Core Mechanics & Derivations",
              excerpt: "Structured derivations and graphical representations.",
              keyPoints: [
                "Detailed mathematical proofs and derivations",
                "Comparative analysis table",
                "Quick review checklist for midterms",
              ],
            },
          ],
      createdAt: new Date().toISOString(),
    };

    setAcademicDocuments((prev) => [newDoc, ...prev]);

    // Eco Credit reward: Sharing study resources saves paper
    const ecoLog: EcoCreditAction = {
      id: `eco-${Date.now()}`,
      userId: currentUser.id,
      actionTitle: `Uploaded Digital Resource: ${newDoc.title}`,
      credits: 60,
      co2SavedKg: 5.2,
      date: "Just now",
      category: "Academic Vault",
    };
    setEcoActions((prev) => [ecoLog, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Academic Resource Published! 📚",
        message: `Your resource "${newDoc.title}" is now live in the Academic Vault. +60 Eco-Credits earned!`,
        type: "eco_reward",
        timestamp: "Just now",
        isRead: false,
        linkTab: "vault",
      },
      ...prev,
    ]);

    return newDoc;
  };

  const downloadAcademicDocument = (docId: string) => {
    const doc = academicDocuments.find((d) => d.id === docId);
    if (!doc) return;

    // Increment downloads count
    setAcademicDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, downloadsCount: d.downloadsCount + 1 } : d))
    );

    // Increase paper pages saved
    const savedPages = doc.pagesCount || 20;
    setPaperSavedPages((prev) => prev + savedPages);

    // Reward reader with eco-credits
    const ecoLog: EcoCreditAction = {
      id: `eco-${Date.now()}`,
      userId: currentUser.id,
      actionTitle: `Digital Download: ${doc.title}`,
      credits: 15,
      co2SavedKg: 1.2,
      date: "Just now",
      category: "Paper Conservation",
    };
    setEcoActions((prev) => [ecoLog, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Study Resource Downloaded! 📄",
        message: `Conserved ${savedPages} pages of physical paper by choosing digital study! +15 Eco-Credits.`,
        type: "eco_reward",
        timestamp: "Just now",
        isRead: false,
        linkTab: "greenscore",
      },
      ...prev,
    ]);
  };

  // Smart Exchange Handlers
  const createExchangeProposal = (proposalData: Partial<ExchangeProposal>): ExchangeProposal => {
    const targetItem = proposalData.targetListing || listings[0];
    const newProposal: ExchangeProposal = {
      id: `exch-${Date.now()}`,
      requester: currentUser,
      targetListing: targetItem,
      offeredListing: proposalData.offeredListing,
      offeredCustomItem: proposalData.offeredCustomItem,
      matchScore: proposalData.matchScore || Math.floor(Math.random() * 15) + 85,
      message: proposalData.message || "Hi, I'd love to swap items directly without exchanging money!",
      proposedPickupHubId: proposalData.proposedPickupHubId || "hub-1",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setExchangeProposals((prev) => [newProposal, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Smart Exchange Sent! 🔄",
        message: `Your barter request for "${targetItem.title}" has been transmitted to ${targetItem.seller.name}.`,
        type: "offer",
        timestamp: "Just now",
        isRead: false,
        linkTab: "exchange",
      },
      ...prev,
    ]);

    return newProposal;
  };

  const acceptExchangeProposal = (proposalId: string) => {
    setExchangeProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? { ...p, status: "accepted" } : p))
    );

    // Eco reward for both parties
    const ecoLog: EcoCreditAction = {
      id: `eco-${Date.now()}`,
      userId: currentUser.id,
      actionTitle: "Completed Circular Smart Exchange (Zero Waste Barter)",
      credits: 80,
      co2SavedKg: 12.0,
      date: "Just now",
      category: "Smart Exchange",
    };
    setEcoActions((prev) => [ecoLog, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Exchange Confirmed! 🤝",
        message: "Smart barter accepted! Both items are marked for handoff at Central Library Safe Hub.",
        type: "offer",
        timestamp: "Just now",
        isRead: false,
        linkTab: "exchange",
      },
      ...prev,
    ]);
  };

  const declineExchangeProposal = (proposalId: string) => {
    setExchangeProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? { ...p, status: "declined" } : p))
    );
  };

  // Wishlist Handler
  const toggleSaveListing = (listingId: string) => {
    setSavedListingIds((prev) =>
      prev.includes(listingId) ? prev.filter((id) => id !== listingId) : [...prev, listingId]
    );
  };

  // Auth & Student Verification Handlers
  const openAuthModal = (mode: "login" | "register" | "verify" | "forgot" = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const registerStudent = async (data: {
    name: string;
    email: string;
    college: string;
    course: string;
    semester: number;
    studentId: string;
  }) => {
    const domain = data.email.split("@")[1]?.toLowerCase() || "";
    const isDomainValid =
      domain.endsWith(".edu") ||
      domain.endsWith(".ac.in") ||
      domain.includes("campus") ||
      domain.includes("stanford") ||
      domain.includes("mit") ||
      domain.includes("berkeley") ||
      domain.includes("iit");

    if (!isDomainValid) {
      return {
        success: false,
        error: `Domain "@${domain}" is not an authorized academic email. Please provide your official college email (.edu or .ac.in).`,
      };
    }

    const newStudent: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      college: data.college,
      domain,
      course: data.course,
      semester: data.semester,
      studentId: data.studentId,
      role: "student",
      isVerified: true, // Mark verified after valid domain validation
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`,
      greenScore: 50,
      trustScore: 95,
      successfulRentals: 0,
      completedTransactions: 0,
      returnPunctuality: 100,
      badges: ["Verified Scholar", "Campus Newcomer"],
      joinedDate: "Today",
    };

    setUsers((prev) => [...prev, newStudent]);
    setCurrentUser(newStudent);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Welcome to CampusExchange! 🎓",
        message: `Your college credentials for ${data.college} were verified. Welcome +50 Eco-Credits!`,
        type: "system",
        timestamp: "Just now",
        isRead: false,
        linkTab: "home",
      },
      ...prev,
    ]);

    setIsAuthModalOpen(false);
    return {
      success: true,
      message: "Student account registered and college verified successfully!",
    };
  };

  const loginStudent = async (email: string) => {
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      setIsAuthModalOpen(false);
      return { success: true };
    }

    const domain = email.split("@")[1]?.toLowerCase() || "";
    if (domain.endsWith(".edu") || domain.endsWith(".ac.in") || domain.includes("campus")) {
      const quickUser: User = {
        id: `user-${Date.now()}`,
        name: email.split("@")[0].replace(".", " "),
        email,
        college: "Indian Institute of Technology (IIT) Bombay",
        domain,
        course: "B.Tech Computer Science",
        semester: 4,
        studentId: "CAMPUS-VERIFIED",
        role: "student",
        isVerified: true,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
        greenScore: 100,
        trustScore: 98,
        successfulRentals: 2,
        completedTransactions: 4,
        returnPunctuality: 100,
        badges: ["Verified Scholar"],
        joinedDate: "Recent",
      };
      setUsers((prev) => [...prev, quickUser]);
      setCurrentUser(quickUser);
      setIsAuthModalOpen(false);
      return { success: true };
    }

    return {
      success: false,
      error: "No student account found for this email. Please register with your .edu or .ac.in email.",
    };
  };

  const logoutStudent = () => {
    setCurrentUser(SAMPLE_USERS[0]);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Logged Out",
        message: "You have switched to demo preview account (Alex Morgan).",
        type: "system",
        timestamp: "Just now",
        isRead: false,
      },
      ...prev,
    ]);
  };

  const verifyStudentEmail = async (_email: string, otp: string) => {
    if (otp !== "123456" && otp !== "999999" && otp.length !== 6) {
      return { success: false, error: "Invalid verification code. Enter the 6-digit code sent to your student email." };
    }

    setCurrentUser((prev) => ({
      ...prev,
      isVerified: true,
      badges: prev.badges.includes("Verified Scholar")
        ? prev.badges
        : [...prev.badges, "Verified Scholar"],
      greenScore: prev.greenScore + 40,
    }));

    setIsAuthModalOpen(false);
    return { success: true };
  };

  const resetStudentPassword = async (email: string) => {
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Password Reset Dispatched 🔐",
        message: `A secure password reset link has been dispatched to ${email}.`,
        type: "system",
        timestamp: "Just now",
        isRead: false,
      },
      ...prev,
    ]);
    return { success: true, message: `Reset link dispatched to ${email}` };
  };

  // Reporting Handlers
  const openReportModal = (type: "listing" | "user", id: string, title: string) => {
    setReportModalData({ isOpen: true, type, id, title });
  };

  const closeReportModal = () => {
    setReportModalData(null);
  };

  const submitReport = (reason: string, details?: string) => {
    if (!reportModalData) return;
    reportContent(reportModalData.type, reportModalData.id, `${reason}${details ? ` - ${details}` : ""}`);
    closeReportModal();
  };

  // Earnings calculations for active user
  const userEarningsTxns = earningsTransactions.filter((t) => t.userId === currentUser.id);
  const totalEarnings = userEarningsTxns
    .filter((t) => t.type !== "withdrawal")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawn = userEarningsTxns
    .filter((t) => t.type === "withdrawal")
    .reduce((sum, t) => sum + t.amount, 0);
  const pendingEscrowEarnings = userEarningsTxns
    .filter((t) => t.status === "pending_escrow")
    .reduce((sum, t) => sum + t.amount, 0);
  const availableEarnings = Math.max(0, totalEarnings - pendingEscrowEarnings - totalWithdrawn);

  const withdrawEarnings = (amount: number, upiId: string) => {
    if (amount <= 0 || amount > availableEarnings) {
      return { success: false, message: `Invalid amount. Your available balance is ₹${availableEarnings}.` };
    }
    const cleanUpi = upiId.trim() || `${currentUser.email.split("@")[0]}@oksbi`;
    const newTxn: EarningsTransaction = {
      id: `earn-${Date.now()}`,
      userId: currentUser.id,
      title: `Instant UPI Payout to ${cleanUpi}`,
      type: "withdrawal",
      amount,
      date: "Just now",
      status: "withdrawn",
      paymentMethod: "UPI Instant",
      referenceCode: `PAYOUT-UPI-${Math.floor(10000 + Math.random() * 90000)}`,
    };
    setEarningsTransactions((prev) => [newTxn, ...prev]);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "UPI Transfer Sent! 💸",
        message: `₹${amount} was successfully sent to ${cleanUpi}. Ref: ${newTxn.referenceCode}.`,
        type: "system",
        timestamp: "Just now",
        isRead: false,
        linkTab: "earnings",
      },
      ...prev,
    ]);
    return { success: true, message: `Successfully transferred ₹${amount} to ${cleanUpi}!`, transaction: newTxn };
  };

  return (
    <CampusContext.Provider
      value={{
        currentUser,
        switchUser,
        users,
        listings,
        requests,
        rentals,
        pickupHubs,
        communityEvents,
        ecoActions,
        notifications,
        chatMessages,
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        transactionFilter,
        setTransactionFilter,
        academicDocuments,
        uploadAcademicDocument,
        downloadAcademicDocument,
        paperSavedPages,
        exchangeProposals,
        createExchangeProposal,
        acceptExchangeProposal,
        declineExchangeProposal,
        savedListingIds,
        toggleSaveListing,
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemDays,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        registerStudent,
        loginStudent,
        logoutStudent,
        verifyStudentEmail,
        resetStudentPassword,
        reportModalData,
        openReportModal,
        closeReportModal,
        submitReport,
        earningsTransactions,
        totalEarnings,
        availableEarnings,
        pendingEscrowEarnings,
        withdrawEarnings,
        addListing,
        createRequest,
        submitOffer,
        acceptOffer,
        checkRentalAvailability,
        bookRental,
        borrowItem,
        joinGroupRental,
        verifyQRPickup,
        confirmRentalReturn,
        claimGiveaway,
        sendChatMessage,
        markNotificationRead,
        reportContent,
        adminApproveListing,
        adminRemoveListing,
        adminVerifyStudent,
      }}
    >
      {children}
    </CampusContext.Provider>
  );

}

export function useCampus() {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error("useCampus must be used within a CampusProvider");
  }
  return context;
}
