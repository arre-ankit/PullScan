import { Anthropic } from '@anthropic-ai/sdk';
import { MessageParam } from '@anthropic-ai/sdk/resources';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

export const generateCompletionClaude = async (
    prompt:  MessageParam[],
) => {
    try {
        // Input validation
        if (!prompt || !Array.isArray(prompt) || prompt.length === 0) {
            throw new Error(
                'Invalid prompt: Must be non-empty array of messages'
            );
        }

        // Retry mechanism
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
            try {
                const res = await anthropic.messages.create({
                    model: 'claude-3-5-haiku-20241022',
                    max_tokens: 3000,
                    temperature: 0.4,
                    system: ` Your task is to provide a concise summary of the changes. This 
                                summary will be used as a prompt while reviewing each file and must be very clear for 
                                the AI bot to understand. 

                                Instructions:

                                - Focus on summarizing only the changes in the PR and stick to the facts.
                                - Add code blocks of the changes you find from file_diff and give explanation their
                                - The summary should not exceed 600 words.
                                - Your summary should include a note about alterations 
                                to the signatures of exported functions, global data structures and 
                                variables, and any changes that might affect the external interface or 
                                behavior of the code.`,
                    messages: prompt
                });

                if (!(res.content?.[0] as Anthropic.Messages.TextBlock)?.text) {
                    throw new Error('Invalid API response structure');
                }

                return (res.content[0] as Anthropic.Messages.TextBlock).text;
            } catch (error) {
                attempts++;
                if (attempts === maxAttempts) {
                    throw error;
                }
                await new Promise((resolve) =>
                    setTimeout(resolve, 1000 * attempts)
                );
            }
        }

        throw new Error('Max retry attempts reached');
    } catch (error) {
        console.log(error)
        return ''
    }
};