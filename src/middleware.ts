import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.ip ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";

  const userAgent = req.headers.get("user-agent") || "unknown";

  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isDashboardRoute = req.nextUrl.pathname.startsWith("/dashboard");
  const isUserDashboard = isDashboardRoute && !isAdminRoute;

  if (!token && isDashboardRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAdminRoute && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isUserDashboard && token?.role === "admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

    if (isUserDashboard && token?.role === "teacher") {
    return NextResponse.redirect(new URL("/teacher/classes", req.url));
  }

  let userAction = "";
  if (token?.role === "admin") {
    userAction = "View Admin Dashboard";
  } else {
    userAction = "View User Dashboard";
  }

  await fetch(`${process.env.NEXTAUTH_URL}/api/logging/audit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: token?.id,
      userEmail: token?.email,
      role: token?.role,
      action: userAction,
      type: "action",
      ip,
      userAgent,
    }),
  });

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/teacher/:path*"],
};
