import express, { Request, Response } from "express";
import compression from "compression";
import helmet from "helmet";
import versionRoute from "./endpoints/version";
import { getLinkByIdRoute, addNewLinkRoute } from "./endpoints/links";

const app = express();
app.use(helmet());
app.use(compression());
app.use(express.json());
app.disable("x-powered-by");

app.get("/", (req: Request, res: Response) =>
  res.send("Hello World from app.ts!")
);

app.get("/version", versionRoute);

app.get("/links/:id", getLinkByIdRoute);
app.post("/links", addNewLinkRoute);

export default app;
