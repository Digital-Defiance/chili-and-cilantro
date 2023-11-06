export enum Action {
  CREATE_GAME = 'CREATE_GAME',     // A chef creates a new game
  START_GAME = 'START_GAME',       // A chef starts a game
  JOIN_GAME = 'JOIN_GAME',         // A chef joins a game
  END_GAME = 'END_GAME',           // A chef ends a game
  EXPIRE_GAME = 'EXPIRE_GAME',   // A game ends because it has been inactive for too long
  PLACE_CARD = 'PLACE_CARD',      // Chefs place a card face down
  START_BIDDING = 'START_BIDDING', // A chef decides to start bidding instead of placing a card
  MAKE_BID = 'MAKE_BID',          // Chefs state how many cards they think they can flip without revealing a 'Chili'
  PASS = 'PASS',                 // Chefs decide not to increase the bid and don't want to flip cards
  FLIP_CARD = 'FLIP_CARD',        // The chef who won the bid flips a card
  END_ROUND = 'END_ROUND',        // The round ends after the flip phase concludes, either by successful bid fulfillment or by revealing a 'Chili'
  START_NEW_ROUND = 'START_NEW_ROUND', // Chefs initiate a new round after the previous round concludes
  MESSAGE = 'MESSAGE',           // Optional: If chefs can chat or there are game announcements
  QUIT_GAME = 'QUIT_GAME',        // A chef decides to leave the game
}
