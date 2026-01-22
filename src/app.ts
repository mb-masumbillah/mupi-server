import express, { Application } from "express";
import router from "./app/router";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";
import cookieParser from "cookie-parser";
import cors from "cors";

const app: Application = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://mupi-client.vercel.app"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello from local Prisma + Node + TS!");
});

app.use("/api", router);

app.use(globalErrorHandler);

app.use(notFound);

export default app;
