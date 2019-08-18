import express, { Request, Response } from "express";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import versionRoute from "./endpoints/version";
import { getLinkByIdRoute, addNewLinkRoute } from "./endpoints/links";
import { searchLinksByTags } from "./endpoints/search";

const CORS_ALLOWED = process.env.CORS_ALLOWED;
const corsConfig = {
  origin: CORS_ALLOWED,
  credentials: true
};

const app = express();
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cors(corsConfig));
app.disable("x-powered-by");

app.get("/", (req: Request, res: Response) =>
  res.send("Hello World from app.ts!")
);

app.get("/version", versionRoute);

app.get("/links/:id", getLinkByIdRoute);
app.post("/links", addNewLinkRoute);

app.post("/search", searchLinksByTags);

export default app;
