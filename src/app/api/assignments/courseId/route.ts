// GET /api/assignments/[courseId]
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Assignment from "@/models/Assignment";

export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  await connectDB();
  const assignments = await Assignment.find({ courseId: params.courseId }).sort(
    { dueDate: 1 }
  );
  return NextResponse.json(assignments);
}

