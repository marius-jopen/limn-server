import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import generateRoutes from './routes/generateRoutes.js';

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the output directory under the '/output' path
app.use('/output', express.static(path.join(process.env.OUTPUT_DIR)));

// Use the generate routes under the '/api' path
app.use('/api', generateRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
