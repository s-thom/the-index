import { run } from "./db";
import { Link } from "../functions/links";

export function insertLink(url: string, title: string) {}

export function getLinkById(id: string) {
  return run<Link | null>(db => {
    return new Promise((res, rej) => {
      const statement = db.prepare("SELECT * FROM links WHERE id = ?");

      statement.run(id, (err?: Error, row?: any) => {
        if (err) {
          rej(err);
          return;
        }

        if (!row) {
          res(null);
        }

        const link: Link = {
          id: row.id,
          url: row.url_path,
          title: row.title,
          inserted: new Date(row.inserted_dts)
        };
        res(link);
      });

      statement.finalize();
    });
  });
}
