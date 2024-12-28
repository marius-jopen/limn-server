# install
npm install

# run server
node server.js

OR

npm run start



TODO:

I cleaned up the repository of the server.
We have three routes here:

1. /generate-image-comfy-runpod-serverless
2. /generate-image-1111-runpod-serverless
3. /generate-video-1111-runpod-serverless

For each route we have an own folder which includes all the functionalities, API calls and other things which are needed. Like this we can keep the code clean and every route can work isolated from the other routes.

I tried to keep the code as clean as possible.

I am using Postman to make the API calls. I included an export of my Postman project into this repository. So you can import it and run the requests directly.


I will set up the frontend later - once we have the API calls working.


# COMFYUI SERVERLESS

Everything is working pretty well. 
The only thing that is missing is the ability to poll the status of the job automatically.

But I can do that myself.

But lets fix the run endpoint.



# 1111 IMAGE SERVERLESS

At the moment we only have 1 serverless endpoint for 1111.
But this endpoint only works for Deforum. I cannot create normal images with it.

1. We need to create a new serverless GPU. It should use the same 1111 model as the Deforum serverless GPU. But can create images.

2. It should send us the image as a base64 string.

3. It is enough if we use the runsync functionality. Because I understood of how to set up the run functionality myself.

4. It should not save any images or videos on the RunPod server.


# 1111 DEFORUM SERVERLESS

The endpoint works and generates videos.

But there are some issues where I need some help to fix:

1. The endpoint is not working very stable. Many times the generation of the video and image sequence fails.

2. I want to add the ability to send the generated image as a base64 string. 

3. At the moment it sends all the images and the video AFTER EVERYTHING was created. But it should send each image right after it was created.

4. We don't need the video at all. Because we can get the images as a base64 string.

5. It should not save any images or videos on the RunPod server.