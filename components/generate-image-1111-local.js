import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import config from '../config.js';

async function generateImage1111Local(imageRequest) {
    let subfolder = '/image-1111-local'
    
    const { prompt, steps, width, height } = imageRequest;

    const parameters = {
        prompt: prompt,
        steps: steps,
        width: width,
        height: height
    };

    try {
        const response = await fetch(config.generateImage1111LocalApi + "/sdapi/v1/txt2img", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parameters),
        });

        if (!response.ok) {
            throw new Error(`External API error: ${response.statusText}`);
        }

        const jsonResponse = await response.json();

        if (!jsonResponse.images || !jsonResponse.images[0]) {
            throw new Error('No image data received from external API.');
        }

        const base64ImageData = jsonResponse.output.images[0];
        const imageData = Buffer.from(base64ImageData, 'base64');
        const timestamp = Date.now();
        const imageName = `image_${timestamp}.png`;

        const specificOutputDir = path.join(process.env.OUTPUT_DIR, subfolder);
        const outputPath = path.join(specificOutputDir, imageName);

        await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.promises.writeFile(outputPath, imageData);

        console.log(`Image saved at: ${outputPath}`);

        // Ensure the returned URL is correctly mapped to your web server's static file handling
        const relativeImagePath = path.relative(config.outputDir, outputPath);
        const imageUrl = `/output/${relativeImagePath.replace(/\\/g, '/')}`; // Normalize path separators for URL

        return { imageUrl, info: "Image generated and saved successfully!" };
    } catch (error) {
        console.error('Error in generateImage1111Local:', error);
        throw error;
    }
}

export default generateImage1111Local;
