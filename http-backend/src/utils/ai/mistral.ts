import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({apiKey: apiKey});

export const  summary_pr_mistral = async function(system_prompt:string,prompt:string) {
    const chatResponse:any = await client.chat.complete({
        model: 'mistral-small-latest',
        messages: [{role: 'user', content: `${prompt}`},{role:'system',content:`${system_prompt}`}],
    });

    //console.log('Chat:', chatResponse.choices[0].message.content);

    return  chatResponse?.choices[0]?.message?.content
}



