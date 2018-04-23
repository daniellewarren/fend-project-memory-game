/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976

let cards = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb', 'fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
let deck = document.querySelector('.deck');
let openCards = [];
let matchedPairs = 0;
let moves = 0;
let time = 0;
let timer;

document.body.onload = displayCards;

//shuffle cards before displaying
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function startTimer() {
  ++time;
  let timerspan = document.querySelector('.time');
  timerspan.innerHTML = time;
}

//stop the timer on current number of seconds
function stopTimer() {
  clearInterval(timer);
  let finaltimespan = document.querySelector('.finaltime');
  finaltimespan.innerHTML = time;
}

//restart timer back to 0 seconds
function restartTimer() {
  time = 0;
  clearInterval(timer);
  timer = setInterval(startTimer, 1000);
}

//cards do not match, animate and hide card value
function resetPair(card1, card2) {
  card1.style.webkitAnimationPlayState = 'paused';
  card2.style.webkitAnimationPlayState = 'paused';

  var elems = document.querySelectorAll(".open.show");
  for (var i = 0; i < elems.length; i++) {
    elems[i].classList.remove('show');
    elems[i].classList.remove('open');
  }
  openCards = [];
}

function pairsMatch() {
  //increment each time there is a match
  matchedPairs += 1;
  if (matchedPairs >= 8) {
    //there are no more cards to match. Player wins!
    let winningModal = document.getElementById('winningModal');
    let closeModal = document.getElementsByClassName('close')[0];
    winningModal.style.display = 'block';
    stopTimer();

    // When the user clicks the x, close the modal
    closeModal.onclick = function() {
      winningModal.style.display = 'none';
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == winningModal) {
        winningModal.style.display = 'none';
      }
    }
  }
}

function flipCard(event) {
  //if there are currently no cards flipped for matching
  if (openCards.length < 1) {
    //show card and add to array
    this.className = 'card show open';
    let card1 = event.target;
    openCards.push(card1);
  }
  //else if there is already 1 open card
  else if (openCards.length === 1) {
    //show card and add to array with 1st card
    this.className = 'card show open';
    let card2 = event.target;
    openCards.push(card2);
  }
  //if there are already 2 cards open
  if (openCards.length === 2) {
    //increment number of moves player has made
    moves ++;
    document.getElementById('moves').innerHTML = moves;

    //check if open cards are matching
    if (openCards[0].firstChild.className === openCards[1].firstChild.className) {
      //cards match - keep cards open and add match styles
      openCards[0].classList += ' match disabled';
      openCards[1].classList += ' match disabled';
      //Clear openCards array for next turn
      openCards = [];
      pairsMatch();
    }
    //open cards do not match
    else {
      //animate cards to show there is no match
      openCards.forEach(function(openCard) {
        openCard.style.webkitAnimationPlayState = 'running';
      });
      //reset pair of cards for next turn
      setTimeout(resetPair, 500, openCards[0], openCards[1]);
    }

    //set start rating = 3 at start of game
    let star = document.querySelector('.fa-star');
    let star2 = document.querySelector('.fa-star.two');
    let star3 = document.querySelector('.fa-star.three');
    let starratingdiv = document.querySelector('.starrating');
    let starrating;
    //if the user makes > 10 moves keep 3 star rating
    if (moves < 10) {
      starrating = 3;
      starratingdiv.innerHTML = starrating;
    }
    //if the user makes 10 or more moves, display 2 stars
    else if (moves === 10) {
      starrating = 2;
      star2.classList.add('hidden');
      starratingdiv.innerHTML = starrating;
    }
    //if the user makes 20 moves, display 1 star
    else if (moves === 20) {
      starrating = 1;
      star3.classList.add('hidden');
      starratingdiv.innerHTML = starrating;
    }
  }
}

//shuffle and display all 16 cards
function displayCards() {
  shuffle(cards);
  //create each card dynamically
  for (i = 0; i < cards.length; i++) {
    let li = document.createElement('li');
    li.className = 'card';
    let icon = document.createElement('i');
    icon.className = 'fa ' + cards[i];
    li.appendChild(icon);
    deck.appendChild(li);
    li.addEventListener('click', flipCard);
    li.style.webkitAnimationName = 'shake';
  }
  document.getElementById('moves').innerHTML = moves;
  restartTimer();
}

document.querySelector('.restart').addEventListener('click', restartGame);

function restartGame() {
  moves = 0;
  openCards = [];
  matchedPairs = 0;
  let allstars = document.querySelectorAll('.fa-star');
  allstars.forEach(function(star) {
    star.classList.remove('hidden');
  });
  //remove all cards and display new shuffled cards
  document.querySelectorAll('.card').forEach(e => e.parentNode.removeChild(e));
  winningModal.style.display = 'none';
  displayCards();
}
