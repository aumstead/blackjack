// APP CONTROLLER
const app = (function (UICtrl, cardCtrl, betCtrl, scoreCtrl) {
  // get UI selectors
  const UISelectors = UICtrl.getUISelectors();

  const loadEventListeners = () => {
    // bet button event listeners
    document.getElementById(UISelectors.betBtn1).addEventListener('click', betControlCenter);
    document.getElementById(UISelectors.betBtn5).addEventListener('click', betControlCenter);
    document.getElementById(UISelectors.betBtn20).addEventListener('click', betControlCenter);

    // deal button event listener
    document.getElementById(UISelectors.dealBtn).addEventListener('click', dealControlCenter);

    // hit and stand button event listeners
    document.getElementById(UISelectors.hitBtn).addEventListener('click', hitControlCenter);
    document.getElementById(UISelectors.standBtn).addEventListener('click', standControlCenter);

    // new hand button event listener
    document.getElementById(UISelectors.nextHandBtn).addEventListener('click', nextHand);

    // insurance button event listeners
    document.getElementById(UISelectors.insuranceYesBtn).addEventListener('click', insuranceYes);
    document.getElementById(UISelectors.insuranceNoBtn).addEventListener('click', insuranceNo);
    document.getElementById(UISelectors.insuranceSubmitBtn).addEventListener('click', insuranceSubmit);

    // split button event listener
    document.getElementById(UISelectors.splitBtn).addEventListener('click', splitEventControlCenter);

    // double button event listener
    document.getElementById(UISelectors.doubleBtn).addEventListener('click', doubleControlCenter);
  };

  // FUNCTIONS FOR CONVENIENCE
  const calcScore = (playerObj, property) => {
    const score = scoreCtrl.getScore();
    scoreCtrl.calculateScore(playerObj, score, property);
  };

  const dealerBusts = () => {
    console.log('dealer busts');
    betCtrl.userWinsBet();
    displayBankroll();
    UICtrl.prepareNextHand();
  };

  const checkWinner = () => {
    const score = scoreCtrl.getScore();

    if (score.user > score.dealer) {
      console.log('player wins');
      betCtrl.userWinsBet();
    } else if (score.user === 21) {
      console.log('push. bet is returned.')
      betCtrl.push();
    } else {
      console.log('house wins');
      betCtrl.dealerWinsBet();
    };
    // display bankroll every function call
    displayBankroll();
  };

  const displayBankroll = () => {
    const bankroll = betCtrl.getBankroll();
    UICtrl.displayBankroll(bankroll);
  };

  const displayScore = (player) => {
    const score = scoreCtrl.getScore();
    player === 'user' ? UICtrl.displayUserScore(score.user) : UICtrl.displayDealerScore(score.dealer);
  };

  const nextHand = () => {
    // call each controller's next hand function
    cardCtrl.nextHand();
    scoreCtrl.nextHand();
    betCtrl.nextHand();
    UICtrl.nextHand();

    // get and display bet
    const bet = betController.getBet();
    UICtrl.displayBet(bet);

    // create a blank line in console
    console.log('');
  };

  // SPLIT FUNCTIONS
  const splitEventControlCenter = () => {
    const cardData = cardCtrl.getCardData();
    // 1. set split state to true
    cardData.splitState = true;

    // 2. hide the split button and the user hand
    UICtrl.hideElement(UISelectors.splitBtn);
    UICtrl.hideElement(UISelectors.userCard1);
    UICtrl.hideElement(UISelectors.userCard2);

    // 3. push the split cards into their respective split arrays
    cardData.user.splitHand1.push(cardData.user.hand[0]);
    cardData.user.splitHand2.push(cardData.user.hand[1]);

    // 4. assign and show the split hands for UI
    UICtrl.displayCard(cardData.user.hand[0], UISelectors.userSplit1);
    UICtrl.displayCard(cardData.user.hand[1], UISelectors.userSplit6);

    // 5. put bet value into split bet elements and display in UI. Hide bet in UI.
    const bet = betCtrl.getBet();
    UICtrl.displaySplitBets(bet);
    UICtrl.hideElement(UISelectors.bet);

    // 6. hide user score display and stand button. User must hit at least once.
    UICtrl.hideElement(UISelectors.userScore);
    UICtrl.hideElement(UISelectors.standBtn);
  };

  const splitAcesControlCenter = () => {
    const cardData = cardCtrl.getCardData();
    if (cardData.user.turn === 3) {
      cardCtrl.dealSplit(cardData.user, '1');
      calcScore(cardData.user, 'split1');
      UICtrl.displayCard(cardData.user.splitHand1[1], UISelectors.userSplit2);

      // display score for split hand 1. Try new load feature.
      const score = scoreCtrl.getScore();
      UICtrl.loadElement(score.split1, UISelectors.splitScore1, `Hand 1 score: `);
      UICtrl.showElement(UISelectors.splitScore1);

      // increment user turn
      cardData.user.turn++;
    } else if (cardData.user.turn === 4) {
      cardCtrl.dealSplit(cardData.user, '2');
      calcScore(cardData.user, 'split2');
      UICtrl.displayCard(cardData.user.splitHand2[1], UISelectors.userSplit7);

      // display score for split hand 2. Try new load feature.
      const score = scoreCtrl.getScore();
      UICtrl.loadElement(score.split2, UISelectors.splitScore2, `Hand 2 score: `);
      UICtrl.showElement(UISelectors.splitScore2);

      // users turn is over. Run dealer code.
      dealerFinishes();
    }
  };

  const splitHandControlCenter = () => {
    const cardData = cardCtrl.getCardData();
    let scoreSplit1;

    switch (cardData.user.turn) {
      case (3):
        // 1. deal card. Parameters are user object and hand number.
        cardCtrl.dealSplit(cardData.user, '1');

        // 2. calculate score of the hand. Parameters are user object and score object property.
        calcScore(cardData.user, 'split1');

        // 3. display card
        UICtrl.displayCard(cardData.user.splitHand1[1], UISelectors.userSplit2);

        // 4. get score for split1, load it into element, and display element.
        scoreSplit1 = scoreCtrl.getScoreSplit1();
        UICtrl.loadElement(scoreSplit1, UISelectors.splitScore1, `Hand 1 score: `);
        UICtrl.showElement(UISelectors.splitScore1, 'block');

        // 5. increment user turn before calling splitCheckHand1 because the function changes user turn to 7 if bust or score = 21.
        cardData.user.turn++;

        // 6. call splitCheckHand1. This checks for and handles split hand 1 bust.
        splitCheckHand1();

        // 7. break out of switch.
        break;
      case (4):
        cardCtrl.dealSplit(cardData.user, '1');
        calcScore(cardData.user, 'split1');
        UICtrl.displayCard(cardData.user.splitHand1[2], UISelectors.userSplit3);

        // 4. get score, load, and display
        scoreSplit1 = scoreCtrl.getScoreSplit1();
        UICtrl.loadElement(scoreSplit1, UISelectors.splitScore1, `Hand 1 score: `);
        UICtrl.showElement(UISelectors.splitScore1, 'block');

        cardData.user.turn++;
        splitCheckHand1();
        break;
      case (5):
        cardCtrl.dealSplit(cardData.user, '1');
        calcScore(cardData.user, 'split1');
        UICtrl.displayCard(cardData.user.splitHand1[3], UISelectors.userSplit4);

        // 4. get score, load, and display
        scoreSplit1 = scoreCtrl.getScoreSplit1();
        UICtrl.loadElement(scoreSplit1, UISelectors.splitScore1, `Hand 1 score: `);
        UICtrl.showElement(UISelectors.splitScore1, 'block');

        cardData.user.turn++;
        splitCheckHand1();
        break;
      case (6):
        cardCtrl.dealSplit(cardData.user, '1');
        calcScore(cardData.user, 'split1');
        UICtrl.displayCard(cardData.user.splitHand1[4], UISelectors.userSplit5);

        // 4. get score, load, and display
        scoreSplit1 = scoreCtrl.getScoreSplit1();
        UICtrl.loadElement(scoreSplit1, UISelectors.splitScore1, `Hand 1 score: `);
        UICtrl.showElement(UISelectors.splitScore1, 'block');

        cardData.user.turn++;
        splitCheckHand1();
        // hide the stand button for case 7. Player must hit at least once.
        UICtrl.hideElement(UISelectors.standBtn);
        break;
      case (7):
        cardCtrl.dealSplit(cardData.user, '2');
        calcScore(cardData.user, 'split2');
        UICtrl.displayCard(cardData.user.splitHand2[1], UISelectors.userSplit7);

        // 4. get score, load, and display
        scoreSplit2 = scoreCtrl.getScoreSplit2();
        UICtrl.loadElement(scoreSplit2, UISelectors.splitScore2, `Hand 2 score: `);
        UICtrl.showElement(UISelectors.splitScore2, 'block');

        cardData.user.turn++;
        splitCheckHand2();
        // show the stand button because it's an option for the user.
        UICtrl.showElement(UISelectors.standBtn);
        break;
      case (8):
        cardCtrl.dealSplit(cardData.user, '2');
        calcScore(cardData.user, 'split2');
        UICtrl.displayCard(cardData.user.splitHand2[2], UISelectors.userSplit8);

        // 4. get score, load, and display
        scoreSplit2 = scoreCtrl.getScoreSplit2();
        UICtrl.loadElement(scoreSplit2, UISelectors.splitScore2, `Hand 2 score: `);
        UICtrl.showElement(UISelectors.splitScore2, 'block');

        cardData.user.turn++;
        splitCheckHand2();
        break;
      case (9):
        cardCtrl.dealSplit(cardData.user, '2');
        calcScore(cardData.user, 'split2');
        UICtrl.displayCard(cardData.user.splitHand2[3], UISelectors.userSplit9);

        // 4. get score, load, and display
        scoreSplit2 = scoreCtrl.getScoreSplit2();
        UICtrl.loadElement(scoreSplit2, UISelectors.splitScore2, `Hand 2 score: `);
        UICtrl.showElement(UISelectors.splitScore2, 'block');

        cardData.user.turn++;
        splitCheckHand2();
        break;
      case (10):
        cardCtrl.dealSplit(cardData.user, '2');
        calcScore(cardData.user, 'split2');
        UICtrl.displayCard(cardData.user.splitHand2[4], UISelectors.userSplit10);

        // 4. get score, load, and display
        scoreSplit2 = scoreCtrl.getScoreSplit2();
        UICtrl.loadElement(scoreSplit2, UISelectors.splitScore2, `Hand 2 score: `);
        UICtrl.showElement(UISelectors.splitScore2, 'block');

        cardData.user.turn++;
        splitCheckHand2();
        // hit all the way through without busting or getting 21. Run dealer code.
        dealerFinishes();
        break;
      default: console.log('There was an error in switch statement.')
    }
  };

  const splitCheckHand1 = () => {
    const scoreSplit1 = scoreCtrl.getScoreSplit1();
    // get user object for access to user.turn property
    const cardData = cardCtrl.getCardData();

    if (scoreSplit1 > 21) {
      console.log('Split hand 1 busted.');

      // 1. change the user turn to 7. Split hand 1 is over. Start split hand 2.
      cardData.user.turn = 7;

      // 2. hide the stand button for turn 7. User must hit at least once.
      UICtrl.hideElement(UISelectors.standBtn);

    } else if (scoreSplit1 === 21) {
      console.log('Split hand 1 has 21.');
      cardData.user.turn = 7;
      UICtrl.hideElement(UISelectors.standBtn);
    } else {
      // 3. show the stand button because it was hidden for initial hit, but now user can stand.
      UICtrl.showElement(UISelectors.standBtn);
    }
  };

  const splitCheckHand2 = () => {
    const scoreSplit1 = scoreCtrl.getScoreSplit1();
    const scoreSplit2 = scoreCtrl.getScoreSplit2();

    if (scoreSplit2 > 21) {
      console.log('Split hand 2 busted.');
      if (scoreSplit1 > 21) {
        // handle bets here because dealer code doesn't need to run. Both split hands busted. 
        betCtrl.userLosesSplitHand('1');
        betCtrl.userLosesSplitHand('2');
        displayBankroll();
        UICtrl.prepareNextHand();
      } else {
        // split hand 1 did not bust, so dealer plays hand.
        dealerFinishes();
      }
    } else if (scoreSplit2 === 21) {
      console.log('Split hand 2 has 21.');
      dealerFinishes();
    }
  };

  const splitCheckWinner = () => {
    const score = scoreCtrl.getScore();

    if (score.split1 > 21) {
      console.log('Split hand 1 busted.');
      betCtrl.userLosesSplitHand('1');
    } else if (score.dealer >= score.split1 && score.split1 < 21) {
      console.log('Dealer beats split hand 1.');
      betCtrl.userLosesSplitHand('1');
    } else if (score.dealer === 21 && score.split1 === 21) {
      console.log('Split hand 1 is a push.')
      const bankroll = betCtrl.getBankroll();
      console.log(`Bet is returned. Bankroll = ${bankroll}`);
    } else {
      // split hand 1 beats the dealer
      console.log('Split hand 1 beats the dealer.');
      betCtrl.userWinsSplitHand('1')
    }

    if (score.split2 > 21) {
      console.log('Split hand 2 busted.');
      betCtrl.userLosesSplitHand('2');
    } else if (score.dealer >= score.split2 && score.split2 < 21) {
      console.log('Dealer beats split hand 2.');
      betCtrl.userLosesSplitHand('2');
    } else if (score.dealer === 21 && score.split2 === 21) {
      console.log('Split hand 2 is a push.')
      const bankroll = betCtrl.getBankroll();
      console.log(`Bet is returned. Bankroll = ${bankroll}`);
    } else {
      // split hand 2 beats the dealer
      console.log('Split hand 2 beats the dealer.');
      betCtrl.userWinsSplitHand('2')
    }

    // display bankroll every call
    displayBankroll();
  };

  const splitDealerBusts = () => {
    const score = scoreCtrl.getScore();

    // check if split hand 1 busted
    if (score.split1 <= 21) {
      betCtrl.userWinsSplitHand('1');
    } else if (score.split1 > 21) {
      betCtrl.userLosesSplitHand('1');
    }

    // do the same for split hand 2
    if (score.split2 <= 21) {
      betCtrl.userWinsSplitHand('2');
    } else if (score.split2 > 21) {
      betCtrl.userLosesSplitHand('2');
    }

    // display bankroll every call
    displayBankroll();

    // prepare for the next hand
    UICtrl.prepareNextHand();
  };

  // INSURANCE FUNCTIONS
  const insuranceYes = () => {
    UICtrl.showElement(UISelectors.insuranceForm);
    UICtrl.hideElement(UISelectors.insuranceWarning);
  };

  const insuranceSubmit = (e) => {
    e.preventDefault();
    const insuranceBet = parseInt(UICtrl.getInsuranceInput());
    const score = scoreCtrl.getScore();
    const cardData = cardController.getCardData();

    UICtrl.displayInsuranceBet(insuranceBet);
    UICtrl.hideElement(UISelectors.insuranceForm);

    console.log('dealer checking hole card...');
    if (score.dealer === 21) {
      console.log('dealer has a natural. User wins insurance bet.');
      UICtrl.displayCard(cardData.dealer.hand[0], UISelectors.dealerCard1);
      betCtrl.userWinsInsuranceBet(insuranceBet);
      betCtrl.dealerWinsBet();
      displayBankroll();
      UICtrl.prepareNextHand();
    } else {
      console.log('dealer does not have a natural. User loses insurance bet.')
      betCtrl.userLosesInsuranceBet(insuranceBet);
      displayBankroll();
    }

    UICtrl.hideElement(UISelectors.insuranceBet);
  };

  const insuranceNo = () => {
    const score = scoreCtrl.getScore();
    const cardData = cardCtrl.getCardData();

    UICtrl.hideElement(UISelectors.insuranceWarning);
    console.log('checking dealer\'s hole card...');
    if (score.dealer === 21) {
      console.log('dealer has a natural');
      UICtrl.displayCard(cardData.dealer.hand[0], UISelectors.dealerCard1);
      betCtrl.dealerWinsBet();
      displayBankroll();
      UICtrl.prepareNextHand();
    } else {
      console.log('dealer does not have a natural');
    }
  };

  // DEALER FUNCTIONS
  const dealerTurn3 = () => {
    const score = scoreCtrl.getScore();
    const cardData = cardCtrl.getCardData();
    // create promise. Will always resolve. Resolve is called if dealer's score is less than 17.
    return new Promise((resolve, reject) => {
      const dealerCard3 = cardCtrl.dealDealer();
      setTimeout(() => {
        UICtrl.displayCard(dealerCard3, UISelectors.dealerCard3);
        calcScore(cardData.dealer, 'dealer');
        displayScore('dealer');

        if (score.dealer < 17) {
          resolve();
        } else if (score.dealer > 21) {
          console.log('Dealer busts.');
          if (cardData.splitState) {
            splitDealerBusts();
          } else {
            dealerBusts();
          }
        } else {
          if (cardData.splitState) {
            splitCheckWinner();
            UICtrl.prepareNextHand();
          } else {
            checkWinner();
            UICtrl.prepareNextHand();
          }
        }
      }, 1000);
    });
  };

  const dealerTurn4 = () => {
    const score = scoreCtrl.getScore();
    const cardData = cardCtrl.getCardData();
    // create promise. Will always resolve. Resolve is called if dealer's score is less than 17.
    return new Promise((resolve, reject) => {
      const dealerCard4 = cardCtrl.dealDealer();
      setTimeout(() => {
        UICtrl.displayCard(dealerCard4, UISelectors.dealerCard4);
        calcScore(cardData.dealer, 'dealer');
        displayScore('dealer');

        if (score.dealer < 17) {
          resolve();
        } else if (score.dealer > 21) {
          console.log('Dealer busts.');
          if (cardData.splitState) {
            splitDealerBusts();
          } else {
            dealerBusts();
          }
        } else {
          if (cardData.splitState) {
            splitCheckWinner();
            UICtrl.prepareNextHand();
          } else {
            checkWinner();
            UICtrl.prepareNextHand();
          }
        }
      }, 1000);
    });
  };

  const dealerTurn5 = () => {
    const score = scoreCtrl.getScore();
    const cardData = cardCtrl.getCardData();

    const dealerCard5 = cardCtrl.dealDealer();
    setTimeout(() => {
      UICtrl.displayCard(dealerCard5, UISelectors.dealerCard5);
      calcScore(cardData.dealer, 'dealer');
      displayScore('dealer');

      if (score.dealer > 21) {
        console.log('Dealer busts.');
        if (cardData.splitState) {
          splitDealerBusts();
        } else {
          dealerBusts();
        }
      } else {
        if (cardData.splitState) {
          splitCheckWinner();
          UICtrl.prepareNextHand();
        } else {
          checkWinner();
          UICtrl.prepareNextHand();
        }
      }
    }, 1000);
  };

  const dealerFinishes = () => {
    const cardData = cardCtrl.getCardData();
    const score = scoreCtrl.getScore();

    // 1. show dealer's first card in UI.
    UICtrl.displayCard(cardData.dealer.hand[0], UISelectors.dealerCard1);

    // 2. calculate dealer score
    calcScore(cardData.dealer, 'dealer');

    // 3. show dealer's score
    displayScore('dealer');

    // 4. dealer hits until 17. Enter promise chain.
    if (score.dealer < 17) {
      dealerTurn3()
        .then(dealerTurn4)
        .then(dealerTurn5);
    } else {
      if (cardData.splitState) {
        splitCheckWinner();
        UICtrl.prepareNextHand();
      } else {
        checkWinner();
        UICtrl.prepareNextHand();
      }
    }
  };

  // CONTROL CENTER FUNCTIONS
  const doubleControlCenter = () => {
    let bet = betCtrl.getBet();

    // get and set double state.
    const betData = betCtrl.getBetData();
    betData.doubleState = true;
    
    // double bet with setter
    bet += bet;
    betCtrl.setBet(bet);
    

    // load bet and show element
    UICtrl.loadElement(bet, UISelectors.bet, `Bet is doubled to: `);
    UICtrl.showElement(UISelectors.bet);

    // hide stand and double buttons
    UICtrl.hideElement(UISelectors.standBtn);
    UICtrl.hideElement(UISelectors.doubleBtn);
  };

  const betControlCenter = e => {
    // 1. reveal deal button
    UICtrl.showElement(UISelectors.dealBtn);

    // 2. increase bet by 1, 5, or 20
    if (e.target.id === 'bet-1') {
      betCtrl.bet1();
    } else if (e.target.id === 'bet-5') {
      betCtrl.bet5();
    } else if (e.target.id === 'bet-20') {
      betCtrl.bet20();
    }

    // 3. get and display bet
    const bet = betController.getBet();
    UICtrl.displayBet(bet);
  };

  const hitControlCenter = () => {
    const cardData = cardCtrl.getCardData();

    // check for double state
    const betData = betCtrl.getBetData(); 
    
    if (betData.doubleState) {
      const card = cardCtrl.dealUser();
      UICtrl.displayCard(card, UISelectors.userCard3);
      calcScore(cardData.user, 'user');
      displayScore('user');
      // user can only hit once in double state.
      dealerFinishes();
    } 
      // check for split state and a split aces situation.
      else if (cardData.splitState && cardData.user.splitHand1[0].value === 'ace' && cardData.user.splitHand2[0].value === 'ace') {
      splitAcesControlCenter();
    } else if (cardData.splitState) {
      splitHandControlCenter();
    } else {
      const score = scoreCtrl.getScore();
      const cardData = cardCtrl.getCardData();

      // 1. hide irrelevant buttons
      UICtrl.hideElement(UISelectors.doubleBtn);
      UICtrl.hideElement(UISelectors.splitBtn);

      // 2. deal user a card and store card object into variable so it can be passed to UI controller.
      const card = cardCtrl.hitUser();

      // 3. display card in UI
      if (cardData.user.turn === 3) {
        UICtrl.displayCard(card, UISelectors.userCard3)
      } else if (cardData.user.turn === 4) {
        UICtrl.displayCard(card, UISelectors.userCard4)
      } else if (cardData.user.turn === 5) {
        UICtrl.displayCard(card, UISelectors.userCard5)
      }

      // 4. calculate score
      calcScore(cardData.user, 'user');

      // 5. display user score
      displayScore('user');

      // 6. code for user bust and user 21. If user hits and gets 21, they shouldn't have to click stand button.
      if (score.user > 21) {
        console.log('user busted');
        betCtrl.dealerWinsBet();
        displayBankroll();
        UICtrl.prepareNextHand();
      } else if (score.user === 21) {
        standControlCenter();
      }

      // 7. increment user turn
      cardCtrl.incrementUserTurn();
    };
  };

  const standControlCenter = () => {
    const cardData = cardCtrl.getCardData();

    // 1. hide irrelevant buttons
    UICtrl.hideElement(UISelectors.doubleBtn);
    UICtrl.hideElement(UISelectors.splitBtn);

    // 2. check for split state
    if (cardData.splitState) {
      if (cardData.user.turn < 7) {
        // 2a. if user turn is less than 7, change to 7 in order to move on to split hand 2.
        cardData.user.turn = 7;
        // 2b. hide stand button. User must hit once.
        UICtrl.hideElement(UISelectors.standBtn);
      } else {
        dealerFinishes();
      }
    } else {
      // 3. if not split state, dealer plays hand
      dealerFinishes();
    }

  }

  const dealControlCenter = () => {
    let userCard1, userCard2, dealerCard1, dealerCard2;
    const cardData = cardCtrl.getCardData();
    const score = scoreCtrl.getScore();
    const bankroll = betCtrl.getBankroll();
    const bet = betCtrl.getBet();

    // 1. hide place bet text and bet buttons
    UICtrl.hideElement(UISelectors.placeBet);
    UICtrl.hideElement(UISelectors.betBtn1);
    UICtrl.hideElement(UISelectors.betBtn5);
    UICtrl.hideElement(UISelectors.betBtn20);

    // 2. deal 4 cards starting with user. Store returned card object into variable.
    userCard1 = cardCtrl.dealUser();
    dealerCard1 = cardCtrl.dealDealer();
    userCard2 = cardCtrl.dealUser();
    dealerCard2 = cardCtrl.dealDealer();

    //
    // FUNCTIONS FOR TESTING
    //
    // userCard1 = cardCtrl.testDealUser1();
    // dealerCard1 = cardCtrl.testDealDealer1();
    // userCard2 = cardCtrl.testDealUser2();
    // dealerCard2 = cardCtrl.testDealDealer2();

    // 3. display cards with dealer's first card hardcoded to be face down.
    UICtrl.displayCard(userCard1, UISelectors.userCard1);
    document.getElementById(UISelectors.dealerCard1).src = './images/playing-card-back-1.png';
    document.getElementById(UISelectors.dealerCard1).style.display = 'inline-block';
    UICtrl.displayCard(userCard2, UISelectors.userCard2);
    UICtrl.displayCard(dealerCard2, UISelectors.dealerCard2);

    // 4. hide the deal button, show hit, show stand
    UICtrl.hideElement(UISelectors.dealBtn);
    UICtrl.showElement(UISelectors.hitBtn);
    UICtrl.showElement(UISelectors.standBtn);

    // 5. calculate user and dealer score.
    calcScore(cardData.user, 'user');
    calcScore(cardData.dealer, 'dealer');

    // 6. display user score
    displayScore('user');

    // 7. handle blackjacks and insurance logic
    if (score.user === 21 && score.dealer === 21) {
      console.log('blackjack');
      setTimeout(() => {
        // show dealer's first card in UI.
        UICtrl.displayCard(cardData.dealer.hand[0], UISelectors.dealerCard1);
        console.log('dealer and user both have naturals. bet is returned to player');
        betCtrl.push();
        UICtrl.prepareNextHand();
      }, 2000);
    } else if (score.user === 21) {
      console.log('blackjack');
      setTimeout(() => {
        // show dealer's first card in UI.
        UICtrl.displayCard(cardData.dealer.hand[0], UISelectors.dealerCard1);
        console.log('user has a natural. user wins 1.5x bet');
        betCtrl.blackjack();
        displayBankroll();
        UICtrl.prepareNextHand();
      }, 2000);
    } else if (cardData.dealer.hand[1].value === 'ace') {
      // dealer is showing an ace. User does not have blackjack.
      UICtrl.showElement(UISelectors.insuranceWarning);
    }

    // 8. user can split if cards are same point value, and they have enough money in bankroll.
    if (cardData.user.hand[0].points === cardData.user.hand[1].points && bankroll - bet * 2 >= 0) {
      UICtrl.showElement(UISelectors.splitBtn);
    }

    // 9. user can double if they have enough money.
    if (score.user === 9 || score.user === 10 || score.user === 11 && bankroll - bet * 2 >= 0) {
      UICtrl.showElement(UISelectors.doubleBtn);
    }
  }

  return {
    init: function () {
      console.log('Application started');

      // sets the UI for a new hand. Hides all the elements.
      UICtrl.nextHand();

      loadEventListeners();
      displayBankroll();
    }
  }
})(UIController, cardController, betController, scoreController);

app.init();