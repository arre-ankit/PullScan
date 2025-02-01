import { Router } from "express";
import {z} from "zod"
import { client } from "@repo/db/client"; 


const router: Router = Router();


const projectScema = z.object({
    name:z.string(),
    githubUrl: z.string(),
    githubToken: z.string().optional()
})

router.post("/createProject", async (req,res) => {
    const zreq = projectScema.safeParse(req.body)
    const email = req.headers.authorization

    const user = await client.user.findFirst({
        where:{
            email:email
        }
    })

    const project = await client.project.create({
        data:{
            name: zreq.data?.name || '',
            githubUrl: zreq.data?.githubUrl || '',
            userToProject: {
                create:{
                    userId: user?.id || ''
                }
            }
        }   
    })

    res.send({
        project
    })
})

export default router;