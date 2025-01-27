import db from "@repo/db/client";
import axios  from "axios"
import { aisummarisePR } from "./gemni"
import { octokit } from "./octakit";
import { fetchProjectGithubUrl } from "./commit";
import { CodeChange } from "./gemni";


export const pollPullRequests = async (projectId: string) =>{
    const {project,githubUrl} = await fetchProjectGithubUrl(projectId);
    const pullReqHashes = await getPullRequest(githubUrl)
    const unprocessedPRs = await filterUnprocessedPRs(projectId, pullReqHashes)
    const summaryResponses = await Promise.allSettled(unprocessedPRs.map((pr:any) => {
        return summarizePR(githubUrl,pr.pullReqHashes,pr.number,pr.pullReqTitle, pr.pullReqMessage)
    }))
    // const summaries = summaryResponses.map((response) =>{
    //     if(response.status === 'fulfilled'){
    //         return response.value as string
    //     }
    //     return ""
    // })

    // const commits = await db.commit.createMany({
    //     data: summaries.map((summary,index) => {
    //             console.log(`processing commit ${index}`)
    //             return {
    //                 projectId: projectId,
    //                 commitHash: unprocessedCommits[index].commitHash,
    //                 commitMessage: unprocessedCommits[index]!.commitMessage,
    //                 commitAuthorName: unprocessedCommits[index].commitAuthorName,
    //                 commitAuthorAvtar: unprocessedCommits[index].commitAuthorAvatar,
    //                 commitDate: unprocessedCommits[index].commitDate,
    //                 summary
    //             }
    //     })
        
    // })
    // return commits
}


export const getPullRequest = async (githubUrl: string) => {
    const [owner, repo] = githubUrl.split('/').slice(-2);

    if (!owner || !repo) {
        throw new Error("Invalid GitHub URL");
    }

    try {
        const response = await octokit.rest.pulls.list({
            owner,
            repo
        })

        const sortedPulls = response.data.sort((a:any, b:any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) as any[];

        return sortedPulls.slice(0, 15).map((pr: any) => ({
            number: pr.number,
            pullReqHash: pr.merge_commit_sha as string,
            pullReqTitle: pr.title,
            pullReqMessage: pr.body ?? "",
            pullReqAuthorName: pr.user.login ?? "",
            pullReqAuthorAvatar: pr.user.avatar_url ?? "",
            pullReqDate: pr.created_at ?? "",
        }));
        } catch (error: any) {
        console.error("Error fetching pr hashes:", error.message);
        throw new Error(`Failed to fetch prs from ${githubUrl}. Please check the repository URL or token.`);
        }
    } 


// getPullRequest("https://github.com/n8n-io/n8n")
//     .then((pr) => console.log(pr)) // Should log the list of pull requests
//     .catch(err => console.error(err));


async function filterUnprocessedPRs(projectId:string, pullReqHashes:any){
        const processedPr = await db.pr.findMany({
            where:{projectId}
        })
    
        const unprocessedPRs = pullReqHashes.filter((pr:any)=> !processedPr.some((processedPr) => processedPr.pullReqHash === pr.pullReqHash))
        return unprocessedPRs
}

const codes: CodeChange[] = []; // Initialize the codes array with the correct type

async function summarizePR(githubUrl: string, pullReqHashes: string, pr_number:number,pullReqTitle: string, pullReqMessage:string) {
    const [owner, repo] = githubUrl.split('/').slice(-2);

    if (!owner || !repo) {
        throw new Error("Invalid GitHub URL");
    }
    // get the code diff and summaise it in AI
    const { data: files } = await octokit.rest.pulls.listFiles({
            owner,
            repo,
            pull_number:pr_number
        });

    // Populate the codes array with the filename and patch
    for (const file of files) {
        codes.push({
            filename: file.filename,
            patch: file.patch || ""
        });
    }

    console.log(codes)
    return await aisummarisePR(codes,pullReqMessage,pullReqTitle) || ""
    
}

await summarizePR("https://github.com/n8n-io/n8n","26e245a546d1b0dd386a95047eeb736572f85def",12816,"refactor(core): Move all execution lifecycle telemetry events to lifecycle hooks (no-changelog)","## Summary\r\n\r\nThis PR moves telemetry events out of workflow-execute-additional-data and WorkflowRunner, and into execution lifecycle hooks, to make these temetry hooks consistent across various modes.\r\n\r\n## Review / Merge checklist\r\n\r\n- [x] PR title and summary are descriptive. ([conventions](../blob/master/.github/pull_request_title_conventions.md)) <!--\r\n   **Remember, the title automatically goes into the changelog.\r\n   Use `(no-changelog)` otherwise.**\r\n-->\r\n- [ ] [Docs updated](https://github.com/n8n-io/n8n-docs) or follow-up ticket created.\r\n- [x] Tests included. <!--\r\n   A bug is not considered fixed, unless a test is added to prevent it from happening again.\r\n   A feature is not complete without tests.\r\n-->\r\n- [ ] PR Labeled with `release/backport` (if the PR is an urgent fix that needs to be backported)\r\n").then((summary)=> {console.log(summary)})
