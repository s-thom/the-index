import axios from 'axios';
import { LinkDetail } from './types';

const SERVER_HOST = process.env.REACT_APP_SERVER_PATH;

interface SearchByTagResponse {
  links: LinkDetail[]
}

export async function searchByTag(tags: string[]): Promise<LinkDetail[]> {
  const response = await axios.post(`${SERVER_HOST}/search`, {
    tags,
  });

  return response.data.links;
}
