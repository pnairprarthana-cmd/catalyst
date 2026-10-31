# 🎓 CampusExchange (Catalyst)
> **One Campus. Everything Shared. Nothing Wasted.**

[![Next.js](https://img.shields.io/badge/Next.js-16.4.3-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![GitHub Repository](https://img.shields.io/badge/GitHub-pnairprarthana--cmd%2Fcatalyst-181717?logo=github)](https://github.com/pnairprarthana-cmd/catalyst)

---

## 📌 About the Project

**CampusExchange (Catalyst)** is a student-first, circular-economy marketplace designed for university and college campuses. Built with Next.js 16 (Turbopack, App Router), TypeScript, and Tailwind CSS, it enables verified students to borrow, buy, rent, and share academic essentials, tech equipment, handmade crafts, clothing, and hostel necessities—with zero platform fees, peer escrow safety, and real-time sustainability credits.

All pricing, deposits, and student earnings are natively calculated and displayed in **Indian Rupees (₹)** with an aesthetic palette crafted in warm **Butter Yellow (`#FEF9C3` / `#FFFBEB`)** and soft **Blush Pink (`#FCE7F3` / `#FFF5F7`)**.

---

## 🔗 Quick Links & Navigation

| Component | Target URL / Route | Description |
| :--- | :--- | :--- |
| **GitHub Repository** | [github.com/pnairprarthana-cmd/catalyst](https://github.com/pnairprarthana-cmd/catalyst) | Source code repository |
| **Developer Profile** | [github.com/pnairprarthana-cmd](https://github.com/pnairprarthana-cmd) | GitHub Profile |
| **Local Web App UI** | [http://localhost:3000](http://localhost:3000) | Main marketplace landing & interactive shell |
| **Campus Store (UI)** | `activeTab: "explore"` | Grid with filter tabs (`All`, `Store (Buy)`, `Free Borrows (₹0)`, `Rentals`, `Giveaways`) |
| **Cart & Checkout (UI)** | `activeTab: "cart"` or `/cart` | Real-time multi-item cart drawer & summary with ₹ total |
| **Student Earnings (UI)** | `activeTab: "earnings"` | Real-time earnings tracker, UPI payouts, and ledger |
| **Borrow Details (UI)** | `/borrow/[id]` | Dedicated item view with security deposit & duration controls |
| **Listing Details (UI)** | `/listing/[id]` | Single listing page with specs, seller trust rating, and reviews |
| **Karma Guidelines (UI)**| `activeTab: "karma-guidelines"` | Campus Karma & Eco-Credits Policy & 3-Step Guardrails |
| **Auth Verification API** | [`/api/auth/verify`](http://localhost:3000/api/auth/verify) | Validates `.edu` / `.ac.in` domain and issues dual OTPs |
| **Listings Data API** | [`/api/listings`](http://localhost:3000/api/listings) | Query, search, filter, and create active listings |
| **Rentals Engine API** | [`/api/rentals`](http://localhost:3000/api/rentals) | Date-range validation & double-booking collision prevention |

---

## 🖥️ User Interface (UI) Architecture & Key Views

### 1. 🌸 Signature Butter Yellow & Blush Pink Aesthetic
- **Hero Section**: Full-bleed hero banner blending campus architectural aesthetics with warm butter yellow (`#FFFBEB`) to pastel blush pink (`#FCE7F3`), live stats counters, and marquee announcements.
- **Micro-Interactions**: Smooth hover elevations, rounded corner surfaces (`rounded-2xl` / `rounded-3xl`), and badge pills.

### 2. 🛍️ Campus Store, Rentals & Free Borrows
- **Free Campus Borrows (₹0)**: Textbooks, lab coats, and essentials shared at zero rental charge.
- **Student Crafts & Hampers**: Student-made crochet, gifts, custom stationery, and festive hampers.
- **Peer Equipment Rentals**: Lab electronics, calculators, DSLR cameras, and sports gear with daily rates and refundable security deposits.
- **Smart Filtering & Search**: Category chips, keyword search, price sorting, and condition tags.

### 3. 💰 Student Earnings Dashboard & UPI Wallet
- **Total Earned**: Lifetime student revenue across store sales, craft commissions, and rentals.
- **Available Balance**: Immediately withdrawable funds.
- **In Escrow (Safe Desks)**: Funds held securely in escrow pending pickup confirmation.
- **Peer Savings Generated**: Measurable amount saved for batchmates.
- **Direct UPI Withdrawal Modal**: Quick withdrawal presets (`₹500`, `₹1,000`, `₹2,000`, or `All`), UPI VPA validation (`student@okaxis`), and simulated instant settlements.
- **Persistent Navbar Pill**: Always visible `Earned: ₹[Amount]` pill with direct wallet access.

### 4. 🛒 Campus Shopping Cart & Drawer
- Slide-over cart drawer and dedicated `/cart` route supporting simultaneous items.
- Itemized pricing, transaction type indicators (`Rent`, `Buy`, `Borrow`), refundable security deposit summaries, and verified campus checkout flow.

### 5. 📡 Demand Board ("Need It? Post It!")
- Students broadcast urgent requests (e.g., *"Casio fx-991EX for tomorrow's midterm"*).
- Peers submit direct offers with custom pricing or linked listings.

### 6. 🌿 GreenScore, Eco-Credits & Karma Guidelines
- **LCA Carbon Rationale**:
  - Reusing a textbook avoids **~4.5 kg CO₂** and **1,200 L of water**.
  - Reusing electronics/lab kits avoids **~14.5 kg CO₂** and hazardous e-waste.
- **Campus Karma & Eco-Credits Policy**:
  - **+3 Karma Points** per verified item listed/dedicated.
  - **+5 Karma Points** upon verified return cycle completion.
  - **50-Point Milestone**: Unlocks campus canteen discount coupons, sponsored giveaways, and freebie drop passes.
- **3-Step Algorithmic Guardrails**:
  1. *Velocity Capping*: 14-day rolling window restriction on repeat peer pairs.
  2. *Verified Physical Handoff*: Dual OTP or QR code verification at campus pickup zones.
  3. *Substantive Cycle Thresholds*: Points awarded strictly on mutual return review, never on cart holds.

### 7. 🛡️ Trust Passport & Admin Control Center
- Student verification ratings (0–100% Trust Score).
- Admin dashboard for queue verification, user roles, listing flagging, and immutable moderation audit logs.

---

## ⚙️ Backend & API Architecture

### API Routes Overview

```
src/app/api/
├── auth/
│   └── verify/
│       └── route.ts         # POST: Campus institutional email & dual OTP authentication
├── listings/
│   └── route.ts             # GET: Query listings with filters | POST: Create listing
└── rentals/
    └── route.ts             # POST: Create collision-free reservation | GET: Fetch active rentals
```

### 1. Verification Engine (`/api/auth/verify`)
- **Domain Gatekeeping**: Restricts registration to `.edu` and `.ac.in` university domains (e.g., `srmist.edu.in`, `iitb.ac.in`, `mit.edu`, `stanford.edu`).
- **OTP Verification**: Emits single-use cryptographic verification codes for login and peer handoffs.

### 2. Collision-Safe Rental Engine (`/api/rentals`)
- Validates reservation date intervals:
  $$\text{Overlap} \iff (\text{RequestedStart} \le \text{ExistingEnd}) \land (\text{RequestedEnd} \ge \text{ExistingStart})$$
- Ensures zero double-booking for shared hardware and lab sensors.

### 3. Database Schema (`prisma/schema.prisma`)
- Normalized models for `User`, `Listing`, `Rental`, `Request`, `Offer`, `EcoAction`, `Review`, `AuditLog`, and `EarningsTransaction`.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database / ORM**: [Prisma ORM](https://www.prisma.io/)
- **State Management**: React Context (`CampusContext.tsx`) with real-time reactive updates
- **Testing**: Node.js automated test suite (`src/__tests__/run-tests.js`)

---

## 📂 Project Directory Structure

```
catalyst/
├── prisma/
│   └── schema.prisma             # Relational database schema
├── public/                       # Static public assets and campus badges
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # Backend REST API route handlers
│   │   │   ├── auth/verify/      # Campus email verification endpoint
│   │   │   ├── listings/         # Marketplace listings endpoint
│   │   │   └── rentals/          # Reservation & collision-check endpoint
│   │   ├── borrow/[id]/          # Dedicated borrow item view
│   │   ├── cart/                 # Cart & checkout views
│   │   ├── listing/[id]/         # Product detail dynamic route
│   │   ├── globals.css           # Custom design tokens & animations
│   │   ├── layout.tsx            # Root HTML layout & metadata
│   │   └── page.tsx              # Main marketplace dashboard & active tab router
│   ├── components/               # Modular UI views & widgets
│   │   ├── AddListingModal.tsx   # Modal to list items with pricing/borrow toggles
│   │   ├── AdminDashboardView.tsx# Campus moderation & verification queue
│   │   ├── BottomNav.tsx         # Mobile bottom navigation bar
│   │   ├── CampusPickupNetworkView.tsx # Safe physical pickup desks
│   │   ├── CampusTrustPassportView.tsx # Verified student trust profile
│   │   ├── CartDrawer.tsx        # Slide-over cart drawer
│   │   ├── ChatDrawer.tsx        # In-app peer messaging
│   │   ├── CommunityEventsView.tsx # Swap meets & repair workshops
│   │   ├── GivebackCornerView.tsx# 100% free resource donation hub
│   │   ├── GreenScoreView.tsx    # Eco-credits & leaderboard
│   │   ├── GroupRentalsView.tsx  # Shared equipment cost-splitting
│   │   ├── KarmaGuidelinesView.tsx # Karma & Eco-Credits Policy & Guardrails
│   │   ├── ListingDetailModal.tsx# Fast modal preview
│   │   ├── Navbar.tsx            # Header with search, earnings pill, cart, profile
│   │   ├── ProductCard.tsx       # Standardized custom card component
│   │   ├── RentalManagementView.tsx # Borrowing/lending calendar tracker
│   │   ├── RequestBoardView.tsx  # "Need It? Post It!" board
│   │   ├── Sidebar.tsx           # Desktop navigation sidebar
│   │   └── StudentEarningsView.tsx # Earnings ledger & UPI withdrawal
│   ├── context/
│   │   └── CampusContext.tsx     # Global marketplace state & handlers
│   ├── lib/
│   │   ├── mockData.ts           # Curated listings, transactions, users
│   │   └── utils.ts              # Helper functions & formatting utilities
│   └── types/
│       └── index.ts              # Core TypeScript models & schemas
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.18 or higher (Node 20+ recommended)
- **npm** or **yarn** or **pnpm**
- **Git**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/pnairprarthana-cmd/catalyst.git
   cd catalyst
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   ```bash
   cp .env.example .env
   ```

4. **Run the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🧪 Automated Testing

Execute the test suite to verify collision prevention, domain validation, and group splits:
```bash
node src/__tests__/run-tests.js
```

All 7 core test suites cover:
1. Double-booking date collision detection
2. Overlap boundary condition validation
3. Non-overlapping reservation approvals
4. Approved educational domain enforcement (`.edu`, `.ac.in`)
5. Unauthorized commercial domain rejection
6. LCA carbon & water avoidance calculation formulas
7. Fair integer group rental cost & deposit splitting

---

## 👥 Demo Personas (Switchable via Navbar)

| Persona | Role | Department / Semester | GreenScore | Trust |
| :--- | :--- | :--- | :--- | :--- |
| **Alex Morgan** | Student (Seller & Renter) | B.Tech Computer Science (Sem 6) | 480 pts | 98% |
| **Priya Sharma** | Student (Craft Creator) | B.S. Biotechnology (Sem 4) | 680 pts | 99% |
| **Marcus Vance** | Student (Lab Equipment) | B.Tech Mechanical (Sem 8) | 350 pts | 96% |
| **Sarah Miller** | Administrator | Safety & Sustainability Council | 1,200 pts | 100% |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
Developed with ❤️ by [pnairprarthana-cmd](https://github.com/pnairprarthana-cmd).
