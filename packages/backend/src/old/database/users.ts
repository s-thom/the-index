import { run, generateID } from './db';
import { User, UserAuth } from '../functions/users';

interface UserRow {
  id: string;
  user_name: string;
  created_dts: string;
}

interface UserAuthRow {
  user_id: string;
  auth_method: string;
  auth_secret: string;
}

export function insertUser(name: string) {
  return run<User | null>((db) => {
    return new Promise((res, rej) => {
      const statement = db.prepare('INSERT INTO users (id, user_name, created_dts) VALUES (?, ?, ?)');
      const newId = generateID();
      const createdDate = new Date();

      const user: User = {
        id: newId,
        name,
        created: createdDate,
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
  return run<User | null>((db) => {
    return new Promise((res, rej) => {
      const statement = db.prepare('SELECT * FROM users WHERE id = ?');

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
          created: new Date(row.created_dts),
        };
        res(user);
      });

      statement.finalize();
    });
  });
}

export function getUserByName(name: string) {
  return run<User | null>((db) => {
    return new Promise((res, rej) => {
      const statement = db.prepare('SELECT * FROM users WHERE user_name = ?');

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
          created: new Date(row.created_dts),
        };
        res(user);
      });

      statement.finalize();
    });
  });
}

export function getUserAuthByMethod(userId: string, method: string) {
  return run<UserAuth | null>((db) => {
    return new Promise((res, rej) => {
      const statement = db.prepare('SELECT * FROM user_authentication WHERE user_id = ? AND auth_method = ?');

      statement.get(userId, method, (err?: Error, row?: UserAuthRow) => {
        if (err) {
          rej(err);
          return;
        }

        if (!row) {
          res(null);
          return;
        }

        const authRow: UserAuth = {
          userId: row.user_id,
          method: row.auth_method,
          secret: row.auth_secret,
        };
        res(authRow);
      });

      statement.finalize();
    });
  });
}

export function setUserAuth(userId: string, method: string, secret: string) {
  return run<UserAuth | null>((db) => {
    return new Promise((res, rej) => {
      const statement = db.prepare('INSERT INTO user_authentication VALUES (?, ?, ?)');

      statement.run(userId, method, secret, (err?: Error) => {
        if (err) {
          rej(err);
          return;
        }

        res({
          userId,
          method,
          secret,
        });
      });

      statement.finalize();
    });
  });
}

export function removeUserAuthByMethod(userId: string, method: string) {
  return run<null>((db) => {
    return new Promise((res, rej) => {
      const statement = db.prepare('DELETE FROM user_authentication WHERE user_id = ? AND auth_method = ?');

      statement.run(userId, method, (err?: Error) => {
        if (err) {
          rej(err);
          return;
        }

        res(null);
      });

      statement.finalize();
    });
  });
}
