import express, { Request, Response } from "express";
import compression from "compression";
import helmet from "helmet";
import { version } from "../package.json";

const app = express();
app.use(helmet());
app.use(compression());
app.disable("x-powered-by");

app.get("/", (req: Request, res: Response) =>
  res.send("Hello World from app.ts!")
);

app.get("/version", (req: Request, res: Response) => res.send({ version }));

export default app;
