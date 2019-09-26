const splitController = (function () {
  const splitData = {
    splitState: false,
    splitHand1: [],
    splitHand2: []
  }


  return {
    getSplitState: () => {
      return splitData.splitState;
    },

    setSplitState: state => {
      splitData.splitState = state;
    },

    splitHand: (card1, card2) => {
      splitData.splitHand1.push(card1);
      splitData.splitHand2.push(card2);
    },

    getSplitHand: hand => hand === '1' ? splitData.splitHand1 : splitData.splitHand2
    
  }
})();