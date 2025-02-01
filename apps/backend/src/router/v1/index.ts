import { Router } from "express";
import projectRouter from "./project"

const router: Router = Router();

router.use("/project", projectRouter);

export default router;