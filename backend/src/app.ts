import express, { Request, Response } from "express";
import compression from "compression";
import helmet from "helmet";
import cors, { CorsOptions } from "cors";
import { getLinkByIdRoute, addNewLinkRoute } from "./routes/links";
import { searchLinksByTags } from "./routes/search";
import { loginRoute } from "./routes/auth";
import { checkTokenMiddleware } from "./util/auth";

const CORS_ALLOWED = process.env.CORS_ALLOWED;
const corsConfig: CorsOptions = {
  origin: CORS_ALLOWED,
  credentials: true,
  allowedHeaders: ["content-type", "authorization"]
};

const app = express();
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cors(corsConfig));
app.use(checkTokenMiddleware);
app.disable("x-powered-by");

app.options("*", cors());

app.get("/", (req: Request, res: Response) =>
  res.send("Hello World from app.ts!")
);

app.get("/links/:id", getLinkByIdRoute);
app.post("/links", addNewLinkRoute);

app.post("/search", searchLinksByTags);

app.post("/login", loginRoute);

export default app;
