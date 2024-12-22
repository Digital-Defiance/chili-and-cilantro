import { faker } from '@faker-js/faker';
import * as constants from './constants';

describe('Regex Constants', () => {
  it('should validate game codes correctly', () => {
    expect(constants.GAME_CODE_REGEX.test('ABCDE')).toBe(true);
    expect(constants.GAME_CODE_REGEX.test('ABCDEF')).toBe(false); // Too long
    expect(constants.GAME_CODE_REGEX.test('ABCD')).toBe(false); // Too short
    expect(constants.GAME_CODE_REGEX.test('AbCdE')).toBe(false); // Lowercase
  });

  it('should validate game passwords correctly', () => {
    const validPassword = faker.internet.password(
      constants.MIN_GAME_PASSWORD_LENGTH,
      true,
    );
    const tooShortPassword = 'a'.repeat(constants.MIN_GAME_PASSWORD_LENGTH - 1);
    const tooLongPassword = 'a'.repeat(constants.MAX_GAME_PASSWORD_LENGTH + 1);

    expect(constants.GAME_PASSWORD_REGEX.test(validPassword)).toBe(true);
    expect(constants.GAME_PASSWORD_REGEX.test(tooShortPassword)).toBe(false);
    expect(constants.GAME_PASSWORD_REGEX.test(tooLongPassword)).toBe(false);
  });

  it('should validate game names correctly', () => {
    const validName = faker.lorem.words(3); // Adjust word count as needed
    const tooShortName = 'a';
    const tooLongName = 'a'.repeat(constants.MAX_GAME_NAME_LENGTH + 1);

    expect(constants.GAME_NAME_REGEX.test(validName)).toBe(true);
    expect(constants.GAME_NAME_REGEX.test(tooShortName)).toBe(false);
    expect(constants.GAME_NAME_REGEX.test(tooLongName)).toBe(false);
  });

  it('should validate usernames correctly', () => {
    const validUsername = faker.lorem
      .word({
        length: {
          min: constants.MIN_USERNAME_LENGTH,
          max: constants.MAX_USERNAME_LENGTH,
        },
      })
      .toLowerCase();
    const invalidUsername = '!invalid'; // Starts with invalid char
    const tooShortUsername = 'ab';
    const tooLongUsername = 'a'.repeat(constants.MAX_USERNAME_LENGTH + 1);

    expect(constants.USERNAME_REGEX.test(validUsername)).toBe(true);
    expect(constants.USERNAME_REGEX.test(invalidUsername)).toBe(false);
    expect(constants.USERNAME_REGEX.test(tooShortUsername)).toBe(false);
    expect(constants.USERNAME_REGEX.test(tooLongUsername)).toBe(false);
  });

  it('should validate passwords correctly', () => {
    const validPassword = 'TestPassword1!';
    const invalidPassword1 = 'testpassword'; // Missing uppercase and special char
    const invalidPassword2 = 'TestPassword'; // Missing special char
    const invalidPassword3 = 'Testpassword!'; // Missing uppercase

    expect(constants.PASSWORD_REGEX.test(validPassword)).toBe(true);
    expect(constants.PASSWORD_REGEX.test(invalidPassword1)).toBe(false);
    expect(constants.PASSWORD_REGEX.test(invalidPassword2)).toBe(false);
    expect(constants.PASSWORD_REGEX.test(invalidPassword3)).toBe(false);
  });

  it('should validate message correctly', () => {
    const validMessage = faker.lorem
      .sentence(4)
      .substring(0, constants.MAX_MESSAGE_LENGTH - 1);
    const tooLongMessage = 'a'.repeat(constants.MAX_MESSAGE_LENGTH + 1);

    expect(constants.MESSAGE_REGEX.test(validMessage)).toBe(true);
    expect(constants.MESSAGE_REGEX.test(tooLongMessage)).toBe(false);
  });
});
