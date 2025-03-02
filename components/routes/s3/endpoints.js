import express from 'express';
import multer from 'multer';
import ApiCallUpload, { testS3Connection } from './apicall-upload.js';
import { saveToResource } from '../../supabase/save-uploaded.js';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Test connection endpoint
router.get('/s3-test-connection', async (req, res) => {
    try {
        await testS3Connection();
        res.json({ status: 'S3 connection successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload endpoint
router.post('/s3-upload', upload.single('image'), async (req, res) => {
    try {
        const userId = req.body.userId;
        
        if (!userId) {
            throw new Error('User ID is required');
        }

        // Upload to S3
        const result = await ApiCallUpload(req.file, userId);

        // Save to Supabase
        try {
            await saveToResource(
                userId,
                result.url,
                result.originalName
            );
            
            console.log('Image saved to Supabase:', result.url);
        } catch (dbError) {
            console.error('Failed to save to database:', dbError);
            // Still return success if S3 upload worked but DB save failed
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Test endpoint
router.get('/s3-upload/test', (req, res) => {
    res.json({ status: 'S3 upload endpoint is working' });
});

export default router;