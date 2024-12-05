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

export async function saveImageDataComfy(jsonResponse, subfolder, timestamp, userId) {
    // Log the response structure to debug
    console.log('Processing image object:', {
        hasOutput: !!jsonResponse.output,
        hasImages: !!jsonResponse.output?.images,
        firstImageKeys: Object.keys(jsonResponse.output?.images?.[0] || {})
    });

    // Get the first image object
    const imageObject = jsonResponse.output.images[0];
    
    if (!imageObject || typeof imageObject !== 'object') {
        console.error('Invalid image object:', imageObject);
        throw new Error('No valid image object received from external API.');
    }

    // Extract the base64 data, removing the data URI prefix if present
    let base64ImageData = imageObject.data || Object.entries(imageObject)[0][1];
    if (base64ImageData.includes(',')) {
        base64ImageData = base64ImageData.split(',')[1];
    }

    if (!base64ImageData || typeof base64ImageData !== 'string') {
        console.error('Invalid image data structure:', {
            type: typeof base64ImageData,
            preview: typeof base64ImageData === 'string' ? base64ImageData.substring(0, 100) + '...' : null
        });
        throw new Error('No valid image data received from external API.');
    }

    const imageData = Buffer.from(base64ImageData, 'base64');
    // Use the original filename if available, otherwise generate one
    const imageName = imageObject.name || `image_${timestamp}.png`;
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

        // Return the S3 URL
        const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
        return imageUrl;
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw error;
    }
}