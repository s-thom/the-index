import axios, { AxiosRequestConfig } from "axios";
import { LinkDetail } from "./types";

const SERVER_HOST = process.env.REACT_APP_SERVER_PATH;

interface LinkDetailResponse {
  link: LinkDetail;
}

interface SearchResponse {
  links: LinkDetail[];
}

interface NewLinkResponse {
  id: string;
}

export default class Requester {
  private token: string | null = null;
  private setTokenFn: (newToken: string | null) => void = (
    newToken: string | null
  ) => console.warn("Tried to set token in requester before hooks were run");

  setToken(token: string | null, setToken: (newToken: string | null) => void) {
    this.token = token;
    this.setTokenFn = setToken;
  }

  private getConfig() {
    const headers: { [x: string]: string } = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return {
      withCredentials: true,
      headers
    } as AxiosRequestConfig;
  }

  private async get<T>(path: string) {
    const response = await axios.get<T>(path, this.getConfig());

    return response.data;
  }

  private async post<T>(path: string, data: any) {
    const response = await axios.post<T>(path, data, this.getConfig());

    return response.data;
  }

  async getLinkById(id: string): Promise<LinkDetail> {
    const data = await this.get<LinkDetailResponse>(
      `${SERVER_HOST}/links/${id}`
    );
    return data.link;
  }

  async searchByTag(tags: string[]): Promise<LinkDetail[]> {
    const data = await this.post<SearchResponse>(`${SERVER_HOST}/search`, {
      tags
    });

    return data.links;
  }

  async addNewLink(url: string, tags: string[]): Promise<string> {
    const data = await this.post<NewLinkResponse>(`${SERVER_HOST}/links`, {
      url,
      tags
    });

    return data.id;
  }
}
