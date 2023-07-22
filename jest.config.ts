import type { Config } from "jest"

const config: Config = {
  // Personal preference =)
  bail: 1,
  clearMocks: true,
  verbose: false,

  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: [ "**/?(*.)+(spec|test).+(ts|js)" ],
  transform: { "^.+\\.(ts)$": "ts-jest" },

  // Coverage Setup
  collectCoverage: true,
  coverageProvider: "v8",
  coverageDirectory: "coverage",
  coverageReporters: ["html", ['text', {skipFull: true}], "text-summary"],
  coveragePathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/node_modules/"],
  collectCoverageFrom: [
    './src/**/*.{js,ts}',
    '!./src/{app,server}.{js,ts}',
    '!./src/**/index.{js,ts}',
    '!./src/**/*.mock.{js,ts}',
    '!./src/**/*.route.{js,ts}',
    '!**/node_modules/**',
  ],

}

export default config
