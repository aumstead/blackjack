const tutorialController = (function (UICtrl) {
  //const tutorialData = {}

  const UISelectors = UICtrl.getUISelectors();
  

  const tutSelectors = {
    // text bubbles
    tutLine01: 'tut-line-01',
    tutLine02: 'tut-line-02',
    tutLine03: 'tut-line-03',

    // next text button
    tutBtn01: 'tut-btn-01',
    tutBtn02: 'tut-btn-02',

    // game buttons
    tutSplit: 'tut-split',
    tutDouble: 'tut-double',

    // cards
    tutUserCard1: 'tut-user-card-1',
    tutUserCard2: 'tut-user-card-2',
    tutUserCard3: 'tut-user-card-3'
  }

  // event listeners
  

  // hide everything
  document.getElementById(tutSelectors.tutLine01).style.display = 'none';
  document.getElementById(tutSelectors.tutBtn01).style.display = 'none';
  document.getElementById(tutSelectors.tutLine02).style.display = 'none';
  document.getElementById(tutSelectors.tutBtn02).style.display = 'none';
  document.getElementById(tutSelectors.tutLine03).style.display = 'none';
  document.getElementById(tutSelectors.tutDouble).style.display = 'none';
  document.getElementById(tutSelectors.tutSplit).style.display = 'none';
  document.getElementById(tutSelectors.tutUserCard1).style.display = 'none';
  document.getElementById(tutSelectors.tutUserCard2).style.display = 'none';
  document.getElementById(tutSelectors.tutUserCard3).style.display = 'none';

  function showElement (selector, property = 'inline-block') {
    document.getElementById(selector).style.display = property;
  };
  

  return {
    getTutSelectors: () => tutSelectors,

    showStep01: () => {
      document.getElementById(tutSelectors.tutLine01).style.display = 'inline-block';
      document.getElementById(tutSelectors.tutBtn01).style.display = 'inline-block';
      UICtrl.hideElement(UISelectors.placeBet);
    },

    showStep02: () => {
      // hide previous
      document.getElementById(tutSelectors.tutLine01).style.display = 'none';
      document.getElementById(tutSelectors.tutBtn01).style.display = 'none';
  
      // show next
      document.getElementById(tutSelectors.tutLine02).style.display = 'inline-block';
      document.getElementById(tutSelectors.tutLine03).style.display = 'inline-block';
      document.getElementById(tutSelectors.tutBtn02).style.display = 'inline-block';

      // show gameboard
      showElement(tutSelectors.tutDouble);
      
    }
  }

  
})(UIController);