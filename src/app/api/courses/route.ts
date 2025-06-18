import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Course from "@/models/Course";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { generateJoinCode } from "@/lib/generateJoinCode";

export async function POST(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session || session?.user?.role !== "teacher") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { title, description, subject, level } = await req.json();
  const code = generateJoinCode();

  const course = await Course.create({
    title,
    description,
    subject,
    level,
    createdBy: session.user.id,
    joinCode: code,
    assignments: [],
    students: [],
  });

  return NextResponse.json(course);
}

export async function GET() {
  await connectDB();
  const courses = await Course.find().populate("createdBy", "name email");
  return NextResponse.json(courses);
}
