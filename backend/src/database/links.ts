import { run, generateID } from "./db";
import { Link } from "../functions/links";

interface LinkRow {
  id: string;
  url_path: string;
  inserted_dts: string;
}

export function insertLink(url: string) {
  return run<Link | null>(db => {
    return new Promise((res, rej) => {
      const statement = db.prepare(
        "INSERT INTO links (id, url_path, inserted_dts) VALUES (?, ?, ?)"
      );
      const newId = generateID();
      const insertionDate = new Date();

      const link: Link = {
        id: newId,
        url,
        inserted: insertionDate
      };

      statement.run(newId, url, insertionDate.toISOString(), (err?: Error) => {
        if (err) {
          rej(err);
          return;
        }

        res(link);
      });

      statement.finalize();
    });
  });
}

export function getLinkById(id: string) {
  return run<Link | null>(db => {
    return new Promise((res, rej) => {
      const statement = db.prepare("SELECT * FROM links WHERE id = ?");

      statement.get(id, (err?: Error, row?: LinkRow) => {
        if (err) {
          rej(err);
          return;
        }

        if (!row) {
          res(null);
          return;
        }

        const link: Link = {
          id: row.id,
          url: row.url_path,
          inserted: new Date(row.inserted_dts)
        };
        res(link);
      });

      statement.finalize();
    });
  });
}
