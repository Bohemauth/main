import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

const bucketName = process.env.BUCKET;

async function uploadToSevalla(fileBuffer, fileName, contentType) {
  try {
    const uploadParams = {
      Bucket: bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    const url = `${process.env.PUBLIC_URL}/${fileName}`;

    return url;
  } catch (error) {
    console.error("Error uploading to Sevalla:", error);
    throw error;
  }
}

export { s3Client, bucketName, uploadToSevalla };
