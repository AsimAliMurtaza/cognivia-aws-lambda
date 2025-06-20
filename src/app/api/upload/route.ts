import { NextRequest } from "next/server";
import { uploadFileToS3 } from "@/lib/s3";

export const routeSegmentConfig = {
  runtime: "nodejs",
};
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return new Response(JSON.stringify({ error: "No file uploaded" }), {
      status: 400,
    });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const url = await uploadFileToS3(
    buffer,
    file.name,
    file.type || "application/octet-stream"
  );

  return new Response(JSON.stringify({ url }), { status: 200 });
}
