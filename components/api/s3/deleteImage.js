/**
 * AWS S3 Image Service Module - Image Deletion
 * 
 * Provides functionality for deleting images and associated text files from AWS S3.
 * 
 * Environment variables required:
 * - AWS_REGION
 * - AWS_S3_BUCKET
 */
import { S3 } from '@aws-sdk/client-s3';

const s3 = new S3({
  region: process.env.AWS_REGION
});

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

export { deleteImage }; 