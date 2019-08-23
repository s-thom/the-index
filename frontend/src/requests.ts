import axios from "axios";
import { LinkDetail } from "./types";

const SERVER_HOST = process.env.REACT_APP_SERVER_PATH;

export default class Requester {
  private token: string | null = null;
  private setTokenFn: (newToken: string | null) => void = (
    newToken: string | null
  ) => console.warn("Tried to set token in requester before hooks were run");

  setToken(token: string | null, setToken: (newToken: string | null) => void) {
    this.token = token;
    this.setTokenFn = setToken;
  }

  async getLinkById(id: string): Promise<LinkDetail> {
    const response = await axios.get(`${SERVER_HOST}/links/${id}`);

    return response.data.link;
  }

  async searchByTag(tags: string[]): Promise<LinkDetail[]> {
    const response = await axios.post(`${SERVER_HOST}/search`, {
      tags
    });

    return response.data.links;
  }

  async addNewLink(url: string, tags: string[]): Promise<string> {
    const response = await axios.post(`${SERVER_HOST}/links`, {
      url,
      tags
    });

    return response.data.id;
  }
}
