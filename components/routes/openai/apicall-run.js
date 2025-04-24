import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function ApiCallRun(request) {
    try {
        const { prompt, model = "gpt-3.5-turbo" } = request.input;
        
        if (!prompt) {
            throw new Error('Prompt is required');
        }

        const completion = await openai.chat.completions.create({
            model: model,
            messages: [
                { role: 'user', content: prompt }
            ],
        });

        return {
            info: "OpenAI request completed successfully",
            request: request,
            data: completion
        };

    } catch (error) {
        console.error('Error in ApiCallRun:', error);
        throw error;
    }
}

/**
 * Makes a request to the OpenAI API
 * @param {Array} messages - Array of message objects with role and content
 * @param {string} model - OpenAI model to use (default: gpt-3.5-turbo)
 * @returns {Promise<Object>} OpenAI API response
 */
async function OpenAIRequest(messages, model = "gpt-3.5-turbo") {
    try {
        const completion = await openai.chat.completions.create({
            model: model,
            messages: messages,
        });
        return completion;
    } catch (error) {
        console.error('OpenAI API error:', error);
        throw error;
    }
}

export { ApiCallRun, OpenAIRequest };