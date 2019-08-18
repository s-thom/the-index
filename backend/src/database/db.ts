import sqlite3 from "sqlite3";
import { ExtSnowflakeGenerator } from "extended-snowflake";

const DB_PATH = process.env.DB_PATH;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;

if (!(DB_PATH && DB_USER && DB_PASS)) {
  throw new Error("One of the database environment variables is missing");
}

const db = new sqlite3.Database(DB_PATH);

// TODO: Get some form of instance ID for if there's ever more than one of these running
// Not really something to worry about now
const idGenerator = new ExtSnowflakeGenerator(0);

export default db;

export function run<T>(fn: (db: sqlite3.Database) => Promise<T>) {
  return new Promise<T>((res, rej) => {
    try {
      db.serialize(() => {
        fn(db).then(res, rej);
      });
    } catch (err) {
      rej(err);
    }
  });
}

export function generateID() {
  return idGenerator.next();
}
