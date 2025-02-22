import {GoogleGenerativeAI} from "@google/generative-ai"
import { Document } from "@langchain/core/documents"
import { commit_main_summary_prompt, pr_summary_prompt } from "../prompt"


export interface CodeChange {
    filename: string;
    patch: string;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash-8b'
})

// This summarize code generate summary for commits
export const aisummariseCommit = async (diff: string,commitMessage:string) => {
    const response = await model.generateContent([
        commit_main_summary_prompt({
            title:commitMessage, 
            file_diff:diff,
       })
    ])

    return response.response.text()
    
}

export const aisummarisePR = async (codes:CodeChange[],pullReqTitle: string, pullReqMessage:string) => {
    const full_code:string = codes.map((code) => code.patch + code.filename).join('\n');

    // const pr_prompt = pr_summary_prompt({
    //         title:pullReqTitle, 
    //         description:pullReqMessage,
    //         file_diff:full_code
    //    })

    // const prompt: MessageParam[] = [{
    //     role: 'user',
    //     content: `${pr_prompt}`
    // }]

    // const main_summary = await generateCompletionClaude(prompt)

    const main_summary = await  await model.generateContent([
        pr_summary_prompt({
                    title:pullReqTitle, 
                    description:pullReqMessage,
                    file_diff:full_code
               })
        ])


    return main_summary.response.text()
}



// This summarize code generate summary for the RAG 
export const summarizecode = async (doc:Document) => {
    console.log("getting summary for",doc.metadata.source);
    try{
        const code = doc.pageContent.slice(0,10000);
        const response = await model.generateContent([
            `You are an inteligen software engineer who specialize in onboarding junior software engineers on the project
            You are onboaring juniors software engineer and explaing to them the purpose of the ${doc.metadata.source} file

            Here is the code:
            --------
            ${code}
            --------
            Give a summary no more than 100 words of the code above`

        ])

        return response.response.text()

    }catch(error){
        return ''
    }

}

export async function aigenerateEmbedding(summary:string) {
    const model = genAI.getGenerativeModel({
        model: "text-embedding-004"
    })

    const result = await model.embedContent(summary)
    const embedding = result.embedding
    return embedding.values
}

