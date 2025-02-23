import { Router } from "express";
import { z } from "zod"
import {prismaClient} from "../db/index"
import { indexGithubRepo } from "../utils/github/github-loader";
import { pollCommits } from "../utils/github/commit";
import { pollPullRequests } from "../utils/github/pull-req";
import { createMemory } from "../utils/langbase/memory";

const projectScema = z.object({
    name:z.string(),
    githubUrl: z.string(),
    githubToken: z.string().optional()
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
    await indexGithubRepo(project.id,zreq.data?.githubUrl || '',memory.name || "", zreq.data?.githubToken || '')
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
    const projectId = req.params.projectId

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

export const projectRouter = router