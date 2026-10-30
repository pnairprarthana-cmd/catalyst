import { NextResponse } from "next/server";
import { SAMPLE_LISTINGS } from "@/lib/mockData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");
  const type = searchParams.get("type");
  const query = searchParams.get("q")?.toLowerCase();

  let results = [...SAMPLE_LISTINGS];

  if (categoryId) {
    results = results.filter((l) => l.categoryId === categoryId);
  }

  if (type && type !== "all") {
    results = results.filter((l) => l.transactionType === type);
  }

  if (query) {
    results = results.filter(
      (l) =>
        l.title.toLowerCase().includes(query) ||
        l.description.toLowerCase().includes(query) ||
        l.courseRelevant?.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({
    success: true,
    total: results.length,
    listings: results,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.categoryId) {
      return NextResponse.json(
        { success: false, error: "Title and category are required." },
        { status: 400 }
      );
    }

    const newListing = {
      id: `list-${Date.now()}`,
      title: body.title,
      description: body.description || "",
      categoryId: body.categoryId,
      condition: body.condition || "good",
      transactionType: body.transactionType || "sell",
      price: Number(body.price || 0),
      rentalRatePerDay: body.rentalRatePerDay ? Number(body.rentalRatePerDay) : undefined,
      rentalDeposit: body.rentalDeposit ? Number(body.rentalDeposit) : undefined,
      images: body.images || [
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      ],
      seller: body.seller || {
        id: "user-1",
        name: "Alex Morgan",
        email: "alex.morgan@campus.edu",
        role: "student",
      },
      status: "active",
      pickupLocationId: body.pickupLocationId || "hub-1",
      ecoCreditsAward: 50,
      co2SavedKg: 4.5,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, listing: newListing }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
