export default {
  preset: "ts-jest",
  testEnvironment: "miniflare",
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: "test/tsconfig.json",
        useESM: true
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  }
};
