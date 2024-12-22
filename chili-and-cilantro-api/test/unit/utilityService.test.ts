import {
  CardType,
  constants,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { UtilityService } from '../../src/services/utility';

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
      expect(shuffledArray.every((element) => array.includes(element))).toBe(
        true,
      );
      expect(array.every((element) => shuffledArray.includes(element))).toBe(
        true,
      );
    });
    it('should shuffle an array with duplicate values and have the same count of each value', () => {
      const array = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5];
      const shuffledArray = UtilityService.shuffleArray(array);
      expect(shuffledArray).not.toEqual(array);
      // the shuffled array should contain the same elements as the original array
      expect(shuffledArray.length).toEqual(array.length);
      expect(shuffledArray.every((element) => array.includes(element))).toBe(
        true,
      );
      expect(array.every((element) => shuffledArray.includes(element))).toBe(
        true,
      );
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
      const array = [
        { name: 'a' },
        { name: 'b' },
        { name: 'c' },
        { name: 'd' },
        { name: 'e' },
      ];
      const shuffledArray = UtilityService.shuffleArray(array);
      expect(shuffledArray).not.toEqual(array);
      // the shuffled array should contain the same elements as the original array
      expect(shuffledArray.length).toEqual(array.length);
      expect(shuffledArray.every((element) => array.includes(element))).toBe(
        true,
      );
      expect(array.every((element) => shuffledArray.includes(element))).toBe(
        true,
      );
    });
    it('should call swap the correct number of times when shuffling an array', () => {
      const testArray = [1, 2, 3, 4, 5];
      const swapSpy = jest.spyOn(UtilityService, 'swapElements');

      UtilityService.shuffleArray(testArray);

      // The number of swaps should be equal to the length of the array - 1
      expect(swapSpy).toHaveBeenCalledTimes(testArray.length - 1);

      swapSpy.mockRestore();
    });
  });
  describe('swapElements', () => {
    it('should swap elements in-place', () => {
      const testArray = [1, 2, 3, 4, 5];
      const originalArray = [...testArray]; // Copy to compare later

      // Swap two elements
      UtilityService.swapElements(testArray, 0, 4); // Swapping first and last elements

      // Check if the swap was in-place
      expect(testArray[0]).toBe(originalArray[4]);
      expect(testArray[4]).toBe(originalArray[0]);

      // Check if other elements remain unchanged
      for (let i = 1; i < testArray.length - 1; i++) {
        expect(testArray[i]).toBe(originalArray[i]);
      }
    });
  });
  describe('makeHand', () => {
    it('should make a hand with the correct number of each type of card', () => {
      const hand = UtilityService.makeHand();
      const chiliCount = hand.filter(
        (card) => card.type === CardType.Chili,
      ).length;
      const cilantroCount = hand.filter(
        (card) => card.type === CardType.Cilantro,
      ).length;
      expect(hand.length).toEqual(constants.HAND_SIZE);
      expect(chiliCount).toEqual(constants.CHILI_PER_HAND);
      expect(cilantroCount).toEqual(
        constants.HAND_SIZE - constants.CHILI_PER_HAND,
      );
    });
  });
});
