import { getUserById, insertUser, getUserByName } from "../database/users";
import { isValidIdentifier } from "../util/request";

export interface User {
  id: string;
  name: string;
  created: Date;
}

export async function getUserByIdFn(id: string) {
  if (typeof id !== "string") {
    throw new Error("Invalid ID");
  }

  const user = await getUserById(id);

  if (!user) {
    throw new Error("Invalid ID");
  }

  return user;
}

export async function getUserByNameFn(name: string) {
  if (typeof name !== "string") {
    throw new Error("Invalid name");
  }

  const user = await getUserByName(name);

  if (!user) {
    throw new Error("Invalid name");
  }

  return user;
}

export async function addNewUserFn(name: string) {
  if (typeof name !== "string") {
    throw new Error("Invalid name");
  }
  if (!isValidIdentifier(name)) {
    throw new Error("Invalid name");
  }

  // Insert new user
  const user = insertUser(name);

  return user;
}
