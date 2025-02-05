import express from "express"
import cors from "cors"
import {z} from "zod"
import { projectRouter } from "./router/project";

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true 
}));

app.use(express.json());

app.use("/v1/api/project", projectRouter)

app.listen(process.env.PORT || 8080)