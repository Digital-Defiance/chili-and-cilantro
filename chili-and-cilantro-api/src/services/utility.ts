import {
  CardType,
  constants,
  ICard,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { randomBytes } from 'crypto';

export abstract class UtilityService {
  /**
   * Generates a random game code which may or may not be in use
   * @returns A random game code of the specified length
   */
  public static generateGameCode(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const bytes = randomBytes(constants.GAME_CODE_LENGTH);
    let code = '';
    for (let i = 0; i < constants.GAME_CODE_LENGTH; i++) {
      code += letters[bytes[i] % letters.length];
    }
    return code;
  }

  /**
   * Swaps two elements in an array. Included only as a means to inspect the swap count in tests.
   * @param array The array to swap elements in
   * @param index1 The first index to swap
   * @param index2 The second index to swap
   */
  public static swapElements(
    array: any[],
    index1: number,
    index2: number,
  ): void {
    [array[index1], array[index2]] = [array[index2], array[index1]];
  }

  /**
   * Utility method to shuffle array (consider placing this in a shared utility file)
   * @param array
   * @returns shuffled array
   */
  public static shuffleArray(array: any[]): any[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      UtilityService.swapElements(newArray, i, j);
    }
    return newArray;
  }

  /**
   * Generates a hand of cards for a player
   * @returns An array of ICards, all face down
   */
  public static makeHand(): ICard[] {
    const handSize = constants.HAND_SIZE;
    const numChili = constants.CHILI_PER_HAND;
    const numCilantro = handSize - numChili;
    const hand: ICard[] = [];
    for (let i = 0; i < numChili; i++) {
      hand.push({ type: CardType.Chili, faceUp: false });
    }
    for (let i = 0; i < numCilantro; i++) {
      hand.push({ type: CardType.Cilantro, faceUp: false });
    }
    return hand;
  }
}
