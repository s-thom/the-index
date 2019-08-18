import { Request, Response } from "express";
import { version } from "../../package.json";

interface VersionResponse {
  version: string;
}

export default function versionRoute(req: Request, res: Response) {
  const response: VersionResponse = {
    version
  };
  res.json(response);
}
