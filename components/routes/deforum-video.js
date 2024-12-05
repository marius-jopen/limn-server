import fetch from 'node-fetch';
import config from '../../config.js';

async function DeforumVideo(request) {

    // const parameters = {
    //     input: {
    //         ...request
    //     }
    // };

    try {
        // const response = await fetch(config.generateImage1111RunpodServerlessApi, {
        //     method: "POST",
        //     headers: { 
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${process.env.RUNPOD_API_KEY}`
        //     },
        //     body: JSON.stringify(parameters),
        // });

        // if (!response.ok) {
        //     throw new Error(`External API error: ${response.statusText}`);
        // }

        // return { imageUrl, info: "Image generated and saved successfully!" };
    } catch (error) {
        // console.error('Error in generateImage1111RunPod:', error);
        // throw error;
    }
}

export default DeforumVideo;