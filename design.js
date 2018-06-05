/*  TODO:
    -congrats popup
    -styling
    -RWD
    -readme
    -comments
    -code quality
    -match is buggy :< :< :<
*/

/*--------------------------------------------------------------------------*/
/*DECLARATIONS*/
/*--------------------------------------------------------------------------*/
const welcomeModal = document.getElementById("welcome");
const gameOverModal = document.getElementById("game-over");
const stats = document.getElementById("stats-container");
const mainGame = document.getElementById("main-game");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const newGameBtn = document.getElementById("new-game-btn");
const stars = document.getElementById("star-container");
//stores number of stars, 3 by default
let starCount = 3;
const cardDeck = document.getElementById("card-deck");
//collection of all cards
let cards = cardDeck.getElementsByClassName("card");
//temporarily stores only two clicked cards
let open = cardDeck.getElementsByClassName("open");
let matched = cardDeck.getElementsByClassName("matched");
//temporarily stores classes of two clicked cards
let classes = [];
//move counter
let moves = 0;
const movesHolder = document.getElementById("moves");
//i for use in loops
let i = 0;
//timer setup
const timer = document.getElementById("timer");
let minutes = 0;
let seconds = 0;
let t;
//array with symbols
const symbols = ["anchor", "at", "bicycle", "bug", "camera", "coffee", "dollar-sign", "fighter-jet", "anchor", "at", "bicycle", "bug", "camera", "coffee", "dollar-sign", "fighter-jet"];

/*--------------------------------------------------------------------------*/
/*TIMER*/
/*--------------------------------------------------------------------------*/
//timer based on Daniel Hug's JS Fiddle https://jsfiddle.net/Daniel_Hug/pvk6p/
function timerCount() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
    }

    timer.textContent = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

    startTimer();
}

function startTimer() {
    t = setTimeout(timerCount, 1000);
}

function stopTimer() {
    clearTimeout(t);
}

function clearTimer() {
    timer.textContent = "00:00";
    seconds = 0;
    minutes = 0;
}

function restartTimer() {
    stopTimer();
    clearTimer();
    startTimer();
}

/*--------------------------------------------------------------------------*/
/*STAR RATING*/
/*--------------------------------------------------------------------------*/
//removes a star if number of moves is equal to 20 or 35
function starRating() {
    if (moves === 2 || moves === 5) {
        //remove a star
        stars.lastElementChild.outerHTML = "";
        if (starCount > 0)
            starCount--;
    }
}

//resets stars to default
function resetStarRating() {
    const starStr = `<i class="fas fa-star"></i>`;

    while (starCount < 3) {
        //add a star
        stars.insertAdjacentHTML("afterbegin", starStr);
        starCount++;
    }
}

/*--------------------------------------------------------------------------*/
/*MOVES*/
/*--------------------------------------------------------------------------*/
//increments and displays moves
function movesCounter() {
    moves++;
    movesHolder.innerHTML = `moves: ${moves}`;
}

//resets moves
function resetMovesCounter() {
    moves = 0;
    movesHolder.innerHTML = `moves: ${moves}`;
}

/*--------------------------------------------------------------------------*/
/*OTHER FUNCTIONS*/
/*--------------------------------------------------------------------------*/
//toggles three classes at once
function toggleTrio(el, class1, class2, class3) {
    el.classList.toggle(class1);
    el.classList.toggle(class2);
    el.classList.toggle(class3);
}

//Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//sets new card deck and resets time, stars, rating and moves
function newGame() {
    restartTimer();
    resetMovesCounter();
    resetStarRating();
    cardDeck.innerHTML = "";
    classes.length = 0;
    matched.length = 0;
    addCards(cardDeck, symbols);
    clickHandler();
}
/*--------------------------------------------------------------------------*/
/*MAIN GAME LOGIC*/
/*--------------------------------------------------------------------------*/
//Function to add cards
function addCards(parent, srcArray) {

    shuffle(srcArray);
    //String to hold the html code to be inserted
    let tempStr = "";
    for (let i = 0; i < srcArray.length; i++) {
        tempStr += (`<div class="flip"><div class="card ${srcArray[i]}"><figure class="front face"></figure><figure class="back face"><i class="fas fa-${srcArray[i]}"></i></figure></div></div>`);
    }
    parent.insertAdjacentHTML("afterbegin", tempStr);
}


function clickHandler() {

    for (i = 0; i < cards.length; i++) {

        cards[i].addEventListener("click", function () {

            //count moves and rate the user with stars
            movesCounter();
            starRating();
            //display a congratulions popup when all cards match
            setTimeout(gameOver, 5000);

            //toggle classes
            toggleTrio(this, "unmatched", "flipped", "open");
            classes.push(this.className);

            //compare 2 classes from the array
            if (classes.length === 2) {
                //on match
                if (classes[0] === classes[1]) {

                    for (i = 1; i >= 0; i--) {
                        toggleTrio(open[i], "matched", "unmatched", "open");
                        classes.length = 0;
                    }
                } else {
                    //on mismatch
                    setTimeout(function () {

                        for (i = 1; i >= 0; i--) {
                            toggleTrio(open[i], "unmatched", "flipped", "open");
                        }
                    }, 1000);

                    classes.length = 0;
                }
            }
        });
    }
}

//congratulations popup
//REMEMBER to change after testing
function gameOver() {
    if (matched.length === 2) {
        stopTimer();
        mainGame.classList.add("hidden");
        stats.innerHTML = `It took you ${minutes} minutes and ${seconds} seconds to win the game. You've earned ${starCount} star(s).`
        gameOverModal.classList.remove("hidden");
    }
}

/*--------------------------------------------------------------------------*/
/*BUTTONS*/
/*--------------------------------------------------------------------------*/
startBtn.addEventListener("click", function () {
    addCards(cardDeck, symbols);
    clickHandler();
    welcomeModal.classList.add("hidden");
    mainGame.classList.toggle("hidden");
    startTimer();
})

restartBtn.addEventListener("click", function () {
    newGame();
})

newGameBtn.addEventListener("click", function () {
    gameOverModal.classList.toggle("hidden");
    mainGame.classList.toggle("hidden");
    newGame();
})
