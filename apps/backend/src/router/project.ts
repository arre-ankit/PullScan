import { Router } from "express";
import {z} from "zod"
import { verifySession } from "../middleware";

const router = Router();

const projectScema = z.object({
    name:z.string(),
    githubUrl: z.string(),
    githubToken: z.string().optional()
})

router.get("/create",async (req,res) => {
    res.send("Hi")
})

export const projectRouter:Router = router;
