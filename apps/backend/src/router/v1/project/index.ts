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
    const email = req.headers.authorization
    console.log(email)

    const userId = await client.user.findFirst({
        where:{
            email:email
        }
    })

    console.log(userId)
    res.send('hi')
})

export default router;