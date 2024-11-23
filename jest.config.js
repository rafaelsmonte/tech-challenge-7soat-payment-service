
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Add this if you are using custom paths
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
  },
};