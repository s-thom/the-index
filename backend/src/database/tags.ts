import { run, generateID } from "./db";
import { Tag } from "../functions/tags";

interface TagRow {
  id: string;
  tag_name: string;
  user_id: string;
}

interface LinkIdRow {
  link_id: string;
}

export async function getAllTags(): Promise<Tag[]> {
  return run<Tag[]>(db => {
    return new Promise((res, rej) => {
      const statement = db.prepare(
        `SELECT *
FROM tags
ORDER BY t.tag_name`
      );

      // Generally using .all or .getAll is discouraged, but I think the result set size will be
      // low enough to not matter for performance
      statement.all((err?: Error, rows?: TagRow[]) => {
        if (err) {
          rej(err);
          return;
        }

        if (!rows) {
          res([]);
          return;
        }

        const tags = rows.map(row => ({
          id: row.id,
          name: row.tag_name,
          userId: row.user_id
        }));
        res(tags);
      });

      statement.finalize();
    });
  });
}

export function insertTag(tagName: string, userId: string) {
  return run<Tag | null>(db => {
    return new Promise((res, rej) => {
      const statement = db.prepare(
        "INSERT INTO tags (id, tag_name, user_id) VALUES (?, ?, ?)"
      );
      const newId = generateID();

      const tag: Tag = {
        id: newId,
        name: tagName,
        userId
      };

      statement.run(newId, tagName, userId, (err?: Error) => {
        if (err) {
          rej(err);
          return;
        }

        res(tag);
      });

      statement.finalize();
    });
  });
}

export function getOrInsertTags(tags: string[], userId: string) {
  return run<Map<string, Tag>>(db => {
    return new Promise((res, rej) => {
      // SQLite doesn't support binding for lists, so have to build the entire query string ourselves
      const paramString = tags.map(() => "?").join(", ");

      const statement = db.prepare(
        `SELECT * FROM tags WHERE tag_name IN (${paramString}) AND user_id = ?`
      );

      // Generally using .all or .getAll is discouraged, but I think the result set size will be
      // low enough to not matter for performance
      statement.all(...tags, userId, (err?: Error, rows?: TagRow[]) => {
        if (err) {
          rej(err);
          return;
        }

        const tagMap: Map<string, Tag> = new Map();
        const nameExistsMap: Map<string, boolean> = new Map();

        // Add existing tags to the map
        if (rows) {
          rows.forEach((row: TagRow) => {
            tagMap.set(row.id, { id: row.id, name: row.tag_name, userId });
            nameExistsMap.set(row.tag_name, true);
          });
        }

        // If performance *really* gets tight, then this could be switched
        // to a single reduce call. But if we're getting to that stage then
        // we may as well abandon functional programming altogether
        const insertPromises = tags
          .filter(name => !nameExistsMap.has(name))
          .map(name => insertTag(name, userId));

        Promise.all(insertPromises).then(insertResults => {
          let failedInserts = 0;

          insertResults.forEach(result => {
            if (result) {
              tagMap.set(result.id, result);
            } else {
              failedInserts++;
            }
          });

          if (failedInserts) {
            console.warn(
              `[getOrInsertTag] ${failedInserts} tags failed to insert`
            );
          }

          res(tagMap);
        }, rej);
      });

      statement.finalize();
    });
  });
}

export function addTagsToLink(linkId: string, tagIds: string[]) {
  return run<void>(db => {
    return new Promise((res, rej) => {
      const statement = db.prepare("INSERT INTO link_tags VALUES (?, ?)");

      const failedTags = [];

      tagIds.forEach(tagId => {
        statement.run(linkId, tagId, (err?: Error) => {
          // If the insert failed, make a note of it
          if (err) {
            failedTags.push(tagId);
          }
        });
      });

      if (failedTags.length) {
        console.warn(
          `[addTagsToLink] ${failedTags.length} tag-links failed to insert`
        );
      }

      statement.finalize();

      res();
    });
  });
}

export function searchLinkIdsByTags(
  tags: string[],
  userId: string
): Promise<string[]> {
  return run<string[]>(db => {
    return new Promise((res, rej) => {
      // SQLite doesn't support binding for lists, so have to build the entire query string ourselves
      const paramString = tags.map(() => "?").join(", ");

      const statement = db.prepare(
        `SELECT DISTINCT(link_id)
FROM tags t
  JOIN link_tags lt ON t.id = lt.tag_id
  JOIN links l ON lt.link_id = l.id
WHERE
  t.tag_name IN (${paramString}) AND
  l.user_id = ?
GROUP BY link_id
ORDER BY
  COUNT(tag_id) DESC,
  link_id DESC`
      );

      // Generally using .all or .getAll is discouraged, but I think the result set size will be
      // low enough to not matter for performance
      statement.all(...tags, userId, (err?: Error, rows?: LinkIdRow[]) => {
        if (err) {
          rej(err);
          return;
        }

        if (!rows) {
          res([]);
          return;
        }

        res(rows.map(row => row.link_id));
      });

      statement.finalize();
    });
  });
}

export function getTagsForLinkId(
  linkId: string,
  userId: string
): Promise<Tag[]> {
  return run<Tag[]>(db => {
    return new Promise((res, rej) => {
      const statement = db.prepare(
        `SELECT t.*
FROM link_tags lt
  JOIN tags t ON lt.tag_id = t.id
  JOIN links l ON lt.link_id = l.id
WHERE
  link_id = ? AND
  l.user_id = ?
ORDER BY t.tag_name`
      );

      // Generally using .all or .getAll is discouraged, but I think the result set size will be
      // low enough to not matter for performance
      statement.all(linkId, userId, (err?: Error, rows?: TagRow[]) => {
        if (err) {
          rej(err);
          return;
        }

        if (!rows) {
          res([]);
          return;
        }

        const tags = rows.map(row => ({
          id: row.id,
          name: row.tag_name,
          userId
        }));
        res(tags);
      });

      statement.finalize();
    });
  });
}
