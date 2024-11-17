import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { S3 } from '@aws-sdk/client-s3';

const s3 = new S3({
  region: process.env.AWS_REGION
});

async function serveImages(imagePath) {
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

async function deleteImage(imagePath) {
  // Delete both image and its parameter file
  const imageParams = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: imagePath
  };

  const txtParams = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: imagePath.replace(/\.(png|jpg|jpeg|gif|webp)$/i, '.txt')
  };

  // Delete both files in parallel
  await Promise.all([
    s3.deleteObject(imageParams),
    s3.deleteObject(txtParams)
  ]);
}

export { serveImages, deleteImage };