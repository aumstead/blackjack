// APP CONTROLLER
const app = (function (UICtrl, cardCtrl, betCtrl, scoreCtrl, tutCtrl) {
  // get UI selectors
  const UISelectors = UICtrl.getUISelectors();
  const tutSelectors = tutCtrl.getTutSelectors();

  const loadEventListeners = () => {
    // bet button event listeners
    document.getElementById(UISelectors.betBtn1).addEventListener('click', betControlCenter);
    document.getElementById(UISelectors.betBtn5).addEventListener('click', betControlCenter);
    document.getElementById(UISelectors.betBtn20).addEventListener('click', betControlCenter);

    // deal button event listener
    document.getElementById(UISelectors.dealBtn).addEventListener('click', dealCards);

    // hit and stand button event listeners
    document.getElementById(UISelectors.hitBtn).addEventListener('click', hitControlCenter);
    document.getElementById(UISelectors.standBtn).addEventListener('click', standControlCenter);

    // new hand button event listener
    document.getElementById(UISelectors.nextHandBtn).addEventListener('click', nextHandControlCenter);

    // insurance button event listeners
    document.getElementById(UISelectors.insuranceYesBtn).addEventListener('click', insuranceYes);
    document.getElementById(UISelectors.insuranceNoBtn).addEventListener('click', insuranceNo);
    document.getElementById(UISelectors.insuranceSubmitBtn).addEventListener('click', insuranceSubmit);

    // split button event listener
    document.getElementById(UISelectors.splitBtn).addEventListener('click', splitEventControlCenter);

    // double button event listener
    document.getElementById(UISelectors.doubleBtn).addEventListener('click', doubleControlCenter);

    // reset button event listener
    document.getElementById(UISelectors.resetBetBtn).addEventListener('click', resetBet);

    // log and menu checkbox event listeners
    document.getElementById(UISelectors.logCheckbox).addEventListener('click', logTab);
    document.getElementById(UISelectors.menuCheckbox).addEventListener('click', menuTab);

    // reload chips event listener
    document.getElementById(UISelectors.reloadChips).addEventListener('click', reloadChips);

    // tutorial start event listener
    document.getElementById(UISelectors.tutorialLink).addEventListener('click', tutorialControlCenter);

    document.getElementById(tutSelectors.tutBtn01).addEventListener('click', tutCtrl.showStep02);
  };

  // NAVIGATION AND MENU FUNCTIONS
  const logTab = () => {
    const menuCheckbox = document.getElementById(UISelectors.menuCheckbox);
    menuCheckbox.checked ? menuCheckbox.checked = false: menuCheckbox.checked = false;
  }

  const menuTab = () => {
    const menuCheckbox = document.getElementById(UISelectors.menuCheckbox);
    menuCheckbox.checked ? menuCheckbox.checked = true: menuCheckbox.checked = true;
  }

  const reloadChips = () => {
    betCtrl.reloadChips();
    const bankroll = betCtrl.getBankroll();
    UICtrl.displayBankroll(bankroll);
  }

  // UTILITY FUNCTIONS
  const prepareReanimation = (selector) => {
    const el = document.getElementById(selector);
    const newEl = el.cloneNode(true);
    el.parentNode.replaceChild(newEl, el);
    UICtrl.pauseAnimation(selector);
  }

  const calcScore = (playerObj, property) => {
    const score = scoreCtrl.getScore();
    scoreCtrl.calculateScore(playerObj, score, property);
  };

  const dealerBusts = () => {
    const bet = betCtrl.getBet();
    const bankroll = betCtrl.getBankroll();

    UICtrl.logHand(`Dealer busts.`, `${bankroll} + ${bet} = ${bankroll + bet}.`, 'green');
    betCtrl.userWinsBet();
    displayBankroll();
    UICtrl.prepareNextHand();
  };

  const checkWinner = () => {
    const score = scoreCtrl.getScore();
    const bet = betCtrl.getBet();
    const bankroll = betCtrl.getBankroll();

    if (score.user > score.dealer) {
      UICtrl.logHand(`Player wins: ${score.user}-${score.dealer}.`, `Chip count: ${bankroll} + ${bet} = ${bankroll + bet}.`, 'green');
      betCtrl.userWinsBet();
    } else if (score.user === score.dealer) {
      UICtrl.logHand(`Push: ${score.user}-${score.dealer}. Bet is returned.`, `Chip count: ${bankroll}.`);
      betCtrl.push();
    } else {
      UICtrl.logHand(`House wins: ${score.dealer}-${score.user}.`, `Chip count: ${bankroll} - ${bet} = ${bankroll - bet}.`, 'red');
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

  const resetBet = () => {
    let bet = betCtrl.getBet();
    bet = 0;
    betCtrl.setBet(bet);
    UICtrl.displayBet(bet);

    UICtrl.hideElement(UISelectors.potChipGhost1);
    UICtrl.hideElement(UISelectors.potChipGhost5);
    UICtrl.hideElement(UISelectors.potChipGhost20);

    // disable the reset bet btn, since the bet is back to zero.
    UICtrl.disableBtn(UISelectors.resetBetBtn);

    // also disable the deal btn, since bet is at zero.
    UICtrl.disableBtn(UISelectors.dealBtn);
  };

  // SPLIT FUNCTIONS
  const splitEventControlCenter = () => {
    const cardData = cardCtrl.getCardData();
    // 1. set split state to true
    cardData.splitState = true;

    // 2. hide the option buttons and the user hand
    UICtrl.hideElement(UISelectors.splitBtn);
    UICtrl.hideElement(UISelectors.doubleBtn);
    UICtrl.hideElement(UISelectors.userCard1);
    UICtrl.hideElement(UISelectors.userCard2);

    // 3. push the split cards into their respective split arrays
    cardData.user.splitHand1.push(cardData.user.hand[0]);
    cardData.user.splitHand2.push(cardData.user.hand[1]);

    // 4. assign and show the split hands for UI. Animate them to their set positions.
    UICtrl.animateCard(UISelectors.userSplit1);
    UICtrl.animateCard(UISelectors.userSplit6);
    UICtrl.displayCard(cardData.user.hand[0], UISelectors.userSplit1);
    UICtrl.displayCard(cardData.user.hand[1], UISelectors.userSplit6);

    // 5. put bet value into split bet elements and display in UI. Hide bet in UI.
    const bet = betCtrl.getBet();
    UICtrl.displaySplitBets(bet);
    UICtrl.hideElement(UISelectors.bet);

    // 6. take care of pot graphics
    // hide the main pot.
    UICtrl.hideElement(UISelectors.pot);
    // copy the pot element twice.
    const element = document.getElementById(UISelectors.pot);
    const newElement1 = element.cloneNode(true);
    const newElement2 = element.cloneNode(true);
    // add split-pot classes to new element
    newElement1.classList.add('split-pot--1');
    newElement2.classList.add('split-pot--2');
    // remove pot class
    newElement1.classList.remove('pot');
    newElement2.classList.remove('pot');
    // change the ids of each copy.
    newElement1.id = 'split-pot-1';
    newElement2.id = 'split-pot-2';

    // append to container
    document.querySelector('.container').appendChild(newElement1);
    document.querySelector('.container').appendChild(newElement2);

    // show in UI
    UICtrl.showElement(UISelectors.splitPot1);
    UICtrl.showElement(UISelectors.splitPot2);

    // 6. hide user score card
    UICtrl.hideElement(UISelectors.userScoreCard);

    // show split cards in scoreboard
    UICtrl.showElement(UISelectors.splitCard1);
    UICtrl.showElement(UISelectors.splitCard2);

    // disable stand button. User must hit at least once.
    UICtrl.disableBtn(UISelectors.standBtn);

    // check for split aces and if not, log regular split text and put guidance border around splitBet1.
    if (cardData.user.splitHand1[0].value === 'ace' && cardData.user.splitHand2[0].value === 'ace') {
      UICtrl.logText('Player splits aces. Only one card for each ace is given.');
      UICtrl.disableBtn(UISelectors.hitBtn);
      // pause for gameplay flow
      setTimeout(() => {
        splitAcesFinishes();
      }, 1000);
    } else {
      UICtrl.logText('Player splits.');
      UICtrl.renderGuidanceBorder(UISelectors.splitBet1);
    }
  };

  const splitAcesFinishes = () => {
    const cardData = cardCtrl.getCardData();

    // animations
    UICtrl.showElement(UISelectors.userSplit2);
    UICtrl.animateCard(UISelectors.userSplit2);

    // nested timeouts (3 of them)
    setTimeout(() => {
      cardCtrl.dealSplit(cardData.user, '1');
      calcScore(cardData.user, 'split1');
      UICtrl.displayCard(cardData.user.splitHand1[1], UISelectors.userSplit2);

      // display score for split hand 1. Try new load feature.
      const score = scoreCtrl.getScore();
      UICtrl.loadSplitScore(score.split1, UISelectors.splitScore1);
      UICtrl.showElement(UISelectors.splitScore1);

      setTimeout(() => {
        UICtrl.showElement(UISelectors.userSplit7);
        UICtrl.animateCard(UISelectors.userSplit7);

        setTimeout(() => {
          cardCtrl.dealSplit(cardData.user, '2');
          calcScore(cardData.user, 'split2');
          UICtrl.displayCard(cardData.user.splitHand2[1], UISelectors.userSplit7);

          // display score for split hand 2. Try new load feature.
          const score = scoreCtrl.getScore();
          UICtrl.loadSplitScore(score.split2, UISelectors.splitScore2);
          UICtrl.showElement(UISelectors.splitScore2);

          // users turn is over. Run dealer code.
          dealerFinishes();
        }, 200);
      }, 1000);
    }, 200);
  };  


const splitHandControlCenter = () => {
  const cardData = cardCtrl.getCardData();
  let scoreSplit1;

  switch (cardData.user.turn) {
    case (3):
      UICtrl.showElement(UISelectors.userSplit2);
      UICtrl.animateCard(UISelectors.userSplit2);

      setTimeout(() => {
        // 1. deal card. Parameters are user object and hand number.
        cardCtrl.dealSplit(cardData.user, '1');

        // 2. calculate score of the hand. Parameters are user object and score object property.
        calcScore(cardData.user, 'split1');

        // 3. display card
        UICtrl.displayCard(cardData.user.splitHand1[1], UISelectors.userSplit2);

        // 4. get score for split1, load it into element, and display element.
        scoreSplit1 = scoreCtrl.getScoreSplit1();
        UICtrl.loadSplitScore(scoreSplit1, UISelectors.splitScore1);
        UICtrl.showElement(UISelectors.splitScore1, 'block');

        // 5. increment user turn before calling splitCheckHand1 because the function changes user turn to 7 if bust or score = 21.
        cardData.user.turn++;

        // 6. call splitCheckHand1. This checks for and handles split hand 1 bust.
        splitCheckHand1();
      }, 200);

      // enable stand btn
      UICtrl.enableBtn(UISelectors.standBtn);

      // 7. break out of switch.
      break;
    case (4):
      UICtrl.showElement(UISelectors.userSplit3);
      UICtrl.animateCard(UISelectors.userSplit3);

      setTimeout(() => {
        cardCtrl.dealSplit(cardData.user, '1');
        calcScore(cardData.user, 'split1');
        UICtrl.displayCard(cardData.user.splitHand1[2], UISelectors.userSplit3);

        // 4. get score, load, and display
        scoreSplit1 = scoreCtrl.getScoreSplit1();
        UICtrl.loadSplitScore(scoreSplit1, UISelectors.splitScore1);
        UICtrl.showElement(UISelectors.splitScore1, 'block');

        cardData.user.turn++;
        splitCheckHand1();
      }, 200);

      break;
    case (5):
      UICtrl.showElement(UISelectors.userSplit4);
      UICtrl.animateCard(UISelectors.userSplit4);

      setTimeout(() => {
        cardCtrl.dealSplit(cardData.user, '1');
        calcScore(cardData.user, 'split1');
        UICtrl.displayCard(cardData.user.splitHand1[3], UISelectors.userSplit4);

        // 4. get score, load, and display
        scoreSplit1 = scoreCtrl.getScoreSplit1();
        UICtrl.loadSplitScore(scoreSplit1, UISelectors.splitScore1);
        UICtrl.showElement(UISelectors.splitScore1, 'block');

        cardData.user.turn++;
        splitCheckHand1();
      }, 200);

      break;
    case (6):
      UICtrl.showElement(UISelectors.userSplit5);
      UICtrl.animateCard(UISelectors.userSplit5);

      setTimeout(() => {
        cardCtrl.dealSplit(cardData.user, '1');
        calcScore(cardData.user, 'split1');
        UICtrl.displayCard(cardData.user.splitHand1[4], UISelectors.userSplit5);

        // 4. get score, load, and display
        scoreSplit1 = scoreCtrl.getScoreSplit1();
        UICtrl.loadSplitScore(scoreSplit1, UISelectors.splitScore1);
        UICtrl.showElement(UISelectors.splitScore1, 'block');

        cardData.user.turn++;
        splitCheckHand1();
        // disable the stand button for case 7. Player must hit at least once.
        UICtrl.disableBtn(UISelectors.standBtn);
        // remove guidance border and add to split2
        UICtrl.removeGuidanceBorder(UISelectors.splitBet1);
        UICtrl.renderGuidanceBorder(UISelectors.splitBet2);
      }, 200);

      break;
    case (7):
      UICtrl.showElement(UISelectors.userSplit7);
      UICtrl.animateCard(UISelectors.userSplit7);

      setTimeout(() => {
        cardCtrl.dealSplit(cardData.user, '2');
        calcScore(cardData.user, 'split2');
        UICtrl.displayCard(cardData.user.splitHand2[1], UISelectors.userSplit7);

        // 4. get score, load, and display
        scoreSplit2 = scoreCtrl.getScoreSplit2();
        UICtrl.loadSplitScore(scoreSplit2, UISelectors.splitScore2);
        UICtrl.showElement(UISelectors.splitScore2, 'block');

        cardData.user.turn++;
        splitCheckHand2();
        // enable the stand button because it's an option for the user.
        UICtrl.enableBtn(UISelectors.standBtn);
      }, 200);

      break;
    case (8):
      UICtrl.showElement(UISelectors.userSplit8);
      UICtrl.animateCard(UISelectors.userSplit8);

      setTimeout(() => {
        cardCtrl.dealSplit(cardData.user, '2');
        calcScore(cardData.user, 'split2');
        UICtrl.displayCard(cardData.user.splitHand2[2], UISelectors.userSplit8);

        // 4. get score, load, and display
        scoreSplit2 = scoreCtrl.getScoreSplit2();
        UICtrl.loadSplitScore(scoreSplit2, UISelectors.splitScore2);
        UICtrl.showElement(UISelectors.splitScore2, 'block');

        cardData.user.turn++;
        splitCheckHand2();
      }, 200);

      break;
    case (9):
      UICtrl.showElement(UISelectors.userSplit9);
      UICtrl.animateCard(UISelectors.userSplit9);

      setTimeout(() => {
        cardCtrl.dealSplit(cardData.user, '2');
        calcScore(cardData.user, 'split2');
        UICtrl.displayCard(cardData.user.splitHand2[3], UISelectors.userSplit9);

        // 4. get score, load, and display
        scoreSplit2 = scoreCtrl.getScoreSplit2();
        UICtrl.loadSplitScore(scoreSplit2, UISelectors.splitScore2);
        UICtrl.showElement(UISelectors.splitScore2, 'block');

        cardData.user.turn++;
        splitCheckHand2();
      }, 200);

      break;
    case (10):
      UICtrl.showElement(UISelectors.userSplit10);
      UICtrl.animateCard(UISelectors.userSplit10);

      setTimeout(() => {
        cardCtrl.dealSplit(cardData.user, '2');
        calcScore(cardData.user, 'split2');
        UICtrl.displayCard(cardData.user.splitHand2[4], UISelectors.userSplit10);

        // 4. get score, load, and display
        scoreSplit2 = scoreCtrl.getScoreSplit2();
        UICtrl.loadSplitScore(scoreSplit2, UISelectors.splitScore2);
        UICtrl.showElement(UISelectors.splitScore2, 'block');

        cardData.user.turn++;
        splitCheckHand2();
        // hit all the way through without busting or getting 21. Run dealer code.
        if (scoreSplit2 <= 21) {
          dealerFinishes();
        }
      }, 200);

      break;
    default: console.log('There was an error in switch statement.')
  }
};

const splitCheckHand1 = () => {
  const scoreSplit1 = scoreCtrl.getScoreSplit1();
  // get user object for access to user.turn property
  const cardData = cardCtrl.getCardData();
  const bankroll = betCtrl.getBankroll();
  const bet = betCtrl.getBet();

  if (scoreSplit1 > 21) {
    UICtrl.logHand('Hand one busts.', `Chip count: ${bankroll} - ${bet} = ${bankroll - bet}.`, 'red');
    betCtrl.userLosesSplitHand('1');
    displayBankroll();

    // 1. change the user turn to 7. Split hand 1 is over. Start split hand 2.
    cardData.user.turn = 7;
    // 2. disable the stand button for turn 7. User must hit at least once.
    UICtrl.disableBtn(UISelectors.standBtn);
    // 3. remove guidance border for first split hand. Add it to second.
    UICtrl.removeGuidanceBorder(UISelectors.splitBet1);
    UICtrl.renderGuidanceBorder(UISelectors.splitBet2);
  } else if (scoreSplit1 === 21) {
    UICtrl.logText('Hand one has 21.');
    cardData.user.turn = 7;
    UICtrl.disableBtn(UISelectors.standBtn);
    UICtrl.removeGuidanceBorder(UISelectors.splitBet1);
    UICtrl.renderGuidanceBorder(UISelectors.splitBet2);
  } else {
    // 3. show the stand button because it was hidden for initial hit, but now user can stand.
    UICtrl.showElement(UISelectors.standBtn);
  }
};

const splitCheckHand2 = () => {
  const scoreSplit1 = scoreCtrl.getScoreSplit1();
  const scoreSplit2 = scoreCtrl.getScoreSplit2();
  const bankroll = betCtrl.getBankroll();
  const bet = betCtrl.getBet();

  if (scoreSplit2 > 21) {
    UICtrl.logHand('Hand two busts.', `Chip count: ${bankroll} - ${bet} = ${bankroll - bet}.`, 'red');
    betCtrl.userLosesSplitHand('2');
    displayBankroll();
    UICtrl.disableBtn(UISelectors.standBtn);
    UICtrl.disableBtn(UISelectors.hitBtn);
    UICtrl.removeGuidanceBorder(UISelectors.splitBet2);
    if (scoreSplit1 > 21) {
      // handle prepare next hand here because dealer code doesn't need to run. Both split hands busted.
      UICtrl.prepareNextHand();
    } else {
      // split hand 1 did not bust, so dealer plays hand.
      dealerFinishes();
    }
  } else if (scoreSplit2 === 21) {
    UICtrl.logText('Hand two has 21.');
    UICtrl.removeGuidanceBorder(UISelectors.splitBet2);
    UICtrl.disableBtn(UISelectors.hitBtn);
    dealerFinishes();
  }
};

const splitCheckWinner = () => {
  const score = scoreCtrl.getScore();
  let bankroll = betCtrl.getBankroll();
  const bet = betCtrl.getBet();

  if (score.dealer === score.split1 && score.dealer < 22) {
    UICtrl.logHand(`Hand one is a push: ${score.split1}-${score.dealer}. Bet is returned.`, `Chip count: ${bankroll}.`);
  } else if (score.dealer > score.split1 && score.split1 < 21) {
    UICtrl.logHand(`House wins hand one: ${score.dealer}-${score.split1}.`, `Chip count: ${bankroll} - ${bet} = ${bankroll - bet}.`, 'red');
    betCtrl.userLosesSplitHand('1');
  } else if (score.split1 <= 21) {
    // split hand 1 beats the dealer
    UICtrl.logHand(`User wins hand one: ${score.split1}-${score.dealer}.`, `Chip count: ${bankroll} + ${bet} = ${bankroll + bet}.`, 'green');
    console.log('user winning split hand 1')
    betCtrl.userWinsSplitHand('1');
  }

  // get the new bankroll after hand one calculations
  bankroll = betCtrl.getBankroll();

  if (score.dealer === score.split2 && score.dealer < 22) {
    UICtrl.logHand(`Hand two is a push: ${score.split2}-${score.dealer}. Bet is returned.`, `Chip count: ${bankroll}.`);
  } else if (score.dealer > score.split2 && score.split2 < 21) {
    UICtrl.logHand(`House wins hand two: ${score.dealer}-${score.split2}.`, `Chip count: ${bankroll} - ${bet} = ${bankroll - bet}.`, 'red');
    betCtrl.userLosesSplitHand('2');
  } else if (score.split2 <= 21) {
    // split hand 2 beats the dealer
    UICtrl.logHand(`User wins hand two: ${score.split2}-${score.dealer}.`, `Chip count: ${bankroll} + ${bet} = ${bankroll + bet}.`, 'green');
    betCtrl.userWinsSplitHand('2')
  }

  // display bankroll every call
  displayBankroll();
};

const splitDealerBusts = () => {
  const score = scoreCtrl.getScore();
  let bankroll = betCtrl.getBankroll();
  const bet = betCtrl.getBet();

  console.log('in splitdealerbusts')
  // check if split hand 1 busted
  if (score.split1 <= 21) {
    UICtrl.logHand(`Dealer busts.`, `Chip count: ${bankroll} + ${bet} = ${bankroll + bet}.`, 'green');
    betCtrl.userWinsSplitHand('1');
  }

  // get new bankroll after split hand one calculation
  bankroll = betCtrl.getBankroll();

  // do the same for split hand 2
  if (score.split2 <= 21) {
    UICtrl.logHand(`Dealer busts.`, `Chip count: ${bankroll} + ${bet} = ${bankroll + bet}.`, 'green');
    betCtrl.userWinsSplitHand('2');
  }

  // display bankroll every call
  displayBankroll();

  // prepare for the next hand
  UICtrl.prepareNextHand();
};

// INSURANCE FUNCTIONS
const insuranceYes = () => {
  // on event: show the form, hide insurance, and disable all options until user chooses insurance amount.
  UICtrl.showElement(UISelectors.insuranceForm);
  UICtrl.hideElement(UISelectors.insuranceWarning);
  UICtrl.disableBtn(UISelectors.hitBtn);
  UICtrl.disableBtn(UISelectors.standBtn);
  UICtrl.disableBtn(UISelectors.splitBtn);
  UICtrl.disableBtn(UISelectors.doubleBtn);

  // set form focus
  UICtrl.setFormFocus();
};

const insuranceSubmit = (e) => {
  e.preventDefault();
  const insuranceBet = Math.round(parseFloat(UICtrl.getInsuranceInput()));
  const score = scoreCtrl.getScore();
  const cardData = cardController.getCardData();
  let bankroll = betCtrl.getBankroll();
  const bet = betCtrl.getBet();
  const maxBet = Math.round(bet / 2);

  // verify user input. If more than zero and less than half of original bet, run code. Else, show warning.
  if (insuranceBet > 0 && insuranceBet <= maxBet) {
    // check to see if user has enough chips
    if (bankroll - bet - insuranceBet >= 0) {
      UICtrl.hideElement(UISelectors.insuranceForm);

      UICtrl.logText(`Dealer checking hole card...`);
      setTimeout(() => {
        if (score.dealer === 21) {
          UICtrl.displayCard(cardData.dealer.hand[0], UISelectors.dealerCard1);
          UICtrl.logHand(`Dealer has blackjack.`, `Chip count: ${bankroll} - ${bet} = ${bankroll - bet}.`, 'red');
          betCtrl.dealerWinsBet();
          bankroll = betCtrl.getBankroll();
          UICtrl.logHand(`Player wins insurance bet. Pays 2:1.`, `Chip count: ${bankroll} + ${insuranceBet * 2} = ${bankroll + insuranceBet * 2}.`, 'green');
          betCtrl.userWinsInsuranceBet(insuranceBet);
          displayBankroll();
          UICtrl.prepareNextHand();
        } else {
          UICtrl.logHand(`Dealer does not have blackjack. Player loses insurance bet.`, `Chip count: ${bankroll} - ${insuranceBet} = ${bankroll - insuranceBet}.`, 'red');
          betCtrl.userLosesInsuranceBet(insuranceBet);
          displayBankroll();
  
          // enable all buttons for user
          UICtrl.enableBtn(UISelectors.hitBtn);
          UICtrl.enableBtn(UISelectors.standBtn);
          UICtrl.enableBtn(UISelectors.splitBtn);
          UICtrl.enableBtn(UISelectors.doubleBtn);
        }
      }, 1000);
    } else {
      // show money warning
      UICtrl.showElement(UISelectors.insuranceMoneyWarning);
      setTimeout(() => {
      UICtrl.hideElement(UISelectors.insuranceMoneyWarning);
    }, 5000);
    }
    

  } else {
    UICtrl.showElement(UISelectors.insuranceInputWarning);
    setTimeout(() => {
      UICtrl.hideElement(UISelectors.insuranceInputWarning);
    }, 5000);
  }
};

const insuranceNo = () => {
  const score = scoreCtrl.getScore();
  const cardData = cardCtrl.getCardData();
  const bankroll = betCtrl.getBankroll();
  const bet = betCtrl.getBet();

  UICtrl.hideElement(UISelectors.insuranceWarning);
  UICtrl.logText(`Dealer is checking hole card...`);
  setTimeout(() => {
    if (score.dealer === 21) {
      UICtrl.logHand(`Dealer has blackjack.`, `Chip count: ${bankroll} - ${bet} = ${bankroll - bet}`, 'red');
      UICtrl.displayCard(cardData.dealer.hand[0], UISelectors.dealerCard1);
      betCtrl.dealerWinsBet();
      displayBankroll();
      UICtrl.prepareNextHand();
    } else {
      UICtrl.logText(`Dealer does not have blackjack.`);
      // enable all buttons
      UICtrl.enableBtn(UISelectors.hitBtn);
      UICtrl.enableBtn(UISelectors.splitBtn);
      UICtrl.enableBtn(UISelectors.doubleBtn);
      UICtrl.enableBtn(UISelectors.standBtn);
    }
  }, 1000);
};

// DEALER FUNCTIONS
const dealerTurn3 = () => {
  const score = scoreCtrl.getScore();
  const cardData = cardCtrl.getCardData();

  // create promise. Will always resolve. Resolve is called if dealer's score is less than 17.
  return new Promise((resolve, reject) => {

    const dealerCard3 = cardCtrl.dealDealer();
    setTimeout(() => {
      // show and animate card. Then put display in a set timeout. This creates the pause for user to register the dealer's card, and then animate the next card.
      UICtrl.showElement(UISelectors.dealerCard3);
      UICtrl.animateCard(UISelectors.dealerCard3);

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
            setTimeout(UICtrl.prepareNextHand, 1000);
          } else {
            checkWinner();
            setTimeout(UICtrl.prepareNextHand, 1000);
          }
        }
      }, 200);
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
      // show and animate card. Then put display in a set timeout. This creates the pause for user to register the dealer's card, and then animate the next card.
      UICtrl.showElement(UISelectors.dealerCard4);
      UICtrl.animateCard(UISelectors.dealerCard4);

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
            setTimeout(UICtrl.prepareNextHand, 1000);
          } else {
            checkWinner();
            setTimeout(UICtrl.prepareNextHand, 1000);
          }
        }
      }, 200);
    }, 1000);
  });
};

const dealerTurn5 = () => {
  const score = scoreCtrl.getScore();
  const cardData = cardCtrl.getCardData();

  const dealerCard5 = cardCtrl.dealDealer();
  setTimeout(() => {
    // show and animate card. Then put display in a set timeout. This creates the pause for user to register the dealer's card, and then animate the next card.
    UICtrl.showElement(UISelectors.dealerCard5);
    UICtrl.animateCard(UISelectors.dealerCard5);

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
          setTimeout(UICtrl.prepareNextHand, 1000);
        } else {
          checkWinner();
          setTimeout(UICtrl.prepareNextHand, 1000);
        }
      }
    }, 200);
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

  // set timeout for gameplay flow delay
  setTimeout(() => {
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
        setTimeout(UICtrl.prepareNextHand, 1000);
      }
    }
  }, 100);
};

// CONTROL CENTER FUNCTIONS
const doubleControlCenter = () => {
  let bet = betCtrl.getBet();
  const cardData = cardCtrl.getCardData();

  // get and set double state.
  const betData = betCtrl.getBetData();
  betData.doubleState = true;

  // double bet with setter
  bet += bet;
  betCtrl.setBet(bet);

  // log statement
  UICtrl.logText(`Bet is doubled to ${bet}. Player may hit only once.`);

  // display bet
  UICtrl.displayBet(bet);

  // disable stand, double, split buttons
  UICtrl.disableBtn(UISelectors.standBtn);
  UICtrl.disableBtn(UISelectors.doubleBtn);
  UICtrl.disableBtn(UISelectors.splitBtn);
  UICtrl.disableBtn(UISelectors.hitBtn);

  // run double code
  UICtrl.showElement(UISelectors.userCard3);
  UICtrl.animateCard(UISelectors.userCard3);
    

  setTimeout(() => {
    const card = cardCtrl.dealUser();
    UICtrl.displayCard(card, UISelectors.userCard3);
    calcScore(cardData.user, 'user');
    displayScore('user');
    // user can only hit once in double state.
    dealerFinishes();
  }, 200);
};

const betControlCenter = e => {
  // increase bet by 1, 5, or 20 and show pot chip equivalent, if user has enough money.
  if (e.target.id === 'bet-1') {
    if (betCtrl.bet1()) {
      UICtrl.showElement(UISelectors.potChip1);
      UICtrl.animate(UISelectors.potChip1);
      // 2a. after animation completes, in order to reanimate, the element must be removed from the DOM and reinserted. Used in timeout because animation takes .2s to complete. Then element gets removed and reinserted. But even before that, the first line in the function hides the element because when the node is copied, it animates. So, by hiding it, the animation doesn't appear twice.
      setTimeout(() => {
        UICtrl.hideElement(UISelectors.potChip1);
        UICtrl.showElement(UISelectors.potChipGhost1);
        prepareReanimation(UISelectors.potChip1);
      }, 400);
      // reveal and enable deal button
      UICtrl.showElement(UISelectors.dealBtn);
      UICtrl.enableBtn(UISelectors.dealBtn);
      UICtrl.enableBtn(UISelectors.resetBetBtn);
      // show bet in UI
      UICtrl.showElement(UISelectors.bet);
    } else {
      // trigger click to bring up popup.
      document.getElementById(UISelectors.activatePopup).click();
    }
  } else if (e.target.id === 'bet-5') {
    if (betCtrl.bet5()) {
      UICtrl.showElement(UISelectors.potChip5);
      UICtrl.animate(UISelectors.potChip5);
      setTimeout(() => {
        UICtrl.hideElement(UISelectors.potChip5);
        UICtrl.showElement(UISelectors.potChipGhost5);
        prepareReanimation(UISelectors.potChip5);
      }, 400);
      // reveal and enable deal button
      UICtrl.showElement(UISelectors.dealBtn);
      UICtrl.enableBtn(UISelectors.dealBtn);
      UICtrl.enableBtn(UISelectors.resetBetBtn);
      UICtrl.showElement(UISelectors.bet);
    } else {
      document.getElementById(UISelectors.activatePopup).click();
    }
  } else if (e.target.id === 'bet-20') {
    if (betCtrl.bet20()) {
      UICtrl.showElement(UISelectors.potChip20);
      UICtrl.animate(UISelectors.potChip20);
      setTimeout(() => {
        UICtrl.hideElement(UISelectors.potChip20);
        UICtrl.showElement(UISelectors.potChipGhost20);
        prepareReanimation(UISelectors.potChip20);
      }, 400);
      // reveal and enable deal button. Enable reset bet btn.
      UICtrl.showElement(UISelectors.dealBtn);
      UICtrl.enableBtn(UISelectors.dealBtn);
      UICtrl.enableBtn(UISelectors.resetBetBtn);
      UICtrl.showElement(UISelectors.bet);
    } else {
      document.getElementById(UISelectors.activatePopup).click();
    }
  }

  // 3. get and display bet
  const bet = betController.getBet();
  UICtrl.displayBet(bet);
};

const hitControlCenter = () => {
  const cardData = cardCtrl.getCardData();
  const bet = betCtrl.getBet();
  const bankroll = betCtrl.getBankroll();

  // check for split state and a split aces situation.
  if (cardData.splitState && cardData.user.splitHand1[0].value === 'ace' && cardData.user.splitHand2[0].value === 'ace') {
    splitAcesControlCenter();
  } else if (cardData.splitState) {
    splitHandControlCenter();
  } else {
    const score = scoreCtrl.getScore();
    const cardData = cardCtrl.getCardData();

    // disable irrelevant buttons. Hide btn after card comes out 200 ms.
    UICtrl.disableBtn(UISelectors.doubleBtn);
    setTimeout(() => {
      UICtrl.hideElement(UISelectors.doubleBtn);
      UICtrl.hideElement(UISelectors.splitBtn);
    }, 200);



    // ANIMATION FUNCTIONALITY
    if (cardData.user.turn === 3) {
      UICtrl.showElement(UISelectors.userCard3);
      UICtrl.animateCard(UISelectors.userCard3);
    } else if (cardData.user.turn === 4) {
      UICtrl.showElement(UISelectors.userCard4);
      UICtrl.animateCard(UISelectors.userCard4);
    } else if (cardData.user.turn === 5) {
      UICtrl.showElement(UISelectors.userCard5);
      UICtrl.animateCard(UISelectors.userCard5);
    }

    // put the rest of the function into a setTimeout.
    setTimeout(() => {
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
        UICtrl.logHand(`Player busts.`, `Chip count: ${bankroll} - ${bet} = ${bankroll - bet}`, 'red');
        betCtrl.dealerWinsBet();
        displayBankroll();
        UICtrl.prepareNextHand();
      } else if (score.user === 21) {
        standControlCenter();
        // hide hit and stand so user can't click them while in timeout functions.
        UICtrl.hideElement(UISelectors.hitBtn);
        UICtrl.hideElement(UISelectors.standBtn);
      }

      // 7. increment user turn
      cardCtrl.incrementUserTurn();

      // if player hit 5 times and still under 21.
      if (cardData.user.turn === 6 && score.user <= 21) {
        UICtrl.disableBtn(UISelectors.hitBtn);
        UICtrl.disableBtn(UISelectors.standBtn);
        console.log('reached turn 5 under 21');
        dealerFinishes();
      }
    }, 200);
  };
};

const standControlCenter = () => {
  const cardData = cardCtrl.getCardData();

  // check for split state
  if (cardData.splitState) {
    if (cardData.user.turn < 7) {
      // 2a. if user turn is less than 7, change to 7 in order to move on to split hand 2.
      cardData.user.turn = 7;
      // 2b. disable stand button. User must hit once.
      UICtrl.disableBtn(UISelectors.standBtn);
      // 2c. guidance border
      UICtrl.removeGuidanceBorder(UISelectors.splitBet1);
      UICtrl.renderGuidanceBorder(UISelectors.splitBet2);
    } else {
      UICtrl.disableBtn(UISelectors.hitBtn);
      UICtrl.disableBtn(UISelectors.standBtn);
      UICtrl.removeGuidanceBorder(UISelectors.splitBet2);
      // pause for gameplay flow
      setTimeout(() => {
        dealerFinishes();
      }, 200);
      
    }
  } else {
    // if not split state, dealer plays hand
    // disable hit and stand buttons
    UICtrl.disableBtn(UISelectors.hitBtn);
    UICtrl.disableBtn(UISelectors.standBtn);

    // disable irrelevant buttons until they become hidden
    UICtrl.disableBtn(UISelectors.doubleBtn);

    dealerFinishes();
  }
}

// PROMISES FOR CARD ANIMATION CHAIN
const dealUserCard1 = () => {
  UICtrl.showElement(UISelectors.userCard1);
  UICtrl.animateCard(UISelectors.userCard1);

  return new Promise((resolve) => {
    setTimeout(() => {
      // const userCard1 = cardCtrl.dealUser();
      const userCard1 = cardCtrl.testDealUser1();
      UICtrl.displayCard(userCard1, UISelectors.userCard1);
      resolve();
    }, 200);
  });
};

const dealDealerCard1 = () => {
  UICtrl.showElement(UISelectors.dealerCard1);
  UICtrl.animateCard(UISelectors.dealerCard1);

  return new Promise((resolve) => {
    setTimeout(() => {
      // cardCtrl.dealDealer();
      cardCtrl.testDealDealer1();
      // dealer card 1 is face down. No need to display card.
      resolve();
    }, 200);
  });
};

const dealUserCard2 = () => {
  UICtrl.showElement(UISelectors.userCard2);
  UICtrl.animateCard(UISelectors.userCard2);

  return new Promise((resolve) => {
    setTimeout(() => {
      // const userCard2 = cardCtrl.dealUser();
      const userCard2 = cardCtrl.testDealUser2();
      UICtrl.displayCard(userCard2, UISelectors.userCard2);
      resolve();
    }, 200);
  });
};

const dealDealerCard2 = () => {
  UICtrl.showElement(UISelectors.dealerCard2);
  UICtrl.animateCard(UISelectors.dealerCard2);

  return new Promise((resolve) => {
    setTimeout(() => {
      // const dealerCard2 = cardCtrl.dealDealer();
      const dealerCard2 = cardCtrl.testDealDealer2();
      UICtrl.displayCard(dealerCard2, UISelectors.dealerCard2);
      resolve();
    }, 200);
  });
};

const dealCards = () => {
  const handCount = cardCtrl.getHandCount();
  UICtrl.logText(`Dealing hand #${handCount}...`)
  cardCtrl.incrementHandCount();
  UICtrl.disableBtn(UISelectors.resetBetBtn);
  // disable deal btn. Hide it right before hit and stand btns show
  UICtrl.disableBtn(UISelectors.dealBtn);
  setTimeout(() => {
    UICtrl.hideElement(UISelectors.dealBtn);
  }, 800);

  dealUserCard1()
    .then(dealDealerCard1)
    .then(dealUserCard2)
    .then(dealDealerCard2)
    .then(dealControlCenter);
};

const dealControlCenter = () => {
  const cardData = cardCtrl.getCardData();
  const score = scoreCtrl.getScore();
  const bankroll = betCtrl.getBankroll();
  const bet = betCtrl.getBet();

  // 1. hide place bet UI text
  UICtrl.hideElement(UISelectors.placeBet);

  // 2. disable chip and reset bet btns
  UICtrl.disableBetBtn(UISelectors.betBtn1);
  UICtrl.disableBetBtn(UISelectors.betBtn5);
  UICtrl.disableBetBtn(UISelectors.betBtn20);
  UICtrl.disableBtn(UISelectors.resetBetBtn);

  // enable hit, enable stand
  UICtrl.enableBtn(UISelectors.hitBtn);
  UICtrl.enableBtn(UISelectors.standBtn);

  // 4. show hit, show stand
  UICtrl.showElement(UISelectors.hitBtn);
  UICtrl.showElement(UISelectors.standBtn);

  // 5. calculate user and dealer score.
  calcScore(cardData.user, 'user');
  calcScore(cardData.dealer, 'dealer');

  // 6. display user score
  displayScore('user');

  // 7. handle blackjacks and insurance logic
  if (score.user === 21 && score.dealer === 21) {
    // disable buttons
    UICtrl.disableBtn(UISelectors.hitBtn);
    UICtrl.disableBtn(UISelectors.standBtn);
    setTimeout(() => {
      // show dealer's first card in UI.
      UICtrl.displayCard(cardData.dealer.hand[0], UISelectors.dealerCard1);
      UICtrl.logHand(`Push. Player and dealer both have blackjack. Bet is returned`, `Chip count: ${bankroll}.`)
      betCtrl.push();
      UICtrl.prepareNextHand();
    }, 600);
  } else if (score.user === 21) {
    // disable buttons
    UICtrl.disableBtn(UISelectors.hitBtn);
    UICtrl.disableBtn(UISelectors.standBtn);
    setTimeout(() => {
      // show dealer's first card in UI.
      UICtrl.displayCard(cardData.dealer.hand[0], UISelectors.dealerCard1);
      UICtrl.logHand(`Player has blackjack. Pays 3:2.`, `Chip count: ${bankroll} + ${bet * 1.5} = ${bankroll + bet * 1.5}.`, 'green')
      betCtrl.blackjack();
      displayBankroll();
      UICtrl.prepareNextHand();
    }, 600);
  } else if (cardData.dealer.hand[1].value === 'ace' && bankroll - bet > 0) {
    // dealer is showing an ace. User does not have blackjack.
    UICtrl.showElement(UISelectors.insuranceWarning);

    // must disable all buttons until user selects yes or no
    UICtrl.disableBtn(UISelectors.hitBtn);
    UICtrl.disableBtn(UISelectors.standBtn);
    UICtrl.disableBtn(UISelectors.splitBtn);
    UICtrl.disableBtn(UISelectors.doubleBtn);
  }

  // 8. user can split if cards are same point value, and they have enough money in bankroll.
  if (cardData.user.hand[0].points === cardData.user.hand[1].points && bankroll - bet * 2 >= 0) {
    UICtrl.showElement(UISelectors.splitBtn);
  }
  
  // 9. user can double if they have enough money.
  if (score.user === 9 || score.user === 10 || score.user === 11 && bankroll - (bet * 2) >= 0) {
    UICtrl.showElement(UISelectors.doubleBtn);
  }
};

const nextHandControlCenter = () => {
  // call each controller's next hand function
  cardCtrl.nextHand();
  scoreCtrl.nextHand();
  betCtrl.nextHand();
  UICtrl.nextHand();

  // get and display bet
  const bet = betController.getBet();
  UICtrl.displayBet(bet);

  // enable option btns. These can only be disabled once, so they may be enabled here in preparation for the next hand.
  UICtrl.enableBtn(UISelectors.doubleBtn);

  // remove split-pot elements from the DOM.
  if (document.getElementById('split-pot-1')) {
    document.getElementById('split-pot-1').remove();
    document.getElementById('split-pot-2').remove();
  }

  // create a blank line in console
  console.log('');
};

const tutorialControlCenter = () => {
  tutCtrl.showStep01();
};

return {
  init: function () {
    console.log('Application started');
    // set all to visible
    document.querySelector(UISelectors.container).style.display = 'block';

    // sets the UI for a new hand. Hides all the elements.
    UICtrl.nextHand();

    loadEventListeners();
    displayBankroll();
  }
}
}) (UIController, cardController, betController, scoreController, tutorialController);

app.init();