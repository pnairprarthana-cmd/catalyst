import { NextResponse } from "next/server";
import { SAMPLE_RENTALS, SAMPLE_LISTINGS } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json({
    success: true,
    total: SAMPLE_RENTALS.length,
    rentals: SAMPLE_RENTALS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { listingId, startDate, endDate, renterId, isGroupRental, groupSlots } = body;

    if (!listingId || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: "listingId, startDate, and endDate are required." },
        { status: 400 }
      );
    }

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (isNaN(start) || isNaN(end) || start > end) {
      return NextResponse.json(
        { success: false, error: "Invalid date range." },
        { status: 400 }
      );
    }

    // SERVER-SIDE DOUBLE BOOKING COLLISION DETECTION
    const existingCollisions = SAMPLE_RENTALS.filter((r) => {
      if (r.listingId !== listingId) return false;
      if (r.status === "cancelled" || r.status === "returned") return false;
      const rStart = new Date(r.startDate).getTime();
      const rEnd = new Date(r.endDate).getTime();
      return Math.max(start, rStart) <= Math.min(end, rEnd);
    });

    if (existingCollisions.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Double-booking collision prevented! This item is already reserved for the chosen date range.",
        },
        { status: 409 }
      );
    }

    const listing = SAMPLE_LISTINGS.find((l) => l.id === listingId);
    const days = Math.max(1, Math.round((end - start) / (1000 * 3600 * 24)) + 1);
    const dailyRate = listing?.rentalRatePerDay || 5;
    const total = days * dailyRate;

    const newBooking = {
      id: `rent-${Date.now()}`,
      listingId,
      renterId: renterId || "user-1",
      startDate,
      endDate,
      totalDays: days,
      dailyRate,
      totalAmount: total,
      depositAmount: listing?.rentalDeposit || 20,
      status: "confirmed",
      isGroupRental: Boolean(isGroupRental),
      groupSlotsTotal: groupSlots || 3,
      qrHandoffCode: `CX-RENT-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, booking: newBooking }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
