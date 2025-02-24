import { Router } from "express";
import { date, z } from "zod"
import {prismaClient} from "../db/index"
import { indexGithubRepo } from "../utils/github/github-loader";
import { pollCommits } from "../utils/github/commit";
import { pollPullRequests } from "../utils/github/pull-req";
import { createMemory } from "../utils/langbase/memory";
import { callpipe, createPipe, streamLangbaseResponse } from "../utils/langbase/pipe";
import { streamText } from "ai"
import { createStreamableValue } from "ai/rsc"

const projectScema = z.object({
    name:z.string(),
    githubUrl: z.string(),
    githubToken: z.string().optional()
})

const questionScema = z.object({
    prompt:z.string()
})

const router = Router();

router.post("/create", async (req,res): Promise<any> => {
    const zreq = projectScema.safeParse(req.body)
    const email = req.headers.authorization

    const user = await prismaClient.user.findUnique({
        where:{
            emailAddress: email
        }
    })

    if (!user?.id) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const isproject = await prismaClient.project.findUnique({
        where:{
            name: zreq.data?.name
        }
    })

    if(isproject){
        return  res.status(401).json({ error: "Project already Exist" });
    }

    const project = await prismaClient.project.create({
        data:{
            name: zreq.data?.name || "",
            githubUrl: zreq.data?.githubUrl || "",
            userToProject: {
                create:{
                    userId: user?.id
                }
            }
        }
    })

    const memory = await createMemory(`${project.id}_${zreq.data?.name}` || "")
    const pipe = await createPipe(`${project.id}_${zreq.data?.name}` || "", memory.name || "")
    const questionagent = await prismaClient.questionAgent.create({
        data:{
            memoryName: memory.name,
            pipename: pipe.name,
            pipeDescription: pipe.description,
            projectId: project.id
        }
    })
    
    await indexGithubRepo(project.id,zreq.data?.githubUrl || '', questionagent.memoryName || "", zreq.data?.githubToken || '')
    await pollCommits(project.id)
    await pollPullRequests(project.id)

    res.json({message: 'Success',project})
})



router.get("/", async (req,res): Promise<any> => {
    const email = req.headers.authorization

    const user = await prismaClient.user.findUnique({
        where:{
            emailAddress: email
        }
    })

    if (!user?.id) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const projects = await prismaClient.project.findMany({
        where:{
            userToProject:{
                some:{
                    userId: user?.id
                }
            }
        }
    })

    res.json({message: 'Success',projects})
})

router.get("/:projectId", async (req,res): Promise<any> => {
    const email = req.headers.authorization
    const user = await prismaClient.user.findUnique({
        where:{
            emailAddress: email
        }
    })
    const projectId:string = req.params.projectId

    if (!user?.id) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const project = await prismaClient.project.findFirst({
        where:{
            id:projectId
        }
    })

    res.json({message: 'Success',project})
})

router.get("/:projectId/commits", async (req,res): Promise<any> => {
    const email = req.headers.authorization
    const user = await prismaClient.user.findUnique({
        where:{
            emailAddress: email
        }
    })
    const projectId = req.params.projectId

    if (!user?.id) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const commits = await prismaClient.commit.findMany({
        where:{
            projectId:projectId
        }
    })

    res.json({message: 'Success',commits})
})

router.get("/:projectId/prs", async (req,res): Promise<any> => {
    const email = req.headers.authorization
    const user = await prismaClient.user.findUnique({
        where:{
            emailAddress: email
        }
    })
    const projectId = req.params.projectId

    if (!user?.id) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const prs = await prismaClient.pr.findMany({
        where:{
            projectId:projectId
        }
    })

    res.json({message: 'Success',prs})
})


router.post("/:projectId/question", async (req,res):Promise<any> => {
    const zreq = questionScema.safeParse(req.body)
    const email = req.headers.authorization
    const projectId = req.params.projectId


    const user = await prismaClient.user.findUnique({
        where:{
            emailAddress: email
        }
    })

    if (!user?.id) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const questionAgent = await prismaClient.questionAgent.findFirst({
        where:{
            projectId: projectId
        }
    })

        // Set headers for streaming
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

    try {
        // const answer = await callpipe('ccb6b329-a7fd-45af-81f5-64f9bd80763a-genstack-final',zreq.data?.prompt || "")
        await streamLangbaseResponse(zreq.data?.prompt || "", res,{
            pipeName: questionAgent?.pipename || "",
            projectId,
            prompt: zreq.data?.prompt || "",
            userId: user.id
        });

        // Save the complete response
        // await prismaClient.question.create({
        //     data: {
        //         project: { connect: { id: projectId } },
        //         question: zreq.data?.prompt || "",
        //         answer: a.toString(),
        //         user: { connect: { id: user.id } }
        //     }
        // });
        res.end();

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }


})



export const projectRouter = router