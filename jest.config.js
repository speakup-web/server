/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageProvider: 'babel',
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    '@Applications/(.*)': '<rootDir>/src/Applications/$1',
    '@Commons/(.*)': '<rootDir>/src/Commons/$1',
    '@Domains/(.*)': '<rootDir>/src/Domains/$1',
    '@Infrastructures/(.*)': '<rootDir>/src/Infrastructures/$1',
    '@Interfaces/(.*)': '<rootDir>/src/Interfaces/$1',
  },
}
