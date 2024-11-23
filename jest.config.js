
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Add this if you are using custom paths
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/.*\\.spec\\.js$/"
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text", "clover"]
};