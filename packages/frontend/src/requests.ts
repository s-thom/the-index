import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import {
  GetLinksIdResponse,
  GetTagsResponse,
  PostLinksResponse,
  PostSearchResponse,
  PostLoginSuccessResponse,
  PostLoginSetupResponse,
  PostLoginChallengeResponse,
  PostLoginRequest as PostLoginEmptyRequest,
  PostLoginTOTPRequest,
} from './api-types';

const SERVER_HOST = process.env.REACT_APP_SERVER_PATH;

export type PostLoginRequest = PostLoginEmptyRequest | PostLoginTOTPRequest;
export type PostLoginResponse = PostLoginSuccessResponse | PostLoginSetupResponse | PostLoginChallengeResponse;

export default class Requester {
  private token: string | null = null;

  private setTokenFn: (newToken: string | null) => void = () => {
    // eslint-disable-next-line no-console
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
    const data = await this.get<GetLinksIdResponse>(`${SERVER_HOST}/links/${id}`);
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

    const data = await this.post<PostSearchResponse>(`${SERVER_HOST}/search`, reqData);

    return data.links;
  }

  async addNewLink(url: string, tags: string[]) {
    const data = await this.post<PostLinksResponse>(`${SERVER_HOST}/links`, {
      url,
      tags,
    });

    return data.id;
  }

  async getCommonTags(excludeTags: string[]) {
    const tagsParam = excludeTags.join(',');

    const data = await this.get<GetTagsResponse>(`${SERVER_HOST}/tags${tagsParam ? `?excludeTags=${tagsParam}` : ''}`);

    return data.tags;
  }

  async login(loginData: PostLoginRequest) {
    const data = await this.post<PostLoginResponse>(`${SERVER_HOST}/login`, loginData);

    return data;
  }
}
