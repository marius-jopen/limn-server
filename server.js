import './components/utils/loadEnv.js';  // This must be the first import!
import express from 'express';
import cors from 'cors';
import Endpoints from './components/routes/all-routes.js';

const app = express();
const port = process.env.PORT || 4000;

// Get allowed origins from environment variable or use defaults
const allowedOrigins = process.env.FRONTEND_URL || process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:5173';
const originsArray = allowedOrigins.split(',');

// Update CORS configuration to handle credentials and multiple origins
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (originsArray.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS: Origin not allowed:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());

app.use('/api', Endpoints);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Allowed origins for CORS: ${originsArray.join(', ')}`);
});
