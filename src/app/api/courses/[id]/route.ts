import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import connectDB from "@/lib/mongodb";
import CourseModel from "@/models/Course";


const LAMBDA_URL =
   process.env.LAMBDA_COURSES_CRUD_URL || "";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.accessToken;

  const res = await fetch(`${LAMBDA_URL}?courseId=${params.id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session?.user?.role !== "teacher") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const updates = await req.json();
  const updated = await CourseModel.findOneAndUpdate(
    { _id: params.id, createdBy: session.user.id },
    updates,
    { new: true }
  );

  if (!updated) {
    return NextResponse.json(
      { error: "Not found or not allowed" },
      { status: 404 }
    );
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session?.user?.role !== "teacher") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const deleted = await CourseModel.findOneAndDelete({
    _id: params.id,
    createdBy: session.user.id,
  });

  if (!deleted) {
    return NextResponse.json(
      { error: "Not found or not allowed" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Deleted successfully" });
}