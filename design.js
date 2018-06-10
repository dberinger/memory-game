/*  TODO:
    -readme
    -comments
*/

/*--------------------------------------------------------------------------*/
/*DECLARATIONS*/
/*--------------------------------------------------------------------------*/
//3 main screens
const welcomeModal = document.getElementById("welcome");
const gameOverModal = document.getElementById("game-over");
const mainGame = document.getElementById("main-game");

//buttons
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const newGameBtn = document.getElementById("new-game-btn");

//will contain user's stats at the end of the game
const stats = document.getElementById("stats-popup");
const stars = document.getElementById("star-container");
//stores number of stars, 3 by default
let starCount = 3;
//moves counter
let moves = 0;
const movesHolder = document.getElementById("moves");
//timer setup
const timer = document.getElementById("timer");
let minutes = 0;
let seconds = 0;
//t for interval
let t;

//card deck - container
const cardDeck = document.getElementById("card-deck");
//collection of all cards
let cards = cardDeck.getElementsByClassName("card");
//temporarily stores only two clicked cards
let open = cardDeck.getElementsByClassName("open");
//collection of cards that match
let matched = cardDeck.getElementsByClassName("matched");
//temporarily stores classes of two clicked cards
let classes = [];
//array with symbols
const symbols = ["anchor", "at", "bicycle", "bug", "camera", "coffee", "dollar-sign", "fighter-jet", "anchor", "at", "bicycle", "bug", "camera", "coffee", "dollar-sign", "fighter-jet"];


/*--------------------------------------------------------------------------*/
/*STAR RATING*/
/*--------------------------------------------------------------------------*/
//removes a star if number of moves is equal to 20 or 35
function starRating() {
    if (moves === 20 || moves === 35) {
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
        //add star(s)
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
/*MAIN GAME LOGIC*/
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

//adds shuffled cards
function addCards(parent, srcArray) {

    shuffle(srcArray);
    //String to hold the html code to be inserted
    let tempStr = "";
    for (let i = 0; i < srcArray.length; i++) {
        tempStr += (`<div class="flip"><div class="card ${srcArray[i]}"><figure class="front face"></figure><figure class="back face"><i class="fas fa-${srcArray[i]}"></i></figure></div></div>`);
    }
    parent.insertAdjacentHTML("afterbegin", tempStr);
}

//handles click events
function clickHandler() {

    for (i = 0; i < cards.length; i++) {

        cards[i].addEventListener("click", function () {
            console.log(classes);
            //counts moves
            movesCounter();
            //rates user with stars
            starRating();
            //display a congratulions popup when all cards match
            setTimeout(gameOver, 5000);

            //toggle classes
            toggleTrio(this, "unmatched", "flipped", "open");
            classes.push(this.className);

            //compare 2 classes from the array
            if (classes.length === 2) {
                //lock card deck
                cardDeck.classList.toggle("locked");
                //on match
                if (classes[0] === classes[1]) {

                    for (i = 1; i >= 0; i--) {
                        toggleTrio(open[i], "matched", "unmatched", "open");
                        classes.length = 0;
                    }
                    //unlock card deck
                    cardDeck.classList.toggle("locked");

                } else {
                    //on mismatch
                    setTimeout(function () {

                        for (i = 1; i >= 0; i--) {
                            toggleTrio(open[i], "unmatched", "flipped", "open");
                        }
                        //unlock card deck
                        cardDeck.classList.toggle("locked");

                    }, 700);

                    classes.length = 0;
                }
            }
        });
    }
}

/*--------------------------------------------------------------------------*/
/*BUTTONS AND RELATED FUNCTIONS*/
/*--------------------------------------------------------------------------*/
//sets new card deck, resets time, stars, rating and moves
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

//stops timer, displays congratulations popup
function gameOver() {
    if (matched.length === 16) {
        stopTimer();
        mainGame.classList.add("hidden");
        stats.innerHTML = `It took you ${minutes} minute(s) and ${seconds} seconds to win the game in ${moves} moves. You've earned ${starCount} star(s).`
        gameOverModal.classList.remove("hidden");
    }
}

//'LET'S PLAY' button
startBtn.addEventListener("click", function () {
    addCards(cardDeck, symbols);
    clickHandler();
    welcomeModal.classList.add("hidden");
    mainGame.classList.toggle("hidden");
    startTimer();
})

//'RESTART' button
restartBtn.addEventListener("click", function () {
    newGame();
})

//'YES!' button
newGameBtn.addEventListener("click", function () {
    gameOverModal.classList.toggle("hidden");
    mainGame.classList.toggle("hidden");
    newGame();
})
