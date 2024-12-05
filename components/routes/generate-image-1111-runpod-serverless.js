// import fetch from 'node-fetch';
// import config from '../../config.js';

async function GenerateImage1111RunpodServerless(req) {

    console.log('Function: GenerateImage1111RunpodServerless');
    console.log(req);

    // const parameters = {
    //     input: {
    //         ...request
    //     }
    // };

    // try {
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
    // } catch (error) {
        // console.error('Error in generateImage1111RunPod:', error);
        // throw error;
    // }
}

export default GenerateImage1111RunpodServerless;

// const runpod_runsync = process.env.RUNPOD_DEFORUM_SERVERLESS + '/runsync';
// const runpod_run = process.env.RUNPOD_DEFORUM_SERVERLESS + '/run';
// const runpod_status = process.env.RUNPOD_DEFORUM_SERVERLESS + '/status';
// const runpod_cancel = process.env.RUNPOD_DEFORUM_SERVERLESS + '/cancel';
// const runpod_health = process.env.RUNPOD_DEFORUM_SERVERLESS + '/health';