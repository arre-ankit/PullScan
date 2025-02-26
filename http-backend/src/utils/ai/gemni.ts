import {GoogleGenerativeAI} from "@google/generative-ai"
import { commit_main_summary_prompt, pr_summary_prompt } from "../prompt"
import fs from 'fs'; // Add this import at the top
import {summary_pr_mistral} from "./mistral"

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
    const full_code:string = codes.map((code) => code.patch + code.filename).join('');

    const system_prompt =  pr_summary_prompt({
        title:pullReqTitle, 
        description:pullReqMessage,
        file_diff:full_code
   })
   const prompt = 'Summerise this PR'

    const main = await summary_pr_mistral(system_prompt,prompt)
    return main
    
    // fs.writeFileSync(`'full_code_${i}.txt'`, full_code, 'utf8'); // Add this line to save the code
    // i++;
    // console.log("Title:", pullReqTitle)
    // fs.writeFileSync(`'title_${i}.txt'`, pullReqTitle, 'utf8'); // Add this line to save the code
    
    // console.log("Description:",pullReqMessage)
    // fs.writeFileSync(`'description_${i}.txt'`, pullReqMessage, 'utf8'); // Add this line to save the code
    // console.log('code',full_code)

    // const main_summary = await model.generateContent([
    //     pr_summary_prompt({
    //                 title:pullReqTitle, 
    //                 description:pullReqMessage,
    //                 file_diff:full_code
    //            })
    //     ])


    //return main_summary.response.text()
}