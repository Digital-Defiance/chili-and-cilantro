import { constants, CardType, ICard } from '@chili-and-cilantro/chili-and-cilantro-lib';

export abstract class UtilityService {
  /**
   * Generates a random game code which may or may not be in use
   * @returns A random game code of the specified length
   */
  public static generateGameCode(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < constants.GAME_CODE_LENGTH; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return code;
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
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements
    }
    return newArray;
  }

  /**
   * Generates a hand of cards for a player
   * @returns An array of ICards, all face down
   */
  public static makeHand(): ICard[] {
    const handSize = constants.MAX_HAND_SIZE;
    const numChili = constants.CHILI_PER_HAND;
    const numCilantro = handSize - numChili;
    const hand: ICard[] = [];
    for (let i = 0; i < numChili; i++) {
      hand.push({ type: CardType.CHILI, faceUp: false });
    }
    for (let i = 0; i < numCilantro; i++) {
      hand.push({ type: CardType.CILANTRO, faceUp: false });
    }
    return hand;
  }
}