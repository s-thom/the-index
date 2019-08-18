import { run, generateID } from "./db";
import { Tag } from "../functions/tags";

interface TagRow {
  id: string;
  tag_name: string;
}

export async function getAllTags(): Promise<Tag[] | null> {
  // TODO:
  return null;
}

export function insertTag(tagName: string) {
  return run<Tag | null>(db => {
    return new Promise((res, rej) => {
      const statement = db.prepare("INSERT INTO tags VALUES (?, ?)");
      const newId = generateID();

      const tag: Tag = {
        id: newId,
        name: tagName
      };

      statement.run(newId, tagName, (err?: Error) => {
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

export function getOrInsertTags(tags: string[]) {
  return run<Map<string, Tag>>(db => {
    return new Promise((res, rej) => {
      // SQLite doesn't support binding for lists, so have to build the entire query string ourselves
      const paramString = tags.map(() => "?").join(", ");

      const statement = db.prepare(
        `SELECT * FROM tags WHERE tag_name IN (${paramString})`
      );

      // Generally using .all or .getAll is discouraged, but I think the result set size will be
      // low enough to not matter for performance
      statement.all(...tags, (err?: Error, rows?: TagRow[]) => {
        if (err) {
          rej(err);
          return;
        }

        const tagMap: Map<string, Tag> = new Map();
        const nameExistsMap: Map<string, boolean> = new Map();

        // Add existing tags to the map
        if (rows) {
          rows.forEach((row: TagRow) => {
            tagMap.set(row.id, { id: row.id, name: row.tag_name });
            nameExistsMap.set(row.tag_name, true);
          });
        }

        // If performance *really* gets tight, then this could be switched
        // to a single reduce call. But if we're getting to that stage then
        // we may as well abandon functional programming altogether
        const insertPromises = tags
          .filter(name => nameExistsMap.has(name))
          .map(name => insertTag(name));

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
