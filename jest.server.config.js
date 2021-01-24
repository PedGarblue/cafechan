module.exports = {
  displayName: 'server',
  testEnvironment: 'node',
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  restoreMocks: true,
  transform: {},
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/$1',
  },
  coveragePathIgnorePatterns: ['node_modules', 'app/', 'src/config', 'src/app.js', 'tests'],
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  roots: ['<rootDir>/tests/server/'],
};
