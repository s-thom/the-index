interface Link {
  id: string;
  url: string;
  inserted: Date;
  userId: string;
}

export async function insertLink(url: string, userId: string): Promise<Link | null> {
  switch (url) {
    case 'https://example.com':
      return {
        id: '1',
        url,
        inserted: new Date(),
        userId,
      };
    case 'fail link':
      return null;
    default:
      throw new Error('Unmocked value');
  }
}

export async function getLinkById(id: string, userId: string): Promise<Link | null> {
  switch (id) {
    case '0':
      return null;
    case '1':
      return {
        id: '1',
        url: 'https://example.com',
        inserted: new Date(),
        userId,
      };
    default:
      throw new Error('Unmocked value');
  }
}
