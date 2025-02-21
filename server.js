import './components/utils/loadEnv.js';  // This must be the first import!
import express from 'express';
import cors from 'cors';
import Endpoints from './components/routes/all-routes.js';

const app = express();
const port = process.env.PORT || 4000;

// Update CORS configuration to handle credentials
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true
}));

app.use(express.json());

app.use('/api', Endpoints);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
