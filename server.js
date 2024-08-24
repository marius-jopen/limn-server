import express from 'express';
import cors from 'cors';
import path from 'path';
import generateRoutes from './routes/generateRoutes.js';

const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the output directory under the '/output' path
const outputDir = path.join('C:\\Users\\mail\\Github\\limn-output');
app.use('/output', express.static(outputDir));

// Use the generate routes under the '/api' path
app.use('/api', generateRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
