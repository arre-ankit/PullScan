import { Router } from "express";
import { z } from "zod"
import {prismaClient} from "../db/index"
import { indexGithubRepo } from "../utils/github/github-loader";
import { pollCommits } from "../utils/github/commit";
import { pollPullRequests } from "../utils/github/pull-req";

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


    // await indexGithubRepo(project.id,zreq.data?.githubUrl || '', zreq.data?.githubToken)
    // await pollCommits(project.id)
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


export const projectRouter = router