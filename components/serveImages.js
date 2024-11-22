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

async function deleteImage(imagePath, userId) {
  // Construct the full S3 key with userId/subfolder/filename
  const fullPath = `${userId}/${imagePath}`;
  console.log('Attempting to delete S3 object:', fullPath);

  const imageParams = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fullPath
  };

  const txtParams = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fullPath.replace(/\.(png|jpg|jpeg|gif|webp)$/i, '.txt')
  };

  try {
    await Promise.all([
      s3.deleteObject(imageParams),
      s3.deleteObject(txtParams)
    ]);
    console.log('Successfully deleted:', fullPath);
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw error;
  }
}

export { serveImages, deleteImage };