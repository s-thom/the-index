export interface Link {
  id: string;
  url: string;
  title: string;
  inserted: Date;
}

export interface LinkDetail extends Link {
  tags: string[];
}

export interface DecodedToken {
  userId: string;
}
