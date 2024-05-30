(function() {
  const facts = [
    "honey never spoils?",
    "bananas are berries?",
    "humans and giraffes have the same number of neck vertebrae?",
    "a day on Venus is longer than a year on Venus?",
    "octopuses have three hearts?",
    "strawberries aren't berries, but bananas are?",
    "the shortest war in history lasted only 38 to 45 minutes?",
    "a single strand of spaghetti is called a 'spaghetto'?",
    "the Eiffel Tower can be 15 cm taller during the summer?",
    "there are more stars in the universe than grains of sand on all the world's beaches?",
    "honey never spoils and has been found in ancient Egyptian tombs?",
    "the first computer was invented in the 1940s?",
    "a bolt of lightning contains enough energy to toast 100,000 slices of bread?",
    "the inventor of the frisbee was turned into a frisbee after he died?",
    "the shortest war in history was between Britain and Zanzibar on August 27, 1896?",
    "a crocodile cannot stick its tongue out?",
    "a group of flamingos is called a 'flamboyance'?",
    "the heart of a shrimp is located in its head?",
    "a snail can sleep for three years?",
    "the fingerprints of a koala are so indistinguishable from humans that they have on occasion been confused at a crime scene?",
    "slugs have four noses?",
    "only female mosquitoes bite?",
    "a rhinoceros' horn is made of hair?",
    "it is possible to hypnotize a frog by placing it on its back and gently stroking its stomach?",
    "it takes about 8 minutes and 20 seconds for light from the sun to reach Earth?",
    "nearly 3% of the ice in Antarctic glaciers is penguin urine?",
    "banging your head against a wall for one hour burns 150 calories?",
    "in Switzerland, it is illegal to own just one guinea pig?",
    "pteronophobia is the fear of being tickled by feathers?",
    "snakes can help predict earthquakes?",
    "a flock of crows is known as a murder?",
    "the oldest 'your mom' joke was discovered on a 3,500 year old Babylonian tablet?",
    "so far, two diseases have successfully been eradicated: smallpox and rinderpest?",
    "29th May is officially 'Put a Pillow on Your Fridge Day'?",
    "cherophobia is an irrational fear of fun or happiness?",
    "seven percent of American adults believe that chocolate milk comes from brown cows?",
    "if you lift a kangaroo’s tail off the ground it can’t hop?",
    "bananas are curved because they grow towards the sun?",
    "Billy goats urinate on their own heads to smell more attractive to females?",
    "the inventor of the Pringles can is now buried in one?",
    "the shortest commercial flight in the world is in Scotland and lasts just 1.5 minutes?",
    "the world's largest grand piano was built by a 15-year-old in New Zealand?",
    "tigers have striped skin, not just striped fur?",
    "a small child could swim through the veins of a blue whale?",
    "octopuses lay 56,000 eggs at a time?",
    "on average, a person will spend six months of their life waiting for red lights to turn green?",
    "the word 'gorilla' is derived from a Greek word meaning, 'a tribe of hairy women'?",
    "there are 293 ways to make change for a dollar?",
    "the Sun is 400 times larger than the Moon but is 400 times farther away from Earth, making them appear the same size in the sky?",
    "there are more possible iterations of a game of chess than there are atoms in the known universe?",
    "a single cloud can weigh more than a million pounds?",
    "more people visit France than any other country?",
    "the first oranges weren’t orange?",
    "Scotland has 421 words for 'snow'?",
    "Samsung tests phone durability with a butt-shaped robot?",
    "the longest English word is 189,819 letters long?",
    "running amok is a medically recognized mental condition?",
    "cows don’t have upper front teeth?",
    "a single strand of spaghetti is called a spaghetto?",
    "the probability of flipping a coin and getting heads 10 times in a row is about 1 in 1,024?",
    "the unicorn is the national animal of Scotland?"
  ];

  let isEnabled = false;
  let observer = null;

  function getRandomFact() {
    const fact = facts[Math.floor(Math.random() * facts.length)];
    return `Did you know that ${fact}`;
  }

  function hideParagraphsContainingWord(word) {
    const elements = document.querySelectorAll('p, span');
    elements.forEach(el => {
      if (el.innerText.includes(word) && !el.dataset.originalText) {
        el.dataset.originalText = el.innerText; // Store original text
        el.innerText = getRandomFact();
      }
    });
  }

  function revertOriginalText() {
    const elements = document.querySelectorAll('p, span');
    elements.forEach(el => {
      if (el.dataset.originalText) {
        el.innerText = el.dataset.originalText; // Revert to original text
        delete el.dataset.originalText; // Remove the data attribute
      }
    });
  }

  function handleMutations(mutations) {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        hideParagraphsContainingWord('Elon Musk');
      }
    });
  }

  function startObserving() {
    observer = new MutationObserver(handleMutations);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    hideParagraphsContainingWord('Elon Musk'); // Initial run
  }

  function stopObserving() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    revertOriginalText();
  }

  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'enable') {
      isEnabled = true;
      startObserving();
    } else if (request.action === 'disable') {
      isEnabled = false;
      stopObserving();
    }
  });

  // Check initial state
  chrome.storage.sync.get('enabled', function (data) {
    isEnabled = data.enabled || false;
    if (isEnabled) {
      startObserving();
    }
  });
})();