/**
 * This module handles saving image data to AWS S3 storage.
 * It takes base64-encoded image data from an API response, converts it to a buffer,
 * and uploads it to S3 with a structured path (userId/subfolder/imageName).
 * The function returns the public URL of the uploaded image.
 * 
 * @requires @aws-sdk/client-s3
 * @requires @aws-sdk/lib-storage
 */

import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

export async function saveImageData(jsonResponse, subfolder, timestamp, userId) {
    const base64ImageData = jsonResponse.images ? jsonResponse.images[0] : jsonResponse.output.images[0];
    
    if (!base64ImageData) {
        throw new Error('No image data received from external API.');
    }

    const imageData = Buffer.from(base64ImageData, 'base64');
    const imageName = `image_${timestamp}.png`;
    const s3Key = `${userId}/${subfolder}/${imageName}`;

    // Initialize S3 client
    const s3Client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });

    // Upload to S3
    try {
        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: s3Key,
                Body: imageData,
                ContentType: 'image/png',
            },
        });

        await upload.done();
        // console.log(`Image uploaded to S3: ${s3Key}`);

        // Return the S3 URL
        const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
        return imageUrl;
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw error;
    }
}
