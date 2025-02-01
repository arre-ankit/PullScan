import express from "express";
import cookieParser from "cookie-parser";
import v1Router from "./router/v1";
import cors from "cors";


const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));
app.use(express.json());


app.use("/api/v1", v1Router);

app.listen(8080, () => {
    console.log(`Running on port ${process.env.PORT || 8080}`)
});