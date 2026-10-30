# CampusExchange 2.0
> **One Campus. Everything Shared. Nothing Wasted.**

A production-ready, mobile-first, student-only circular-economy ecosystem and marketplace. Built with Next.js, TypeScript, Tailwind CSS, and Prisma ORM.

---

## 🚀 Live Local Application
The application is currently running locally:
- **URL**: [http://localhost:3000](http://localhost:3000)
- **Status**: Live & fully interactive

---

## 🌟 Key Application Modules & Innovations

### 1. 🛡️ Authentication & Campus Trust Passport
- **Institutional Domain Validation**: Strictly requires `.edu` / `.ac.in` email addresses (e.g., `@campus.edu`, `@stanford.edu`, `@mit.edu`).
- **Campus Trust Score**: Transparent 0–100 scoring based on verified completed transactions, 5.0-star reviews, and a 99% equipment return punctuality rate.
- **Earned Badges**: "Verified Scholar", "Zero-Waste Champion", "Prompt Returner", and "Safe Trader".

### 2. 📦 9 Campus Marketplace Categories
1. **Academic Notes & Study Kits** (Handwritten cheat-sheets, past exam compendiums)
2. **Textbooks & Reference Books** (Campbell Biology, Engineering Math, Algorithm guides)
3. **Lab Equipment & Practical Kits** (Arduino IoT sensors, breadboards, microscopes)
4. **Electronics & Accessories** (Casio scientific calculators, monitors, noise-canceling headphones)
5. **Festival Clothing & Traditional Outfits** (Cultural fest kurtas, presentation blazers)
6. **Sports Equipment** (Badminton rackets, campus cycles, dumbbells)
7. **Hostel & Lifestyle Essentials** (Fast-boil kettles, LED lamps, underbed organizers)
8. **Project Materials & Tools** (Soldering stations, foam boards, 3D printing filaments)
9. **Free Resources & Giveback** (100% free donations for incoming freshers)

### 3. 📡 "NEED IT? POST IT!" — Demand-Driven Board
- Students broadcast urgent equipment needs (e.g. *"Casio fx-991EX for tomorrow's midterm"*).
- Verified peers submit direct loan offers with custom pricing or linked active listings.
- Real-time offer acceptance and notification triggers.

### 4. 🧠 Smart Campus Match
- Explainable recommendation engine matching listings to student's exact course and semester (e.g., *“Matched because you're in B.Tech Computer Science Sem 6”*).

### 5. 👥 Group Rentals & Shared Kits
- Co-rent expensive equipment (e.g., Sony Alpha 7 IV Cinema Kit, drone components, surveying kits).
- Automatically splits total cost and security deposits evenly among participants (e.g. $40/student).

### 6. 📅 Rental Collision Prevention Engine
- Dynamic date-range availability validation preventing double bookings.
- Overlap collision detection backed by transaction constraints.

### 7. 📍 Campus Safe Pickup Network & QR Handoff
- University-approved physical exchange hubs:
  - *Central Library Lobby (Safe Desk A)*
  - *Student Activity Center (SAC) Atrium*
  - *Hostel Quad Security Hub (24/7 Gate 2)*
  - *Engineering Block 3 Innovation Lab*
- Generated high-resolution digital QR code and alphanumeric tokens. Scanning and confirming the handoff releases escrow and deposits Eco-Credits.

### 8. 🌿 GreenScore & Gamified Eco-Credits
- Transparent LCA-based carbon calculation:
  - Reusing a textbook avoids **~4.5 kg CO2** & **1,200L water**.
  - Reusing electronics/lab gear avoids **~14.5 kg CO2** & hazardous e-waste.
- Live campus leaderboards (Weekly, Monthly, Hostel Quads).
- Collective Campus 1-Ton CO2 Avoidance milestone tracker.

### 9. 🎁 Giveback Corner (100% Free Resources)
- Dedicated zero-dollar community donation section for seniors passing gear to freshers.

### 10. 💬 In-App Campus Messaging
- Real-time buyer/seller chat with pinned listing context and quick prompt shortcuts.

### 11. 🛡️ Admin & Moderation Control Center
- Verification queue for university email and student ID approvals.
- Real-time listing flagging and content removal.
- Immutable moderation audit log.

---

## 👥 Demo Test Accounts (Quick-Switcher in Navbar)

| Name | Role | Course / Dept | GreenScore | Trust |
| :--- | :--- | :--- | :--- | :--- |
| **Alex Morgan** | Student | B.Tech Computer Science (Sem 6) | 480 pts | 98% |
| **Priya Sharma** | Student | B.S. Biotechnology (Sem 4) | 680 pts | 99% |
| **Marcus Vance** | Student | B.Tech Mechanical (Sem 8) | 350 pts | 96% |
| **Admin Sarah Miller** | Administrator | Safety & Sustainability Council | 1,200 pts | 100% |

*Switch profiles instantly using the profile avatar in the top-right navbar.*

---

## 🛠️ Tech Stack & Architecture

- **Frontend Framework**: Next.js 16 (Turbopack, App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 with custom design tokens (Deep Navy `#0B132B`, Electric Cyan `#00F2FE`, Fresh Green `#10B981`, Violet `#8B5CF6`)
- **Database & ORM**: Prisma ORM with normalized relational schema (`prisma/schema.prisma`)
- **Icons**: Lucide React
- **Verification**: QR Code Generation & Cryptographic Token Verification

---

## 🧪 Running Automated Tests

Run the core engine test suite:
```bash
node src/__tests__/run-tests.js
```

All 7 core test suites test:
1. Double-booking collision detection
2. Overlap edge-case validation
3. Non-overlapping reservation clearance
4. Approved campus domain enforcement
5. Commercial domain rejection
6. Eco-credit reward formulas
7. Integer group rental cost splitting

---

## 📜 Environment Configuration

Refer to [`.env.example`](file:///c:/Users/Loq/catalyst/.env.example) for all variables.
