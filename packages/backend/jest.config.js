/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  resetMocks: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.{js,ts}'],
  coveragePathIgnorePatterns: ['<rootDir>/src/api-types.ts', '<rootDir>/migrations'],
};
