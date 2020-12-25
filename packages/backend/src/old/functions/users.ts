import * as otplib from 'otplib';
import {
  getUserAuthByMethod,
  getUserById,
  getUserByName,
  insertUser,
  removeUserAuthByMethod,
  setUserAuth,
} from '../database/users';
import { isValidIdentifier } from '../util/validation';

export interface User {
  id: string;
  name: string;
  created: Date;
}

export interface UserAuth {
  userId: string;
  method: string;
  secret: string;
}

export async function getUserByIdFn(id: string) {
  if (typeof id !== 'string') {
    throw new Error('Invalid ID');
  }

  const user = await getUserById(id);

  if (!user) {
    throw new Error('Invalid ID');
  }

  return user;
}

export async function getUserByNameFn(name: string) {
  if (typeof name !== 'string') {
    throw new Error('Invalid details');
  }

  const user = await getUserByName(name);

  if (!user) {
    throw new Error('Invalid details');
  }

  return user;
}

export async function addNewUserFn(name: string) {
  if (typeof name !== 'string') {
    throw new Error('Invalid name');
  }
  if (!isValidIdentifier(name)) {
    throw new Error('Invalid name');
  }

  // Insert new user
  const user = insertUser(name);

  return user;
}

export async function userHasAuthentication(userId: string, method: string) {
  const auth = await getUserAuthByMethod(userId, method);
  return auth !== null;
}

export async function verifyUserTotpCode(userId: string, code: string) {
  const auth = await getUserAuthByMethod(userId, 'totp');

  if (auth === null) {
    throw new Error('Unable to get secret');
  }

  return otplib.authenticator.check(code, auth.secret);
}

export async function resetUserTotpCode(userId: string) {
  await removeUserAuthByMethod(userId, 'totp');

  const secret = otplib.authenticator.generateSecret();

  const auth = await setUserAuth(userId, 'totp', secret);

  if (!auth) {
    throw new Error('Unable to reset authentication');
  }

  return auth;
}
