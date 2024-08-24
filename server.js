import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import generateImage1111Local from './components/generate-image-1111-local.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the base output directory to the desired location outside of the repo
const outputDir = path.join('C:\\Users\\mail\\Github\\limn-output');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use(express.static(outputDir));

app.post('/generate-image-1111-local', async (req, res) => {
  try {
    const { prompt, steps, width, height } = req.body;
    const { imageUrl, info } = await generateImage1111Local(outputDir, { prompt, steps, width, height });

    res.json({ imageUrl, info });
  } catch (error) {
    console.error('Error in generate-image route:', error);
    res.status(500).json({ message: 'Error generating or saving the image.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
