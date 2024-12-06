import express from 'express';

import testEndpoint from './tests/test-endpoint.js';
import generateImage1111RunpodServerlessEndpoints from './generate-image-1111-runpod-serverless/endpoints.js';
import generateImageComfyRunPodServerlessEndpoints from './generate-image-comfy-runpod-serverless/endpoints.js';
import generateVideo1111RunpodServerlessEndpoints from './generate-video-1111-runpod-serverless/endpoints.js';

const router = express.Router();

router.use(testEndpoint);
router.use(generateImage1111RunpodServerlessEndpoints);
router.use(generateImageComfyRunPodServerlessEndpoints);
router.use(generateVideo1111RunpodServerlessEndpoints);

export default router;