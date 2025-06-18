import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Course from "@/models/Course";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { joinCode } = body;

  const course = await Course.findOne({ joinCode });
  if (!course) {
    return NextResponse.json({ error: "Invalid code" }, { status: 404 });
  }

  if (course.students.includes(session?.user?.id)) {
    return NextResponse.json({ message: "Already enrolled" });
  }

  course.students.push(session?.user?.id);
  await course.save();

  return NextResponse.json({ message: "Joined successfully", course });
}
