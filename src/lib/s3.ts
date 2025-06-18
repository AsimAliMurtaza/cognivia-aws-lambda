import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadFileToS3(
  buffer: Buffer,
  filename: string,
  mimetype: string
) {
  const key = `${randomUUID()}-${filename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
  });

  await s3.send(command);

  return `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
}
