import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const LAMBDA_QUIZ_URL =
    process.env.LAMBDA_QUIZ_URL || "";

export async function GET(
  req: NextRequest,
  { params }: { params: { userID: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.user?.accessToken;
    const { userID } = params;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session?.user?.id !== userID) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const lambdaRes = await fetch(`${LAMBDA_QUIZ_URL}?userID=${session.user.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    const data = await lambdaRes.json();

    if (!lambdaRes.ok) {
      return NextResponse.json(
        { error: "Lambda error", details: data },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Proxy Error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
