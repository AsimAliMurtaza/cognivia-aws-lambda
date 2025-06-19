// src/app/api/courses/student/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import Course from "@/models/Course";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session?.user?.id;

  const courses = await Course.find({ students: userId }).populate("teacher");
  if (!courses || courses.length === 0) {
    return NextResponse.json({ message: "No courses found" }, { status: 404 });
  }
  return NextResponse.json({ courses });
}
