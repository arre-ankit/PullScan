import { client } from "@repo/db/client"; 
import axios  from "axios"
import { aisummariseCommit } from "../gemni.js"
import {octokit} from "./octakit.js"

export const pollCommits = async (projectId: string) =>{
    const {project,githubUrl} = await fetchProjectGithubUrl(projectId);
    const commitHashes = await getCommitHashes(githubUrl)
    const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes)
    const summaryResponses = await Promise.allSettled(unprocessedCommits.map((commit:any) => {
        return summarizeCommit(githubUrl,commit.commitHash,commit.commitMessage)
    }))
    const summaries = summaryResponses.map((response) =>{
        if(response.status === 'fulfilled'){
            return response.value as string
        }
        return ""
    })

    const commits = await client.commit.createMany({
        data: summaries.map((summary,index) => {
                console.log(`processing commit ${index}`)
                return {
                    projectId: projectId,
                    commitHash: unprocessedCommits[index].commitHash,
                    commitMessage: unprocessedCommits[index]!.commitMessage,
                    commitAuthorName: unprocessedCommits[index].commitAuthorName,
                    commitAuthorAvtar: unprocessedCommits[index].commitAuthorAvatar,
                    commitDate: unprocessedCommits[index].commitDate,
                    summary
                }
        })
        
    })
    return commits
}

export const getCommitHashes = async (githubUrl: string): Promise<any> => {
    const [owner, repo] = githubUrl.split("/").slice(-2);

    // Validate the GitHub URL
    if (!owner || !repo) {
    throw new Error("Invalid GitHub URL. Provide a valid URL in the format 'https://github.com/owner/repo'.");
    }

    try {
    // Fetch the list of commits
    const { data } = await octokit.rest.repos.listCommits({
        owner,
        repo
    })

    // Sort and process the commits
    const sortedCommits = data.sort(
        (a: any, b: any) =>
        new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()
    ) as any[];

    // Return the latest 15 commits with relevant details
    return sortedCommits.slice(0, 15).map((commit: any) => ({
        commitHash: commit.sha as string,
        commitMessage: commit.commit.message ?? "",
        commitAuthorName: commit.commit.author?.name ?? "",
        commitAuthorAvatar: commit.author?.avatar_url ?? "",
        commitDate: commit.commit.author?.date ?? "",
    }));
    } catch (error: any) {
    console.error("Error fetching commit hashes:", error.message);
    throw new Error(`Failed to fetch commits from ${githubUrl}. Please check the repository URL or token.`);
    }
};

async function filterUnprocessedCommits(projectId:string, commitHashes:any){

    const processedCommit = await client.commit.findMany({
        where:{projectId}
    })

    const unprocessedCommits = commitHashes.filter((commit:any)=> !processedCommit.some((processedCommit:any) => processedCommit.commitHash === commit.commitHash))
    return unprocessedCommits
}


async function summarizeCommit(githubUrl: string, commitHash: string, commitMessage:string) {
    // get the diff pass the diff in AI
    const {data} = await axios.get(`${githubUrl}/commit/${commitHash}.diff`,{
        headers: {
            Accept: 'application/vnd.github.v3.diff'
        }
    })
    return await aisummariseCommit(data,commitMessage) || ""
}

// await summarizeCommit("https://github.com/n8n-io/n8n","d48cc36061e1069dd92edc65c0c1fbc32cf89489","feat(editor): Remove bug reporting button from new canvas (no-changelog) (#12831)").then((summary)=> {console.log(summary)})

export async function fetchProjectGithubUrl(projectId:string){
    const project = await client.project.findUnique({
        where:{
            id: projectId
        },
        select:{
            githubUrl: true
        }
    })
    

    if(!project?.githubUrl){
        throw new Error("Project has no github url")
    }

    return {project,githubUrl: project.githubUrl}
}