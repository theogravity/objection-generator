module.exports = {
  preset: 'ts-jest',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/templates/*'
  ],
  testResultsProcessor: './node_modules/jest-junit-reporter',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/build',
    '/node_modules/'
  ],
  coverageThreshold: {
    global: {
      statements: 84,
      branches: 75,
      functions: 87,
      lines: 84
    }
  }
}
