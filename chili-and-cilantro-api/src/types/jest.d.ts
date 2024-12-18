// This file is necessary to make the TypeScript compiler aware of the Jest types
import '@types/jest';

declare global {
  const jest: typeof import('@jest/globals').jest;
  const expect: typeof import('@jest/globals').expect;
  const test: typeof import('@jest/globals').test;
  const describe: typeof import('@jest/globals').describe;
  const beforeEach: typeof import('@jest/globals').beforeEach;
  const afterEach: typeof import('@jest/globals').afterEach;
  const beforeAll: typeof import('@jest/globals').beforeAll;
  const afterAll: typeof import('@jest/globals').afterAll;
}