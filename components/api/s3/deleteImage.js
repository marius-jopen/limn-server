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
  // Ensure we're using the correct folder structure
  const fullPath = `${userId}/image-1111-runpod-serverless/${imagePath.split('/').pop()}`;
  
  console.log('Full S3 path for deletion:', fullPath);

  const imageParams = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fullPath
  };

  const txtParams = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fullPath.replace(/\.(png|jpg|jpeg|gif|webp)$/i, '.txt')
  };

  try {
    // Add a check to verify the object exists before deletion
    console.log('Attempting to delete:', imageParams);
    const imageDeleteResponse = await s3.deleteObject(imageParams);
    console.log('Image delete response:', imageDeleteResponse);

    console.log('Attempting to delete txt:', txtParams);
    const txtDeleteResponse = await s3.deleteObject(txtParams);
    console.log('Text file delete response:', txtDeleteResponse);

    return { imageDeleteResponse, txtDeleteResponse };
  } catch (error) {
    console.error('Error deleting from S3:', {
      error: error.message,
      code: error.code,
      bucket: process.env.AWS_S3_BUCKET,
      path: fullPath
    });
    throw error;
  }
}

export { deleteImage }; 