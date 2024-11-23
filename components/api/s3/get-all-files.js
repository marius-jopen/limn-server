/**
 * This module provides functionality to retrieve all image files from an AWS S3 bucket for a specific user.
 * 
 * Features:
 * - Recursively fetches all files from a user's directory in S3
 * - Handles pagination of S3 results automatically
 * - Filters for image files only (jpg, jpeg, png, gif)
 * - Uses the user's ID as a prefix to scope the search to their directory
 * 
 * @param {string} userId - The ID of the user whose files should be retrieved
 * @returns {Promise<string[]>} - Array of S3 key paths for the user's image files
 */

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