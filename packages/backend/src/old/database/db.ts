import sqlite3 from 'sqlite3';
import Container from 'typedi';
import IIdentifierService from '../../services/IdentifierService';
import IdentifierServiceImpl from '../../services/IdentifierServiceImpl';

const { DB_PATH } = process.env;
const { DB_USER } = process.env;
const { DB_PASS } = process.env;

if (!(DB_PATH && DB_USER && DB_PASS)) {
  throw new Error('One of the database environment variables is missing');
}

const db = new sqlite3.Database(DB_PATH);

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
  // TODO: Get some form of instance ID for if there's ever more than one of these running
  // Not really something to worry about now
  const idService = Container.get<IIdentifierService>(IdentifierServiceImpl);
  return idService.next();
}
