import { User, UserAuth } from "../../functions/users";

export async function insertUser(name: string) {
  switch (name) {
    case "example-user":
      return {
        id: "1",
        name,
        created: new Date()
      } as User;
    case "null":
      throw new Error("Unable to save");
    default:
      throw new Error("Unmocked value");
  }
}

export async function getUserById(id: string) {
  switch (id) {
    case "user":
      return {
        id,
        name: "example-user",
        created: new Date()
      } as User;
    case "null":
      return null;
    default:
      throw new Error("Unmocked value");
  }
}

export async function getUserByName(name: string) {
  switch (name) {
    case "example-user":
      return {
        id: "1",
        name,
        created: new Date()
      } as User;
    case "null":
      return null;
    default:
      throw new Error("Unmocked value");
  }
}

export async function getUserAuthByMethod(userId: string, method: string) {
  switch (userId) {
    case "user":
      return {
        userId,
        method,
        secret: "secretive_secret"
      } as UserAuth;
    default:
      throw new Error("Unmocked value");
  }
}

export function setUserAuth(userId: string, method: string, secret: string) {
  switch (userId) {
    case "user":
      return {
        userId,
        method,
        secret
      } as UserAuth;
    default:
      throw new Error("Unmocked value");
  }
}

export function removeUserAuthByMethod(userId: string, method: string) {
  switch (userId) {
    case "user":
      return null;
    default:
      throw new Error("Unmocked value");
  }
}
