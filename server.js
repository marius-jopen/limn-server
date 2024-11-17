import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import generateRoutes from './routes/generateRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Mount all routes under /api
app.use('/api', generateRoutes);
app.use('/api/output', express.static(path.join(process.env.OUTPUT_DIR)));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
