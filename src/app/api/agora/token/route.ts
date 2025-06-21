import { NextRequest, NextResponse } from "next/server";
import { RtcTokenBuilder, RtcRole } from "agora-access-token";

const appID = process.env.AGORA_APP_ID!;
const appCertificate = process.env.AGORA_APP_CERT!;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const channelName = searchParams.get("channelName")!;
  const uid = Number(searchParams.get("uid") || "0");

  const role = RtcRole.PUBLISHER;
  const expireTime = Math.floor(Date.now() / 1000) + 3600;

  const token = RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channelName,
    uid,
    role,
    expireTime
  );
  return NextResponse.json({ token });
}
