const scoreController = (function () {
  let score = {
    user: 0,
    dealer: 0,
    split1: 0,
    split2: 0
  };

  return {
    // this method just calculates score. Doesn't determine bust or blackjack. Handles ace values.
    calculateScore: (playerObj, scoreObj, player) => {
      if (player === 'user') {
        scoreObj.user = 0;
        playerObj.hand.forEach(card => {
          scoreObj.user += card.points;
        });

        // code to handle ace values
        playerObj.hand.forEach(card => {
          if (card.points === 11 && scoreObj.user > 21) {
            scoreObj.user -= 10;
          }
        });
      } else if (player === 'dealer') {
        scoreObj.dealer = 0;
        playerObj.hand.forEach(card => {
          scoreObj.dealer += card.points;
        });
        // code to handle ace values
        playerObj.hand.forEach(card => {
          if (card.points === 11 && scoreObj.dealer > 21) {
            scoreObj.dealer -= 10;
          }
        });
      } else if (player === 'split1') {
        scoreObj.split1 = 0;
        playerObj.splitHand1.forEach(card => {
          scoreObj.split1 += card.points;
        });
        // code to handle ace values
        playerObj.splitHand1.forEach(card => {
          if (card.points === 11 && scoreObj.split1 > 21) {
            scoreObj.split1 -= 10;
          }
        });
      } else if (player === 'split2') {
        scoreObj.split2 = 0;
        playerObj.splitHand2.forEach(card => {
          scoreObj.split2 += card.points;
        });
        // code to handle ace values
        playerObj.splitHand2.forEach(card => {
          if (card.points === 11 && scoreObj.split2 > 21) {
            scoreObj.split2 -= 10;
          }
        });
      }
    },

    nextHand: () => {
      score = {
        user: 0,
        dealer: 0
      }
    },

    getScore: () => score,

    // REFACTOR FUNCTION. MAKE IT SO THE DEALER'S SCORE IS PRIVATE.
    getScoreSplit1: () => score.split1,

    getScoreSplit2: () => score.split2
  }
})();