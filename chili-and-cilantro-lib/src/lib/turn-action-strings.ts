import TurnAction from './enumerations/turn-action';

export const TurnActionStrings: { [key in TurnAction]: string } = {
  [TurnAction.Bid]: 'Made a bid',
  [TurnAction.IncreaseBid]: 'Increased bid',
  [TurnAction.Pass]: 'Passed',
  [TurnAction.PlaceCard]: 'Placed a card',
};
