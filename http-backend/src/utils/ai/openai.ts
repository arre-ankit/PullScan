import { OpenAI } from 'openai'


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export const generateCompletion = async (
        prompt: string
    ) => {
        const res = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                  "role": "system",
                  "content": [
                    {
                      "type": "text",
                      "text": `  Your task is to provide a concise summary of the changes. This 
                                summary will be used as a prompt while reviewing each file and must be very clear for 
                                the AI bot to understand. 

                                Instructions:

                                - Focus on summarizing only the changes in the PR and stick to the facts.
                                - Add code blocks of the changes you find from file_diff and give explanation their
                                - The summary should not exceed 600 words.
                                - Your summary should include a note about alterations 
                                to the signatures of exported functions, global data structures and 
                                variables, and any changes that might affect the external interface or 
                                behavior of the code.
                            `
                    }
                  ]
                },
                {
                    role: "user",
                    "content": [
                        {
                            "text":  `${prompt}`,
                            "type": "text"
                        }
                    ]
                }
              ],
        });

        return res.choices[0].message.content;
    
    }
    