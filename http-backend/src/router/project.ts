import { Router } from "express";
import { z } from "zod"
import {prismaClient} from "../db/index"

const projectScema = z.object({
    name:z.string(),
    githubUrl: z.string(),
    githubToken: z.string().optional()
})

const router = Router();

router.post("/create", async (req,res): Promise<any> => {
    const zreq = projectScema.safeParse(req.body)
    const email = req.headers.authorization

    console.log(email)

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

    res.json({message: 'Success',project})
})

export const projectRouter = router