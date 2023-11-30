/**
 * Generates a random string of length between minLength and maxLength
 * @param minLength 
 * @param maxLength 
 * @returns 
 */
export function generateString(minLength: number, maxLength: number): string {
  // Generate a random string of length between minLength and maxLength
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  // include random characters including space
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Generates a random number between min and max
 * @param min 
 * @param max 
 * @returns 
 */
export function numberBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}