// app/api/courses/[id]/unenroll/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Course from "@/models/Course";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const userId = session?.user?.id;
  const courseId = params.id;

  const course = await Course.findById(courseId);
  if (!course)
    return NextResponse.json({ message: "Course not found" }, { status: 404 });

  // Remove user from course's students array
  await Course.findByIdAndUpdate(courseId, {
    $pull: { students: userId },
  });

  return NextResponse.json({ message: "Unenrolled successfully" });
}
