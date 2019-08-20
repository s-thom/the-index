import { searchLinksByTagsFn } from "./search";
jest.mock("../database/links");
jest.mock("../database/tags");

test("getLinkDetailByID returns successfully", async () => {
  expect.assertions(1);
  const link = await searchLinksByTagsFn(["example"]);
  expect(link).toEqual([
    {
      id: "1",
      url: "https://example.com",
      inserted: expect.anything(),
      tags: ["example", "test", "another"]
    }
  ]);
});
