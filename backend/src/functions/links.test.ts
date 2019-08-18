import { getLinkByIdFn } from "./links";
jest.mock("../database/links");
jest.mock("../database/tags");

test("getLinkByID throws when the link is not present", async () => {
  expect.assertions(1);
  try {
    await getLinkByIdFn("0");
    throw new Error("No error was thrown");
  } catch (e) {
    expect(e).toEqual(new Error("Invalid ID"));
  }
});

test("getLinkByID returns the link if set", async () => {
  expect.assertions(1);
  const link = await getLinkByIdFn("1");
  expect(link).toEqual({
    id: "1",
    url: "https://example.com",
    title: "Example",
    inserted: expect.anything()
  });
});
