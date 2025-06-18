import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
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

export const deleteFileFromS3 = async (fileUrl: string) => {
  try {
    const bucketName = process.env.S3_BUCKET_NAME!;
    const expectedPrefix = `https://${bucketName}.s3.amazonaws.com/`;

    if (!fileUrl.startsWith(expectedPrefix)) {
      throw new Error("Invalid file URL");
    }

    const encodedKey = fileUrl.replace(expectedPrefix, "");
    const decodedKey = decodeURIComponent(encodedKey);

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: decodedKey,
    });

    await s3.send(command);
    console.log(`Deleted from S3: ${decodedKey}`);
  } catch (error) {
    console.error("Failed to delete from S3:", error);
    throw error;
  }
};
