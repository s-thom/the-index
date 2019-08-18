import express, { Request, Response } from "express";
import compression from "compression";
import helmet from "helmet";
import versionRoute from "./endpoints/version";

const app = express();
app.use(helmet());
app.use(compression());
app.disable("x-powered-by");

app.get("/", (req: Request, res: Response) =>
  res.send("Hello World from app.ts!")
);

app.get("/version", versionRoute);

export default app;
