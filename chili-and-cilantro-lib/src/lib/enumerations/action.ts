export enum Action {
  PLACE_CARD = 'PLACE_CARD',      // Players place a card face down
  START_BIDDING = 'START_BIDDING', // A player decides to start bidding instead of placing a card
  MAKE_BID = 'MAKE_BID',          // Players state how many cards they think they can flip without revealing a 'Chili'
  PASS = 'PASS',                 // Players decide not to increase the bid and don't want to flip cards
  FLIP_CARD = 'FLIP_CARD',        // The player who won the bid flips a card
  END_ROUND = 'END_ROUND',        // The round ends after the flip phase concludes, either by successful bid fulfillment or by revealing a 'Chili'
  START_NEW_ROUND = 'START_NEW_ROUND', // Players initiate a new round after the previous round concludes
  MESSAGE = 'MESSAGE',           // Optional: If players can chat or there are game announcements
  QUIT_GAME = 'QUIT_GAME',        // A player decides to leave the game
}
