import { randomBytes } from 'crypto';

export function generateBcryptHash(): string {
  const version = ['$2a', '$2b', '$2x', '$2y', '$2'][
    Math.floor(Math.random() * 5)
  ];
  const cost = String(Math.floor(Math.random() * 10) + 10).padStart(2, '0');
  const saltAndHash =
    randomBytes(22) // Generate 22 RANDOM bytes for the salt
      .toString('base64') // Encode to base64
      .replace(/\+/g, '.') // Replace invalid bcrypt characters
      .replace(/\//g, '/')
      .substring(0, 22) + // Take only the first 22 base64 characters for salt
    randomBytes(31)
      .toString('base64') // Generate 31 RANDOM bytes and encode for hash
      .replace(/\+/g, '.')
      .replace(/\//g, '/')
      .substring(0, 31); // 31 base64 characters for hash

  return `${version}$${cost}$${saltAndHash}`;
}
