import { getUserByIdFn, addNewUserFn } from "./users";
jest.mock("../database/users");

test("getUserByIdFn throws when the user", async () => {
  expect.assertions(1);
  try {
    await getUserByIdFn("null");
    throw new Error("No error was thrown");
  } catch (e) {
    expect(e).toEqual(new Error("Invalid ID"));
  }
});

test("getUserByIdFn returns the id if set", async () => {
  expect.assertions(1);
  const user = await getUserByIdFn("user");
  expect(user).toEqual({
    id: "user",
    name: "example-user",
    created: expect.anything()
  });
});

test("addNewUserFn throws when the user insertion fails", async () => {
  expect.assertions(1);
  try {
    await addNewUserFn("null");
    throw new Error("No error was thrown");
  } catch (e) {
    expect(e).toEqual(new Error("Unable to save"));
  }
});

test("addNewUserFn returns the data if valid", async () => {
  expect.assertions(1);
  const user = await addNewUserFn("example-user");
  expect(user).toEqual({
    id: "1",
    name: "example-user",
    created: expect.anything()
  });
});
