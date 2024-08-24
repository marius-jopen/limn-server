import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const { RUNPOD_API_KEY } = process.env;

async function generateImage1111RunPodServerless(baseOutputDir, imageRequest) {
    const { prompt, steps, width, height } = imageRequest;

    const parameters = {
        input: {
            prompt: prompt,
            num_inference_steps: steps,
            width: width,
            height: height,
            num_outputs: 1,
            guidance_scale: 7.5,
            scheduler: "KLMS"
        }
    };

    try {
        const runPodUrl = "https://api.runpod.ai/v2/ae5bt5c1o8e58f/runsync";

        const response = await fetch(runPodUrl, {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.RUNPOD_API_KEY}`
            },
            body: JSON.stringify(parameters),
        });

        // Ensure we handle the decompression and parsing properly
        const jsonResponse = await response.json();
        console.log("Received image data:", jsonResponse.output.images[0]);

        if (!jsonResponse.output || !jsonResponse.output.images || !jsonResponse.output.images[0]) {
            throw new Error('No image data received from RunPod API.');
        }

        // Access the base64-encoded image data
        const base64ImageData = jsonResponse.output.images[0];
        const imageData = Buffer.from(base64ImageData, 'base64');
        const timestamp = Date.now();
        const imageName = `image_${timestamp}.png`;

        const specificOutputDir = path.join(baseOutputDir, 'image-1111-runpod');
        const outputPath = path.join(specificOutputDir, imageName);

        await fs.promises.mkdir(specificOutputDir, { recursive: true });
        await fs.promises.writeFile(outputPath, imageData);

        console.log(`Image saved at: ${outputPath}`);

        const imageUrl = `/output/image-1111-runpod/${imageName}`;

        return { imageUrl, info: "Image generated and saved successfully!" };
    } catch (error) {
        console.error('Error in generateImage1111RunPod:', error);
        throw error;
    }
}

export default generateImage1111RunPodServerless;
