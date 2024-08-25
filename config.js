const config = {
    generateImage1111RunpodPod: 'https://3saeuqkzibgz0d-3001.proxy.runpod.net/sdapi/v1/txt2img',
    generateImage1111RunpodServerlessApi: 'https://api.runpod.ai/v2/ae5bt5c1o8e58f/runsync',
    generateImage1111LocalApi: 'http://127.0.0.1:7860/sdapi/v1/txt2img',
    outputDir: process.env.OUTPUT_DIR // This will take the value from the .env file
};

export default config;
