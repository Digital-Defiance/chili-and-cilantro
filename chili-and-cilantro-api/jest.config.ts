/* eslint-disable */
export default {
  displayName: 'chili-and-cilantro-api',
  preset: '../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../coverage/chili-and-cilantro-api',
  coveragePathIgnorePatterns: ['src/mocks/*', 'test/fixtures/*'],
  setupFiles: ['<rootDir>/test/test-setup.ts'],
};
