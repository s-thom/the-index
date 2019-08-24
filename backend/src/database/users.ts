import { run, generateID } from "./db";
import { User } from "../functions/users";

interface UserRow {
  id: string;
  user_name: string;
  created_dts: string;
}

export function insertUser(name: string) {
  return run<User | null>(db => {
    return new Promise((res, rej) => {
      const statement = db.prepare(
        "INSERT INTO users (id, user_name, created_dts) VALUES (?, ?, ?)"
      );
      const newId = generateID();
      const createdDate = new Date();

      const user: User = {
        id: newId,
        name,
        created: createdDate
      };

      statement.run(newId, name, createdDate.toISOString(), (err?: Error) => {
        if (err) {
          rej(err);
          return;
        }

        res(user);
      });

      statement.finalize();
    });
  });
}

export function getUserById(id: string) {
  return run<User | null>(db => {
    return new Promise((res, rej) => {
      const statement = db.prepare("SELECT * FROM users WHERE id = ?");

      statement.get(id, (err?: Error, row?: UserRow) => {
        if (err) {
          rej(err);
          return;
        }

        if (!row) {
          res(null);
          return;
        }

        const user: User = {
          id: row.id,
          name: row.user_name,
          created: new Date(row.created_dts)
        };
        res(user);
      });

      statement.finalize();
    });
  });
}

export function getUserByName(name: string) {
  return run<User | null>(db => {
    return new Promise((res, rej) => {
      const statement = db.prepare("SELECT * FROM users WHERE user_name = ?");

      statement.get(name, (err?: Error, row?: UserRow) => {
        if (err) {
          rej(err);
          return;
        }

        if (!row) {
          res(null);
          return;
        }

        const user: User = {
          id: row.id,
          name: row.user_name,
          created: new Date(row.created_dts)
        };
        res(user);
      });

      statement.finalize();
    });
  });
}
