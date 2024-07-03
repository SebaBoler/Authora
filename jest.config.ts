import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@auth/(.*)$': '<rootDir>/src/auth/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@user/(.*)$': '<rootDir>/src/user/$1',
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@database/(.*)$': '<rootDir>/src/database/$1',
  },
  testEnvironment: 'node',
  transformIgnorePatterns: ['node_modules/(?!nanoid/.*)'],
};

export default config;

// module.exports = {
//   moduleFileExtensions: ['js', 'json', 'ts'],
//   rootDir: '.',
//   testRegex: '.*\\.spec\\.ts$',
//   transform: {
//     '^.+\\.(t|j)s$': 'ts-jest',
//   },
//   moduleNameMapper: {
//     '^@auth/(.*)$': '<rootDir>/src/auth/$1',
//     '^@common/(.*)$': '<rootDir>/src/common/$1',
//     '^@user/(.*)$': '<rootDir>/src/user/$1',
//     '^@app/(.*)$': '<rootDir>/src/app/$1',
//     '^@database/(.*)$': '<rootDir>/src/database/$1',
//   },
//   testEnvironment: 'node',
//   transformIgnorePatterns: ['node_modules/(?!nanoid/.*)'],
// };
