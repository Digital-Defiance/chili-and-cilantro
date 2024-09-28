import { execSync } from 'child_process';
import { config } from 'dotenv';
import { join, resolve } from 'path';

// Load .env file from the root directory
config({ path: resolve(__dirname, '../../../chili-and-cilantro-api/.env') });

describe('CLI tests', () => {
  it('should print a message', () => {
    const cliPath = join(process.cwd(), 'dist/chili-and-cilantro-api');

    const output = execSync(`node ${cliPath}`, {
      env: { ...process.env },
    }).toString();

    expect(output).toMatch(/Hello World/);
  });
});
