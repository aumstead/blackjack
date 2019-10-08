const cardController = (function () {
  const Card = function (suit, value, points) {
    this.suit = suit;
    this.value = value;
    this.points = points;
  };

  const clubs_1 = new Card('clubs', 'ace', 11);
  const clubs_2 = new Card('clubs', '2', 2);
  const clubs_3 = new Card('clubs', '3', 3);
  const clubs_4 = new Card('clubs', '4', 4);
  const clubs_5 = new Card('clubs', '5', 5);
  const clubs_6 = new Card('clubs', '6', 6);
  const clubs_7 = new Card('clubs', '7', 7);
  const clubs_8 = new Card('clubs', '8', 8);
  const clubs_9 = new Card('clubs', '9', 9);
  const clubs_10 = new Card('clubs', '10', 10);
  const clubs_11 = new Card('clubs', 'jack', 10);
  const clubs_12 = new Card('clubs', 'queen', 10);
  const clubs_13 = new Card('clubs', 'king', 10);

  const diamonds_1 = new Card('diamonds', 'ace', 11);
  const diamonds_2 = new Card('diamonds', '2', 2);
  const diamonds_3 = new Card('diamonds', '3', 3);
  const diamonds_4 = new Card('diamonds', '4', 4);
  const diamonds_5 = new Card('diamonds', '5', 5);
  const diamonds_6 = new Card('diamonds', '6', 6);
  const diamonds_7 = new Card('diamonds', '7', 7);
  const diamonds_8 = new Card('diamonds', '8', 8);
  const diamonds_9 = new Card('diamonds', '9', 9);
  const diamonds_10 = new Card('diamonds', '10', 10);
  const diamonds_11 = new Card('diamonds', 'jack', 10);
  const diamonds_12 = new Card('diamonds', 'queen', 10);
  const diamonds_13 = new Card('diamonds', 'king', 10);

  const hearts_1 = new Card('hearts', 'ace', 11);
  const hearts_2 = new Card('hearts', '2', 2);
  const hearts_3 = new Card('hearts', '3', 3);
  const hearts_4 = new Card('hearts', '4', 4);
  const hearts_5 = new Card('hearts', '5', 5);
  const hearts_6 = new Card('hearts', '6', 6);
  const hearts_7 = new Card('hearts', '7', 7);
  const hearts_8 = new Card('hearts', '8', 8);
  const hearts_9 = new Card('hearts', '9', 9);
  const hearts_10 = new Card('hearts', '10', 10);
  const hearts_11 = new Card('hearts', 'jack', 10);
  const hearts_12 = new Card('hearts', 'queen', 10);
  const hearts_13 = new Card('hearts', 'king', 10);

  const spades_1 = new Card('spades', 'ace', 11);
  const spades_2 = new Card('spades', '2', 2);
  const spades_3 = new Card('spades', '3', 3);
  const spades_4 = new Card('spades', '4', 4);
  const spades_5 = new Card('spades', '5', 5);
  const spades_6 = new Card('spades', '6', 6);
  const spades_7 = new Card('spades', '7', 7);
  const spades_8 = new Card('spades', '8', 8);
  const spades_9 = new Card('spades', '9', 9);
  const spades_10 = new Card('spades', '10', 10);
  const spades_11 = new Card('spades', 'jack', 10);
  const spades_12 = new Card('spades', 'queen', 10);
  const spades_13 = new Card('spades', 'king', 10);

  let deck = [clubs_1, clubs_2, clubs_3, clubs_4, clubs_5, clubs_6, clubs_7, clubs_8, clubs_9, clubs_10, clubs_11, clubs_12, clubs_13, diamonds_1, diamonds_2, diamonds_3, diamonds_4, diamonds_5, diamonds_6, diamonds_7, diamonds_8, diamonds_9, diamonds_10, diamonds_11, diamonds_12, diamonds_13, hearts_1, hearts_2, hearts_3, hearts_4, hearts_5, hearts_6, hearts_7, hearts_8, hearts_9, hearts_10, hearts_11, hearts_12, hearts_13, spades_1, spades_2, spades_3, spades_4, spades_5, spades_6, spades_7, spades_8, spades_9, spades_10, spades_11, spades_12, spades_13];

  let cardData = {
    dealer: {
      hand: [],
    },
    user: {
      hand: [],
      turn: 3,
      splitHand1: [],
      splitHand2: []
    },
    splitState: false,
  };

  let handCount = 1;

  // deal a card function. Parameter is the player — dealer or user. Called in the public function.
  const dealCard = (obj) => {
    // splice a card from deck and push it to player hand array
    let cardArr = deck.splice(Math.floor(Math.random() * deck.length), 1)
    obj.hand.push(cardArr[0]);
    return cardArr[0];
  };

  // function for hit button. Parameter is user turn from data object. Called in the public function.
  const hit = obj => {
    let card;
    if (obj === 3) {
      card = dealCard(cardData.user);
      return card;
    } else if (obj === 4) {
      card = dealCard(cardData.user);
      return card;
    } else if (obj === 5) {
      card = dealCard(cardData.user);
      return card;
    }
  };

  return {
    dealDealer: () => dealCard(cardData.dealer),

    dealUser: () => dealCard(cardData.user),

    dealSplit: (obj, hand) => {
      // splice a card from deck and push it to split hand array
      let cardArr = deck.splice(Math.floor(Math.random() * deck.length), 1)
      if (hand === '1') {
        obj.splitHand1.push(cardArr[0]);
      } else if (hand === '2') {
        obj.splitHand2.push(cardArr[0]);
      }
      return cardArr[0];
    },

    hitUser: () => hit(cardData.user.turn),

    incrementUserTurn: () => {
      cardData.user.turn++;
    },

    incrementHandCount: () => {
      handCount++;
    },

    nextHand: () => {
      // reset deck
      deck = [clubs_1, clubs_2, clubs_3, clubs_4, clubs_5, clubs_6, clubs_7, clubs_8, clubs_9, clubs_10, clubs_11, clubs_12, clubs_13, diamonds_1, diamonds_2, diamonds_3, diamonds_4, diamonds_5, diamonds_6, diamonds_7, diamonds_8, diamonds_9, diamonds_10, diamonds_11, diamonds_12, diamonds_13, hearts_1, hearts_2, hearts_3, hearts_4, hearts_5, hearts_6, hearts_7, hearts_8, hearts_9, hearts_10, hearts_11, hearts_12, hearts_13, spades_1, spades_2, spades_3, spades_4, spades_5, spades_6, spades_7, spades_8, spades_9, spades_10, spades_11, spades_12, spades_13];

      // reset card data
      cardData = {
        dealer: {
          hand: [],
        },
        user: {
          hand: [],
          turn: 3,
          splitHand1: [],
          splitHand2: []
        },
        splitState: false
      };
    },

    getCardData: () => cardData,

    getDeck: () => deck,

    getHandCount: () => handCount,

    // METHODS USED FOR TESTING
    testDealUser1: () => {
      let card = clubs_5;
      cardData.user.hand.push(card);
      return card;
    },
    testDealDealer1: () => {
      let card = spades_10;
      cardData.dealer.hand.push(card);
      return card;
    },
    testDealUser2: () => {
      let card = diamonds_5;
      cardData.user.hand.push(card);
      return card;
    },
    testDealDealer2: () => {
      let card = hearts_1;
      cardData.dealer.hand.push(card);
      return card;
    },

    dealTest: (obj) => {
      let card = hearts_1;
      obj.push(card);
      return card;
    }

    
  }
})();