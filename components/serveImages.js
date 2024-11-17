import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

export async function serveImages(imagePath) {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: imagePath,
  });

  return s3Client.send(command);
}