import { Link } from "../../functions/links";

export async function insertLink(
  url: string,
  title: string
): Promise<Link | null> {
  switch (url) {
    case "https://example.com":
      return {
        id: "1",
        url,
        inserted: new Date()
      };
    case "fail link":
      return null;
    default:
      throw new Error("Unmocked value");
  }
}

export async function getLinkById(id: string): Promise<Link | null> {
  switch (id) {
    case "0":
      return null;
    case "1":
      return {
        id: "1",
        url: "https://example.com",
        inserted: new Date()
      };
    default:
      throw new Error("Unmocked value");
  }
}
