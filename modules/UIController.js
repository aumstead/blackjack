const UIController = (function () {
  const UISelectors = {
    // cards
    dealerCard1: 'dealer-card-1',
    dealerCard2: 'dealer-card-2',
    dealerCard3: 'dealer-card-3',
    dealerCard4: 'dealer-card-4',
    dealerCard5: 'dealer-card-5',
    userCard1: 'user-card-1',
    userCard2: 'user-card-2',
    userCard3: 'user-card-3',
    userCard4: 'user-card-4',
    userCard5: 'user-card-5',
    userSplit1: 'user-split-1',
    userSplit2: 'user-split-2',
    userSplit3: 'user-split-3',
    userSplit4: 'user-split-4',
    userSplit5: 'user-split-5',
    userSplit6: 'user-split-6',
    userSplit7: 'user-split-7',
    userSplit8: 'user-split-8',
    userSplit9: 'user-split-9',
    userSplit10: 'user-split-10',

    // buttons
    dealBtn: 'deal',
    hitBtn: 'hit',
    standBtn: 'stand',
    doubleBtn: 'double',
    splitBtn: 'split',
    nextHandBtn: 'next-hand',
    insuranceYesBtn: 'insurance-yes-btn',
    insuranceNoBtn: 'insurance-no-btn',
    insuranceSubmitBtn: 'insurance-submit-btn',
    resetBetBtn: 'reset-bet',

    // other
    placeBet: 'place-bet',
    insuranceWarning: 'insurance-warning',
    insuranceForm: 'insurance-form',
    insuranceInput: 'insurance-input',

    // bet buttons
    betBtn1: 'bet-1',
    betBtn5: 'bet-5',
    betBtn20: 'bet-20',

    // displays
    bet: 'bet',
    splitBet1: 'split-bet-1',
    splitBet2: 'split-bet-2',
    bankroll: 'bankroll',
    insuranceBet: 'insurance-bet',
    dealerScore: 'dealer-score',
    userScore: 'user-score',
    splitScore1: 'split-score-1',
    splitScore2: 'split-score-2',
    potChip1: 'pot-chip-1',
    potChip5: 'pot-chip-5',
    potChip20: 'pot-chip-20',
    potChipGhost1: 'pot-chip-ghost-1',
    potChipGhost5: 'pot-chip-ghost-5',
    potChipGhost20: 'pot-chip-ghost-20',
  }

  const newHandUI = () => {
    // hide elements
    document.getElementById(UISelectors.dealerCard1).style.display = 'none';
    document.getElementById(UISelectors.dealerCard2).style.display = 'none';
    document.getElementById(UISelectors.dealerCard3).style.display = 'none';
    document.getElementById(UISelectors.dealerCard4).style.display = 'none';
    document.getElementById(UISelectors.dealerCard5).style.display = 'none';
    document.getElementById(UISelectors.userCard1).style.display = 'none';
    document.getElementById(UISelectors.userCard2).style.display = 'none';
    document.getElementById(UISelectors.userCard3).style.display = 'none';
    document.getElementById(UISelectors.userCard4).style.display = 'none';
    document.getElementById(UISelectors.userCard5).style.display = 'none';
    document.getElementById(UISelectors.userSplit1).style.display = 'none';
    document.getElementById(UISelectors.userSplit2).style.display = 'none';
    document.getElementById(UISelectors.userSplit3).style.display = 'none';
    document.getElementById(UISelectors.userSplit4).style.display = 'none';
    document.getElementById(UISelectors.userSplit8).style.display = 'none';
    document.getElementById(UISelectors.userSplit7).style.display = 'none';
    document.getElementById(UISelectors.userSplit5).style.display = 'none';
    document.getElementById(UISelectors.userSplit6).style.display = 'none';
    document.getElementById(UISelectors.userSplit9).style.display = 'none';
    document.getElementById(UISelectors.userSplit10).style.display = 'none';
    document.getElementById(UISelectors.splitBtn).style.display = 'none';
    document.getElementById(UISelectors.dealBtn).style.display = 'none';
    document.getElementById(UISelectors.doubleBtn).style.display = 'none';
    document.getElementById(UISelectors.nextHandBtn).style.display = 'none';
    document.getElementById(UISelectors.standBtn).style.display = 'none';
    document.getElementById(UISelectors.hitBtn).style.display = 'none';
    document.getElementById(UISelectors.insuranceWarning).style.display = 'none';
    document.getElementById(UISelectors.insuranceForm).style.display = 'none';
    document.getElementById(UISelectors.splitBet1).style.display = 'none';
    document.getElementById(UISelectors.splitBet2).style.display = 'none';
    document.getElementById(UISelectors.insuranceBet).style.display = 'none';
    document.getElementById(UISelectors.userScore).style.display = 'none';
    document.getElementById(UISelectors.dealerScore).style.display = 'none';
    document.getElementById(UISelectors.splitScore1).style.display = 'none';
    document.getElementById(UISelectors.splitScore2).style.display = 'none';
    document.getElementById(UISelectors.potChip1).style.display = 'none';
    document.getElementById(UISelectors.potChip5).style.display = 'none';
    document.getElementById(UISelectors.potChip20).style.display = 'none';
    document.getElementById(UISelectors.potChipGhost1).style.display = 'none';
    document.getElementById(UISelectors.potChipGhost5).style.display = 'none';
    document.getElementById(UISelectors.potChipGhost20).style.display = 'none';

    // show elements
    document.getElementById(UISelectors.placeBet).style.display = 'inline-block';
    document.getElementById(UISelectors.betBtn1).style.display = 'inline-block';
    document.getElementById(UISelectors.betBtn5).style.display = 'inline-block';
    document.getElementById(UISelectors.betBtn20).style.display = 'inline-block';
    document.getElementById(UISelectors.bet).style.display = 'inline-block';

    // load card back for all cards
    document.getElementById(UISelectors.userCard1).src = '../images/playing-card-back-1.png';
    document.getElementById(UISelectors.userCard2).src = '../images/playing-card-back-1.png';
    document.getElementById(UISelectors.userCard3).src = '../images/playing-card-back-1.png';
    document.getElementById(UISelectors.userCard4).src = '../images/playing-card-back-1.png';
    document.getElementById(UISelectors.userCard5).src = '../images/playing-card-back-1.png';
    document.getElementById(UISelectors.dealerCard1).src = '../images/playing-card-back-1.png';
    document.getElementById(UISelectors.dealerCard2).src = '../images/playing-card-back-1.png';
    document.getElementById(UISelectors.dealerCard3).src = '../images/playing-card-back-1.png';
    document.getElementById(UISelectors.dealerCard4).src = '../images/playing-card-back-1.png';
    document.getElementById(UISelectors.dealerCard5).src = '../images/playing-card-back-1.png';
    document.getElementById(UISelectors.userSplit1).src = '../images/playing-card-back-1.png';
    document.getElementById(UISelectors.userSplit2).src = '../images/playing-card-back-1.png';
    document.getElementById(UISelectors.userSplit3).src = '../images/playing-card-back-1.png';
    document.getElementById(UISelectors.userSplit4).src = '../images/playing-card-back-1.png';
    document.getElementById(UISelectors.userSplit5).src = '../images/playing-card-back-1.png';
    document.getElementById(UISelectors.userSplit6).src = '../images/playing-card-back-1.png';
    document.getElementById(UISelectors.userSplit7).src = '../images/playing-card-back-1.png';
    document.getElementById(UISelectors.userSplit8).src = '../images/playing-card-back-1.png';
    document.getElementById(UISelectors.userSplit9).src = '../images/playing-card-back-1.png';
    document.getElementById(UISelectors.userSplit10).src = '../images/playing-card-back-1.png';

    // set reset bet button to disabled and add the style.
    document.getElementById(UISelectors.resetBetBtn).disabled = true;
    document.getElementById(UISelectors.resetBetBtn).classList.add('disabled');

    // enable bet btns and remove disabled-bet style
    document.getElementById(UISelectors.betBtn1).disabled = false;
    document.getElementById(UISelectors.betBtn5).disabled = false;
    document.getElementById(UISelectors.betBtn20).disabled = false;
    document.getElementById(UISelectors.betBtn1).classList.remove('disabled-bet');
    document.getElementById(UISelectors.betBtn5).classList.remove('disabled-bet');
    document.getElementById(UISelectors.betBtn20).classList.remove('disabled-bet');
  };



  

  return {
    hideElement: selector => {
      document.getElementById(selector).style.display = 'none';
    },

    showElement: (selector, property = 'inline-block') => {
      document.getElementById(selector).style.display = property;
    },

    getUISelectors: () => {
      return UISelectors;
    },

    displayBankroll: bankroll => {
      document.getElementById(UISelectors.bankroll).textContent = `Chips: $${bankroll}`;
    },

    displayBet: bet => {
      document.getElementById(UISelectors.bet).textContent = `$${bet}`;
    },

    displayCard: (card, selector) => {
      document.getElementById(selector).src = `./images/${card.suit}-${card.value}.png`;
      document.getElementById(selector).style.display = 'inline-block';
    },

    displayDealerScore: (dealerScore) => {
      document.getElementById(UISelectors.dealerScore).textContent = `${dealerScore}`;
      document.getElementById(UISelectors.dealerScore).style.display = 'block';
    },

    displayUserScore: (userScore) => {
      document.getElementById(UISelectors.userScore).textContent = `${userScore}`;
      document.getElementById(UISelectors.userScore).style.display = 'block';
    },

    getInsuranceInput: () => {
      const value = document.getElementById(UISelectors.insuranceInput).value;
      // reset form input
      document.getElementById(UISelectors.insuranceInput).value = '';
      return value
    },

    displayInsuranceBet: insuranceBet => {
      document.getElementById(UISelectors.insuranceBet).textContent = `Insurance bet: ${insuranceBet}`;
      document.getElementById(UISelectors.insuranceBet).style.display = 'block';
    },

    displaySplitBets: bet => {
      document.getElementById(UISelectors.splitBet1).textContent = `Hand 1 bet: ${bet}`;
      document.getElementById(UISelectors.splitBet2).textContent = `Hand 2 bet: ${bet}`;
      document.getElementById(UISelectors.splitBet1).style.display = 'block';
      document.getElementById(UISelectors.splitBet2).style.display = 'block';
    },

    displaySplitScore1: score => {
      document.getElementById(UISelectors.splitScore1).textContent = `Split hand 1 score: ${score}`;
      document.getElementById(UISelectors.splitScore1).style.display = 'block';
    },

    loadElement: (value, selector, text) => {
      document.getElementById(selector).textContent = `${text} ${value}`;
    },

    prepareNextHand: () => {
      // show next hand button
      document.getElementById(UISelectors.nextHandBtn).style.display = 'inline-block';

      // hide buttons
      document.getElementById(UISelectors.hitBtn).style.display = 'none';
      document.getElementById(UISelectors.standBtn).style.display = 'none';
    },

    nextHand: () => {
      newHandUI();
    },

    animateCard: selector => {
      document.getElementById(selector).style.animationPlayState = 'running';
    },

    animate: selector => {
      document.getElementById(selector).style.animationPlayState = 'running';
    },

    pauseAnimation: selector => {
      document.getElementById(selector).style.animationPlayState = 'paused';
    },

    disableBtn: selector => {
      document.getElementById(selector).disabled = true;
      document.getElementById(selector).classList.add('disabled');
    },

    enableBtn: selector => {
      document.getElementById(selector).disabled = false;
      document.getElementById(selector).classList.remove('disabled');
    },

    disableBetBtn: selector => {
      document.getElementById(selector).disabled = true;
      document.getElementById(selector).classList.add('disabled-bet');
    }
  }
})();