import { run, generateID } from './db';

interface Link {
  id: string;
  url: string;
  inserted: Date;
  userId: string;
}

interface LinkRow {
  id: string;
  url_path: string;
  inserted_dts: string;
  user_id: string;
}

export function insertLink(url: string, userId: string) {
  return run<Link | null>((db) => {
    return new Promise((res, rej) => {
      const statement = db.prepare('INSERT INTO links (id, url_path, inserted_dts, user_id) VALUES (?, ?, ?, ?)');
      const newId = generateID();
      const insertionDate = new Date();

      const link: Link = {
        id: newId,
        url,
        inserted: insertionDate,
        userId,
      };

      statement.run(newId, url, insertionDate.toISOString(), userId, (err?: Error) => {
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

export function getLinkById(id: string, userId: string) {
  return run<Link | null>((db) => {
    return new Promise((res, rej) => {
      const statement = db.prepare('SELECT * FROM links WHERE id = ? AND user_id = ?');

      statement.get(id, userId, (err?: Error, row?: LinkRow) => {
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
          inserted: new Date(row.inserted_dts),
          userId: row.user_id,
        };
        res(link);
      });

      statement.finalize();
    });
  });
}
