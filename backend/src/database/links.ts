export interface Link {
  id: string;
  url: string;
  title: string;
  inserted: Date;
}

export function insertLink(url: string, title: string) {}

export function getLinkById(id: string) {}
