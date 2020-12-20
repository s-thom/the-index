import { addNewLinkFn, getLinkByIdFn, getLinkDetailByIdFn } from './links';

jest.mock('../database/links');
jest.mock('../database/tags');
jest.mock('../database/users');

test('getLinkByID throws when the link is not present', async () => {
  expect.assertions(1);
  await expect(getLinkByIdFn('0', 'user')).rejects.toEqual(new Error('Invalid ID'));
});

test('getLinkByID returns the link if set', async () => {
  expect.assertions(1);
  const link = await getLinkByIdFn('1', 'user');
  expect(link).toEqual({
    id: '1',
    url: 'https://example.com',
    inserted: expect.anything(),
    userId: 'user',
  });
});

test('getLinkDetailByID returns the link if set', async () => {
  expect.assertions(1);
  const link = await getLinkDetailByIdFn('1', 'user');
  expect(link).toEqual({
    id: '1',
    url: 'https://example.com',
    inserted: expect.anything(),
    tags: ['example', 'test', 'another'],
    user: {
      id: 'user',
      name: 'example-user',
    },
  });
});

test('addNewLinkFn throws when the link insertion fails', async () => {
  expect.assertions(1);

  await expect(addNewLinkFn('fail link', [], 'user')).rejects.toEqual(new Error('Invalid URL'));
});

test('addNewLinkFn returns the data is valid', async () => {
  expect.assertions(1);
  const id = await addNewLinkFn('https://example.com', ['example'], 'user');
  expect(id).toEqual('1');
});

test("addNewLinkFn returns the data is valid but the tags don't insert", async () => {
  expect.assertions(1);
  const id = await addNewLinkFn('https://example.com', ['null'], 'user');
  expect(id).toEqual('1');
});