import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import generateImage from './components/1111-image.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 4000;
const outputDir = path.join(__dirname, 'images');

app.use(cors());
app.use(express.json());
app.use(express.static(outputDir));

app.post('/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    const { imageUrl, info } = await generateImage(outputDir, { prompt });

    res.json({ imageUrl, info });
  } catch (error) {
    console.error('Error in generate-image route:', error);
    res.status(500).json({ message: 'Error generating or saving the image.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
