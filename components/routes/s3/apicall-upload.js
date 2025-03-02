import { S3Client, PutObjectCommand, ListBucketsCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

async function testS3Connection() {
    try {
        const command = new ListBucketsCommand({});
        const response = await s3Client.send(command);
        console.log("S3 Connection successful. Buckets:", response.Buckets);
        return true;
    } catch (error) {
        console.error("S3 connection failed:", error);
        throw error;
    }
}

async function ApiCallUpload(file, userId) {
    try {
        console.log('=== S3 Upload Started ===');
        // Test connection first
        await testS3Connection();

        if (!file) {
            throw new Error('No file provided');
        }

        if (!userId) {
            throw new Error('No user ID provided');
        }

        // Log file details
        console.log('Processing file:', {
            originalName: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
            userId: userId
        });

        // Validate file type
        if (!file.mimetype.startsWith('image/')) {
            throw new Error('Only image files are allowed');
        }

        // Generate unique filename with user-specific path
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `users/${userId}/uploads/${uuidv4()}.${fileExtension}`;

        // Upload to S3 without ACL
        const uploadCommand = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype
        });

        await s3Client.send(uploadCommand);

        // Generate public URL
        const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
        
        console.log('Upload successful:', url);

        return {
            success: true,
            url,
            fileName,
            originalName: file.originalname
        };
    } catch (error) {
        console.error('Upload failed:', error);
        throw error;
    }
}

export default ApiCallUpload;
export { testS3Connection };
