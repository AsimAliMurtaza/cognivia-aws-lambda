import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const LAMBDA_NOTES_API_URL =
  process.env.LAMBDA_NOTES_API_URL; // 🔁 replace this

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.user?.accessToken;

    console.log("Token from session:", token);  

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const skip = searchParams.get("skip") || "0";
    const limit = searchParams.get("limit") || "6";

    const lambdaRes = await fetch(
      `${LAMBDA_NOTES_API_URL}?skip=${skip}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const raw = await lambdaRes.text();
    console.log("Lambda raw response:", raw);

    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid JSON from Lambda", raw },
        { status: 500 }
      );
    }

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
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
