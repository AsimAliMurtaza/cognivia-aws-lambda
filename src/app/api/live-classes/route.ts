import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import LiveClass from "@/models/LiveClass";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Course from "@/models/Course";

export async function POST(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, courseId, scheduledAt } = await req.json();
  const channelName = `course_${courseId}_${Date.now()}`;

  const newClass = await LiveClass.create({
    title,
    channelName,
    scheduledAt,
    courseId,
    createdBy: session?.user?.id,
  });

  await Course.findByIdAndUpdate(courseId, {
    $push: { liveClasses: newClass._id }, // or add a direct link
  });

  return NextResponse.json(newClass);
}

export async function GET() {
  await dbConnect();
  const classes = await LiveClass.find()
    .sort({ scheduledAt: -1 })
    .populate("courseId", "name");
  return NextResponse.json(classes);
}
