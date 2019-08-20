import axios from "axios";
import { LinkDetail } from "./types";

const SERVER_HOST = process.env.REACT_APP_SERVER_PATH;

interface SearchByTagResponse {
  links: LinkDetail[];
}

export async function searchByTag(tags: string[]): Promise<LinkDetail[]> {
  const response = await axios.post(`${SERVER_HOST}/search`, {
    tags
  });

  return response.data.links;
}

export async function addNewLink(url: string, tags: string[]): Promise<string> {
  const response = await axios.post(`${SERVER_HOST}/links`, {
    url,
    tags
  });

  return response.data.id;
}
