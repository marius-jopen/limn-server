// components/imageHelper.js
import fs from 'fs';
import path from 'path';

export async function saveImageData(jsonResponse, subfolder) {
    const base64ImageData = jsonResponse.images ? jsonResponse.images[0] : jsonResponse.output.images[0];
    
    if (!base64ImageData) {
        throw new Error('No image data received from external API.');
    }

    const imageData = Buffer.from(base64ImageData, 'base64');
    const timestamp = Date.now();
    const imageName = `image_${timestamp}.png`;

    const specificOutputDir = path.join(process.env.OUTPUT_DIR, subfolder);
    const outputPath = path.join(specificOutputDir, imageName);

    await fs.promises.mkdir(specificOutputDir, { recursive: true });
    await fs.promises.writeFile(outputPath, imageData);

    console.log(`Image saved at: ${outputPath}`);

    const relativeImagePath = path.relative(process.env.OUTPUT_DIR, outputPath);
    const imageUrl = `/output/${relativeImagePath.replace(/\\/g, '/')}`;

    return imageUrl;
}
