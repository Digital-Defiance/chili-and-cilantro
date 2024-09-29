import { getJestProjectsAsync } from '@nx/jest';

export default async () => {
  const projects = await getJestProjectsAsync();
  return {
    projects,
    moduleNameMapper: {
      '^@chili-and-cilantro/chili-and-cilantro-node-lib$':
        '<rootDir>/__mocks__/@chili-and-cilantro/chili-and-cilantro-api.ts',
      '^@chili-and-cilantro/chili-and-cilantro-node-lib/(.*)$':
        '<rootDir>/__mocks__/@chili-and-cilantro/chili-and-cilantro-api.ts',
    },
  };
};
