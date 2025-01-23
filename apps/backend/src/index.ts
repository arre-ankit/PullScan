import express from "express"
import cors from "cors"
import { projectRouter } from "./router/project";

const app = express();
app.use(express.json())
app.use(cors());

app.use("/api/v1/project",projectRouter);

