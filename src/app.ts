import express, { Application } from "express";
import router from "./app/router";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";
import cookieParser from "cookie-parser"
import cors from "cors"


const app: Application = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from local Prisma + Node + TS!");
});

app.use("/api", router);

app.use(globalErrorHandler)

app.use(notFound)

export default app;
