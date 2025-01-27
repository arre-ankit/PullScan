import {GoogleGenerativeAI} from "@google/generative-ai"
import { Document } from "@langchain/core/documents"
import { code_review_prompt, commit_main_summary_prompt, main_summary_prompt, summary_prompt } from "./prompt";


export interface CodeChange {
    filename: string;
    patch: string;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash'
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
    
    const summary = await model.generateContent([
        summary_prompt({
            title:pullReqTitle, 
            description:pullReqMessage,
            file_diff: full_code
       })
    ])

    console.log(summary.response.text())
    


    const suggegested_pr_changes = await model.generateContent([
        code_review_prompt({
            file_diff: full_code,
            title: pullReqTitle, 
            description: pullReqMessage, 
            short_summary: summary.response.text()
        })
    ]);

    console.log(suggegested_pr_changes.response.text())    

    const main_summary = await model.generateContent([
        main_summary_prompt({
            title:pullReqTitle, 
            description:pullReqMessage,
            file_diff:full_code,
            suggegested_changes: suggegested_pr_changes.response.text()
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

