import { getLinkByIdFn } from "./links";
jest.mock("./links");

test("throw when the link is not present", async () => {
  expect.assertions(1);
  try {
    await getLinkByIdFn("0");
    throw new Error("No error was thrown");
  } catch (e) {
    expect(e).toEqual(new Error("Invalid ID"));
  }
});

test("return the link if set", async () => {
  expect.assertions(1);
  const link = getLinkByIdFn("1");
  expect(link).toEqual({
    id: "1",
    url: "https://example.com",
    title: "Example",
    inserted: new Date()
  });
});
