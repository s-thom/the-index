import { searchLinksByTagsFn } from "./search";
jest.mock("../database/links");
jest.mock("../database/tags");
jest.mock("../database/users");

test("searchLinksByTagsFn returns successfully", async () => {
  expect.assertions(1);
  const link = await searchLinksByTagsFn(["example"], "user", {});
  expect(link).toEqual([
    {
      id: "1",
      url: "https://example.com",
      inserted: expect.anything(),
      tags: ["example", "test", "another"],
      user: {
        id: "user",
        name: "example-user"
      }
    }
  ]);
});
