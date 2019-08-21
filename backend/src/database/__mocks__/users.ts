import { User } from "../../functions/auth";

export async function insertUser(name: string) {
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
