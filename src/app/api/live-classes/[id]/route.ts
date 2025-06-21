import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import LiveClass from "@/models/LiveClass"; // Update path if needed

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const liveClass = await LiveClass.findById(params.id);

    if (!liveClass) {
      return NextResponse.json(
        { error: "Live class not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(liveClass);
  } catch (err) {
    console.error("Error fetching live class:", err);
    return NextResponse.json(
      { error: "Failed to fetch live class" },
      { status: 500 }
    );
  }
}
