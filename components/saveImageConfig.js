import fs from 'fs';
import path from 'path';

export async function saveImageConfig(parameters, subfolder, timestamp) {
    // Transform the parameters structure
    let transformedParams;
    if (parameters.input) {
        // Case 1: If there's an 'input' object, rename it to 'parameters'
        transformedParams = {
            parameters: parameters.input
        };
    } else if (parameters.prompt) {
        // Case 2: If parameters are at root level, wrap them in a 'parameters' object
        transformedParams = {
            parameters: parameters
        };
    } else {
        // No transformation needed
        transformedParams = parameters;
    }

    // const timestamp = Date.now();
    const txtFileName = `image_${timestamp}.txt`;
    const specificOutputDir = path.join(process.env.OUTPUT_DIR, subfolder);
    const outputPath = path.join(specificOutputDir, txtFileName);

    await fs.promises.mkdir(specificOutputDir, { recursive: true });
    await fs.promises.writeFile(outputPath, JSON.stringify(transformedParams, null, 2));

    console.log(`Parameters saved at: ${outputPath}`);

    const relativeFilePath = path.relative(process.env.OUTPUT_DIR, outputPath);
    const fileUrl = `/output/${relativeFilePath.replace(/\\/g, '/')}`;

    return fileUrl;
}
