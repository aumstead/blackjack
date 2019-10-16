const betController = (function () {

  let bet = 0;
  let bankroll = 100;
  
  const betData = {
    doubleState: false
  }
  

  return {
    bet1: () => {
      if (bankroll - bet - 1 >= 0) {
        bet++;
        return true;
      } else {
        return false;
      }
    },

    bet5: () => {
      if (bankroll - bet - 5 >= 0) {
        bet += 5;
        return true;
      } else {
        return false;
      }
    },

    bet20: () => {
      if (bankroll - bet - 20 >= 0) {
        bet += 20;
        return true;
      } else {
        return false;
      }
    },

    userWinsBet: () => {
      bankroll += bet;
      console.log('Bankroll + ' + bet + ' = ' + bankroll);
      bet = 0;
    },

    dealerWinsBet: () => {
      bankroll -= bet;
      console.log('Bankroll - ' + bet + ' = ' + bankroll);
      bet = 0;
    },

    push: () => {
      bet = 0;
      console.log('Bankroll = ' + bankroll);
    },

    blackjack: () => {
      bankroll += Math.ceil(bet * 1.5);
      console.log('Bankroll + 1.5x ' + bet + ' = ' + bankroll);
      bet = 0;
    },

    userWinsInsuranceBet: (insuranceBet) => {
      bankroll += insuranceBet * 2;
      console.log(`Bankroll + ${insuranceBet} = ${bankroll}`);
    },

    userLosesInsuranceBet: (insuranceBet) => {
      bankroll -= insuranceBet;
      console.log(`Bankroll - ${insuranceBet} = ${bankroll}`);
    },

    userLosesSplitHand: hand => {
      if (hand === '1') {
        bankroll -= bet;
        console.log(`Bankroll - ${bet} = ${bankroll}`);
      } else if (hand === '2') {
        bankroll -= bet;
        console.log(`Bankroll - ${bet} = ${bankroll}`);
      }
    },

    userWinsSplitHand: hand => {
      if (hand === '1') {
        console.log('user is winning split hand 1')
        bankroll += bet;
        console.log(`Bankroll + ${bet} = ${bankroll}`);
      } else if (hand === '2') {
        console.log('user is winning split hand 2')
        bankroll += bet;
        console.log(`Bankroll + ${bet} = ${bankroll}`);
      }
    },

    getBetData: () => {
      return betData;
    },

    getBankroll: () => {
      return bankroll;
    },

    nextHand: () => {
      bet = 0;
      betData.doubleState = false;
    },

    getBet: () => {
      return bet;
    },

    setBet: (amount) => {
      bet = amount;
    },

    reloadChips: () => {
      bankroll += 100;
    }
  }
})();