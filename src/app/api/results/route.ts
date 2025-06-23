// app/api/results/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const LAMBDA_RESULTS_URL = process.env.LAMBDA_RESULTS_URL || "";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.user?.accessToken;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const lambdaRes = await fetch(LAMBDA_RESULTS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await lambdaRes.json();

    if (!lambdaRes.ok) {
      return NextResponse.json(
        { error: "Lambda error", details: data },
        { status: lambdaRes.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
