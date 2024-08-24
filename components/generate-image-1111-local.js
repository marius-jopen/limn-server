import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

async function generateImage1111Local(baseOutputDir, imageRequest) {
    const { prompt, steps, width, height } = imageRequest;

    const parameters = {
        prompt: prompt,
        steps: steps,
        width: width,
        height: height
    };

    try {
        // Define the specific output folder for this API
        const specificOutputDir = path.join(baseOutputDir, 'image-1111-local');
        
        // Make the request to the external API
        const response = await fetch("http://127.0.0.1:7860/sdapi/v1/txt2img", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parameters),
        });

        if (!response.ok) {
            throw new Error(`External API error: ${response.statusText}`);
        }

        const jsonResponse = await response.json();

        // Ensure the response contains image data
        if (!jsonResponse.images || !jsonResponse.images[0]) {
            throw new Error('No image data received from external API.');
        }

        const base64ImageData = jsonResponse.images[0];
        const imageData = Buffer.from(base64ImageData, 'base64');
        const timestamp = Date.now();
        const imageName = `image_${timestamp}.png`;

        const outputPath = path.join(specificOutputDir, imageName);

        // Ensure the directory exists and write the image file
        await fs.promises.mkdir(specificOutputDir, { recursive: true });
        await fs.promises.writeFile(outputPath, imageData);

        console.log(`Image saved at: ${outputPath}`);

        // Generate the URL to access the image
        const imageUrl = `/output/image-1111-local/${imageName}`;

        return { imageUrl, info: "Image generated and saved successfully!" };
    } catch (error) {
        console.error('Error in generateImage1111Local:', error);
        throw error;
    }
}

export default generateImage1111Local;
