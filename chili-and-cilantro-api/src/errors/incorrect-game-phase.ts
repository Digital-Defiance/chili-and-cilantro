import { ValidationError } from './validation-error';

export class IncorrectGamePhaseError extends ValidationError {
  constructor() {
    super('Game is not in the correct phase for this action.', 'gamePhase');
  }
}
