import { getUserByIdFn, addNewUserFn, userHasAuthentication, verifyUserTotpCode, resetUserTotpCode } from './users';

jest.mock('../database/users');

test('getUserByIdFn throws when the user', async () => {
  expect.assertions(1);
  await expect(getUserByIdFn('null')).rejects.toEqual(new Error('Invalid ID'));
});

test('getUserByIdFn returns the id if set', async () => {
  expect.assertions(1);
  const user = await getUserByIdFn('user');
  expect(user).toEqual({
    id: 'user',
    name: 'example-user',
    created: expect.anything(),
  });
});

test('addNewUserFn throws when the user insertion fails', async () => {
  expect.assertions(1);
  await expect(addNewUserFn('null')).rejects.toEqual(new Error('Unable to save'));
});

test('addNewUserFn returns the data if valid', async () => {
  expect.assertions(1);
  const user = await addNewUserFn('example-user');
  expect(user).toEqual({
    id: '1',
    name: 'example-user',
    created: expect.anything(),
  });
});

test('userHasAuthentication returns the data if valid', async () => {
  expect.assertions(1);
  const hasAuth = await userHasAuthentication('user', 'totp');
  expect(hasAuth).toEqual(true);
});

test('verifyUserTotpCode returns false if the data is invalid', async () => {
  expect.assertions(1);
  const validity = await verifyUserTotpCode('user', '123456');
  expect(validity).toEqual(false);
});

test('resetUserTotpCode returns data if valid', async () => {
  expect.assertions(1);
  const auth = await resetUserTotpCode('user');
  expect(auth).toEqual({
    userId: 'user',
    method: 'totp',
    secret: expect.anything(),
  });
});
