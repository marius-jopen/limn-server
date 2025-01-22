import express from 'express';

import testEndpoint from './tests/test-endpoint.js';
import A1111RunpodServerlessEndpoints from './a1111-runpod-serverless/endpoints.js';
import ComfyuiRunPodServerlessEndpoints from './comfyui-runpod-serverless/endpoints.js';
import DeforumRunpodServerlessEndpoints from './deforum-runpod-serverless/endpoints.js';

const router = express.Router();

router.use(testEndpoint);
router.use(A1111RunpodServerlessEndpoints);
router.use(ComfyuiRunPodServerlessEndpoints);
router.use(DeforumRunpodServerlessEndpoints);

export default router;