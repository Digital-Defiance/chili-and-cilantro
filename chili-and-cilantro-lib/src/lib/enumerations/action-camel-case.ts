export enum ActionCamelCase {
    CREATE_GAME = 'CreateGame', // A chef creates a new game
    START_GAME = 'StartGame', // A chef starts a game
    JOIN_GAME = 'JoinGame', // A chef joins a game
    END_GAME = 'EndGame', // A chef ends a game
    EXPIRE_GAME = 'ExpireGame', // A game ends because it has been inactive for too long
    PLACE_CARD = 'PlaceCard', // Chefs place a card face down
    START_BIDDING = 'StartBidding', // A chef decides to start bidding instead of placing a card
    MAKE_BID = 'MakeBid', // Chefs state how many cards they think they can flip without revealing a 'Chili'
    PASS = 'Pass', // Chefs decide not to increase the bid and don't want to flip cards
    FLIP_CARD = 'FlipCard', // The chef who won the bid flips a card
    END_ROUND = 'EndRound', // The round ends after the flip phase concludes, either by successful bid fulfillment or by revealing a 'Chili'
    START_NEW_ROUND = 'StartNewRound', // Chefs initiate a new round after the previous round concludes
    MESSAGE = 'Message', // Optional: If chefs can chat or there are game announcements
    QUIT_GAME = 'QuitGame', // A chef decides to leave the game
  }
  
  export default ActionCamelCase;