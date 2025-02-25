import { Router } from "express";
import { indexGithubRepo } from "../utils/github/github-loader";

const router = Router();

router.post("/index-github", async (req, res):Promise<any> => {
    try {
      const { projectId, githubUrl, memoryName, githubToken } = req.body;
  
      await indexGithubRepo(projectId, githubUrl, memoryName, githubToken);
      res.status(200).send('Indexing completed');
    } catch (error) {
      console.error('Background task failed:', error);
      res.status(500).send('Indexing failed');
    }
  });

  export const backgroundRouter = router