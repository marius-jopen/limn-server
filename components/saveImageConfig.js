import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

export async function saveImageConfig(parameters, subfolder, timestamp, userId) {
    // Transform the parameters structure
    let transformedParams;
    if (parameters.input) {
        // Case 1: If there's an 'input' object, rename it to 'parameters'
        transformedParams = {
            parameters: parameters.input
        };
    } else if (parameters.prompt) {
        // Case 2: If parameters are at root level, wrap them in a 'parameters' object
        transformedParams = {
            parameters: parameters
        };
    } else {
        // No transformation needed
        transformedParams = parameters;
    }

    const txtFileName = `image_${timestamp}.txt`;
    const s3Key = `${userId}/${subfolder}/${txtFileName}`;

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
                Body: JSON.stringify(transformedParams, null, 2),
                ContentType: 'application/json',
            },
        });

        await upload.done();
        // console.log(`Parameters uploaded to S3: ${s3Key}`);

        // Return the S3 URL
        const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
        return fileUrl;
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw error;
    }
}
