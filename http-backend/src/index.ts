import express from 'express'
import cors from 'cors'
import { projectRouter } from './router/project';
import { prismaClient } from './db';

const app = express();
app.use(express.json())
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
  }));

app.get('/', (req, res) => {
    res.send('Hello from express');
});

app.use('/v1/api/projects',projectRouter)

app.get('/v1/api/commit/:commitId', async (req,res):Promise<any> => {
    const email = req.headers.authorization
    const user = await prismaClient.user.findUnique({
        where:{
            emailAddress: email
        }
    })
    const commitId = req.params.commitId

    if (!user?.id) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const commit = await prismaClient.commit.findFirst({
        where:{
            id:commitId
        }
    })

    res.json({message: 'Success',commit})

})

app.listen(4000);

export default app