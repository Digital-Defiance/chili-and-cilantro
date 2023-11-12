import { UtilityService } from "../../src/services/utility";
import { constants, CardType } from '@chili-and-cilantro/chili-and-cilantro-lib';

describe('UtilityService', () => {
  describe('generateGameCode', () => {
    it('should generate an N character code', () => {
      const code = UtilityService.generateGameCode();
      const regex = new RegExp(`^[A-Z]{${constants.GAME_CODE_LENGTH}}$`);
      expect(code).toMatch(regex);
    });
  });
  describe('shuffleArray', () => {
    it('should shuffle an array', () => {
      const array = [1, 2, 3, 4, 5];
      const shuffledArray = UtilityService.shuffleArray(array);
      expect(shuffledArray).not.toEqual(array);
      // the shuffled array should contain the same elements as the original array
      expect(shuffledArray.length).toEqual(array.length);
      expect(shuffledArray.every((element) => array.includes(element))).toBe(true);
      expect(array.every((element) => shuffledArray.includes(element))).toBe(true);
    });
    it('should shuffle an array with duplicate values and have the same count of each value', () => {
      const array = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5];
      const shuffledArray = UtilityService.shuffleArray(array);
      expect(shuffledArray).not.toEqual(array);
      // the shuffled array should contain the same elements as the original array
      expect(shuffledArray.length).toEqual(array.length);
      expect(shuffledArray.every((element) => array.includes(element))).toBe(true);
      expect(array.every((element) => shuffledArray.includes(element))).toBe(true);
      // the shuffled array should have the same count of each element as the original array
      const arrayCounts = array.reduce((counts, element) => {
        counts[element] = (counts[element] || 0) + 1;
        return counts;
      }, {});
      const shuffledArrayCounts = shuffledArray.reduce((counts, element) => {
        counts[element] = (counts[element] || 0) + 1;
        return counts;
      }, {});
      expect(shuffledArrayCounts).toEqual(arrayCounts);
    });
    it('should shuffle objects in an array', () => {
      const array = [{ name: 'a' }, { name: 'b' }, { name: 'c' }, { name: 'd' }, { name: 'e' }];
      const shuffledArray = UtilityService.shuffleArray(array);
      expect(shuffledArray).not.toEqual(array);
      // the shuffled array should contain the same elements as the original array
      expect(shuffledArray.length).toEqual(array.length);
      expect(shuffledArray.every((element) => array.includes(element))).toBe(true);
      expect(array.every((element) => shuffledArray.includes(element))).toBe(true);
    });
  });
  describe('makeHand', () => {
    it('should make a hand with the correct number of each type of card', () => {
      const hand = UtilityService.makeHand();
      const chiliCount = hand.filter((card) => card.type === CardType.CHILI).length;
      const cilantroCount = hand.filter((card) => card.type === CardType.CILANTRO).length;
      expect(hand.length).toEqual(constants.MAX_HAND_SIZE);
      expect(chiliCount).toEqual(constants.CHILI_PER_HAND);
      expect(cilantroCount).toEqual(constants.MAX_HAND_SIZE - constants.CHILI_PER_HAND);
    });
  });
});