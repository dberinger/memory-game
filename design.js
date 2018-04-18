let startBtn = document.getElementById("start-btn");
let restartBtn = document.getElementById("restart-btn");
let cardDeck = document.getElementById("card-deck");
//collection of all cards
let cards = cardDeck.getElementsByClassName("card");
//temporarily stores only two clicked cards
let open = cardDeck.getElementsByClassName("open");
//temporarily stores classes of two clicked cards
let classes = [];
//move counter
let moves = 0;
const moveHolder = document.getElementById("moves");
//i for use in loops
let i = 0;

//Array with symbols
const symbols = ["anchor", "at", "bicycle", "bug", "camera", "coffee", "dollar-sign", "fighter-jet", "anchor", "at", "bicycle", "bug", "camera", "coffee", "dollar-sign", "fighter-jet"];

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

    for (i; i < cards.length; i++) {

        cards[i].addEventListener("click", function () {

            //increment moves count
            moves++;
            moveHolder.innerHTML = `moves: ${moves}`;

            //toggle classes
            toggleTrio(this, "unmatched", "flipped", "open");
            classes.push(this.className);

            //compare 2 classes from the array
            if (classes.length === 2) {

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

startBtn.addEventListener("click", function(){
    addCards(cardDeck,symbols);
    clickHandler();
})

//document.addEventListener("DOMContentLoaded",)
