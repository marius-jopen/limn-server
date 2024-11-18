import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

export async function getAllFiles(userId) {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  async function listAllObjects(continuationToken = null) {
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_S3_BUCKET,
      Prefix: `${userId}/`,
      ContinuationToken: continuationToken,
    });

    try {
      const response = await s3Client.send(command);
      const files = response.Contents
        ?.filter(item => item.Key.match(/\.(jpg|jpeg|png|gif)$/i))
        ?.map(item => `${item.Key}`) || [];

      if (response.IsTruncated) {
        const moreFiles = await listAllObjects(response.NextContinuationToken);
        return [...files, ...moreFiles];
      }

      return files;
    } catch (error) {
      console.error('Error listing S3 objects:', error);
      throw error;
    }
  }

  return listAllObjects();
}