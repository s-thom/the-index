import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { LinkDetail, DecodedToken } from './types';

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

interface MostCommonTagsResponse {
  tags: string[];
}

interface LoginBlankRequest {
  name: string;
}

interface LoginTotpRequest {
  name: string;
  challenge: 'TOTP';
  response: string;
}

type LoginRequest = LoginBlankRequest | LoginTotpRequest;

export interface LoginSuccessResponse {
  token: string;
  content: DecodedToken;
}

export interface LoginTotpSetupResponse {
  requires: 'setup';
  code: string;
  url: string;
}

export interface LoginChallengeResponse {
  requires: 'challenge';
  totp: true;
}

export type LoginResponse = LoginSuccessResponse | LoginTotpSetupResponse | LoginChallengeResponse;

export default class Requester {
  private token: string | null = null;

  private setTokenFn: (newToken: string | null) => void = () => {
    console.warn('Tried to set token in requester before hooks were run');
  };

  setTokenFromHook(token: string | null, setToken: (newToken: string | null) => void) {
    this.token = token;
    this.setTokenFn = setToken;
  }

  setToken(token: string | null) {
    this.token = token;
    this.setTokenFn(token);
  }

  private getConfig() {
    const headers: { [x: string]: string } = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return {
      withCredentials: true,
      headers,
    } as AxiosRequestConfig;
  }

  private errorHandler(err: AxiosError): never {
    if (err.response) {
      switch (err.response.status) {
        case 401:
          if (this.token !== null) {
            this.setToken(null);
          }
          break;
        default:
      }
    }

    // Re-throw the error to ensure proper flow
    throw err;
  }

  private async get<T>(path: string) {
    const response = await axios.get<T>(path, this.getConfig()).catch((err) => this.errorHandler(err));

    if (response.headers['x-new-token']) {
      this.setToken(response.headers['x-new-token']);
    }

    return response.data;
  }

  private async post<T>(path: string, data: any) {
    const response = await axios.post<T>(path, data, this.getConfig()).catch((err) => this.errorHandler(err));

    if (response.headers['x-new-token']) {
      this.setToken(response.headers['x-new-token']);
    }

    return response.data;
  }

  async getLinkById(id: string) {
    const data = await this.get<LinkDetailResponse>(`${SERVER_HOST}/links/${id}`);
    return data.link;
  }

  async searchByTag(tags: string[], before?: Date, after?: Date) {
    const reqData: { tags: string[]; before?: string; after?: string } = {
      tags,
    };

    if (before) {
      reqData.before = before.toISOString();
    }
    if (after) {
      reqData.after = after.toISOString();
    }

    const data = await this.post<SearchResponse>(`${SERVER_HOST}/search`, reqData);

    return data.links;
  }

  async addNewLink(url: string, tags: string[]) {
    const data = await this.post<NewLinkResponse>(`${SERVER_HOST}/links`, {
      url,
      tags,
    });

    return data.id;
  }

  async getCommonTags(excludeTags: string[]) {
    const tagsParam = excludeTags.join(',');

    const data = await this.get<MostCommonTagsResponse>(
      `${SERVER_HOST}/tags${tagsParam ? `?excludeTags=${tagsParam}` : ''}`,
    );

    return data.tags;
  }

  async login(loginData: LoginRequest) {
    const data = await this.post<LoginResponse>(`${SERVER_HOST}/login`, loginData);

    return data;
  }
}
