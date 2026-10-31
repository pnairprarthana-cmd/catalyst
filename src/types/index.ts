export type UserRole = "student" | "moderator" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  domain: string;
  course: string;
  semester: number;
  studentId: string;
  role: UserRole;
  isVerified: boolean;
  avatar: string;
  greenScore: number;
  trustScore: number; // 0 to 100
  successfulRentals: number;
  completedTransactions: number;
  returnPunctuality: number; // e.g. 98%
  badges: string[];
  joinedDate: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  itemCount: number;
  color: string;
}

export type ListingCondition = "brand_new" | "like_new" | "good" | "fair";
export type TransactionType = "borrow" | "rent" | "sell" | "exchange" | "giveaway";
export type ListingStatus = "active" | "reserved" | "rented" | "borrowed" | "sold" | "completed";

export interface Listing {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  condition: ListingCondition;
  transactionType: TransactionType;
  price: number;
  rentalRatePerDay?: number;
  rentalDeposit?: number;
  maxBorrowDays?: number;
  images: string[];
  seller: User;
  status: ListingStatus;
  pickupLocationId: string;
  courseRelevant?: string;
  semesterRelevant?: number;
  rating: number;
  reviewsCount: number;
  ecoCreditsAward: number;
  co2SavedKg: number;
  eWasteAvoidedKg?: number;
  createdAt: string;
  views: number;
  likes: number;
  isFeatured?: boolean;
}

export type UrgencyLevel = "low" | "medium" | "high" | "urgent";

export interface RequestItem {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  student: User;
  neededByDate: string;
  budget: number;
  isRental: boolean;
  rentalDaysNeeded?: number;
  urgency: UrgencyLevel;
  status: "open" | "fulfilled" | "expired";
  offersCount: number;
  matchedListingsCount: number;
  createdAt: string;
}

export interface RequestOffer {
  id: string;
  requestId: string;
  offerer: User;
  listingId?: string;
  message: string;
  proposedPrice: number;
  isRental: boolean;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

export interface GroupParticipant {
  id: string;
  user: User;
  shareAmount: number;
  hasPaid: boolean;
  joinedAt: string;
}

export interface RentalBooking {
  id: string;
  listingId: string;
  listing: Listing;
  renter: User;
  startDate: string;
  endDate: string;
  totalDays: number;
  dailyRate: number;
  totalAmount: number;
  depositAmount: number;
  status: "pending_approval" | "confirmed" | "active" | "returned" | "overdue" | "cancelled";
  isGroupRental: boolean;
  groupSlotsTotal?: number;
  participants?: GroupParticipant[];
  pickupLocationId: string;
  qrHandoffCode: string;
  isHandoffVerified: boolean;
  isReturnVerified: boolean;
  paymentMethod: "upi" | "cash_handoff" | "demo_sandbox";
  paymentStatus: "paid" | "escrow_held" | "pending_cash" | "refunded";
  createdAt: string;
}

export interface CampusPickupHub {
  id: string;
  name: string;
  zone: string;
  landmark: string;
  operatingHours: string;
  securityStaffPresent: boolean;
  instructions: string;
  badgeText: string;
  activeExchangesCount: number;
}

export interface EcoCreditAction {
  id: string;
  userId: string;
  actionTitle: string;
  credits: number;
  co2SavedKg: number;
  date: string;
  category: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  organizer: User;
  eventType: "drive" | "swap_meet" | "challenge" | "announcement";
  eventDate: string;
  location: string;
  participantsCount: number;
  itemsTarget: number;
  itemsCurrent: number;
  imageUrl: string;
  badge: string;
}

export interface Review {
  id: string;
  author: User;
  rating: number;
  comment: string;
  punctualityScore: number; // 1-5
  itemConditionMatch: boolean;
  date: string;
}

export interface DocumentPreviewPage {
  pageNumber: number;
  title: string;
  excerpt: string;
  keyPoints: string[];
}

export interface AcademicDocument {
  id: string;
  title: string;
  subject: string;
  department: string;
  semester: number;
  college: string;
  author: User;
  fileType: "PDF" | "DOCX";
  pagesCount: number;
  fileSize: string;
  downloadsCount: number;
  rating: number;
  reviewsCount: number;
  isFree: boolean;
  price?: number;
  tags: string[];
  description: string;
  documentType: "notes" | "question_paper" | "lab_record" | "cheatsheet";
  previewPages: DocumentPreviewPage[];
  downloadUrl?: string;
  createdAt: string;
}

export interface ExchangeProposal {
  id: string;
  requester: User;
  targetListing: Listing;
  offeredListing?: Listing;
  offeredCustomItem?: {
    title: string;
    description: string;
    condition: ListingCondition;
    estimatedValue: number;
    categoryName: string;
    imageUrl: string;
  };
  matchScore: number; // e.g. 92%
  message: string;
  proposedPickupHubId: string;
  status: "pending" | "accepted" | "declined" | "completed";
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  department: string;
  college: string;
  avatar: string;
  quote: string;
  savedAmount: string;
  ecoContribution: string;
  rating: number;
}

export interface EarningsTransaction {
  id: string;
  userId: string;
  title: string;
  type: "store_sale" | "rental_income" | "craft_order" | "escrow_cleared" | "withdrawal";
  amount: number; // in Rupees
  date: string;
  status: "credited" | "pending_escrow" | "withdrawn" | "processing";
  buyerOrRenterName?: string;
  buyerAvatar?: string;
  paymentMethod: "UPI Instant" | "Campus Safe Desk" | "Direct Bank";
  referenceCode: string;
  category?: string;
}


