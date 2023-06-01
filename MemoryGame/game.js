
//head//
const form_cards_number = document.getElementById("change-cards-number");
const inputNumber = document.getElementById("inputNumber");

//table//
const score_el = document.getElementById("scores");
const scoreTable = document.getElementById("body-table");
const reset_table_el = document.getElementById("reset-table");

//game buttons and input's//
const formHead = document.getElementById("head-container");
const form_countdown = document.getElementById("countdown");
const form_clock = document.getElementById("clock");
const form_start_game = document.getElementById("form-start-game-button");

const timer = document.getElementById("timer");
const pairs_el = document.getElementById("pairs");

const submitButton = document.getElementById("start-game-button");

//cards//
const cardsClass = document.getElementById("cards");
const cards = document.querySelectorAll(".card col-lg-2 col-md-3 col-sm-3");


// LOCAL STORAGE GETER'S \\
let cardsnumber = JSON.parse(localStorage.getItem('num_cards')) * 2;
var playCount = JSON.parse(localStorage.getItem('playCount'));
let sizeLocalList = JSON.parse(localStorage.getItem("sizeLocalList"));
var tableMemory = JSON.parse(localStorage.getItem("tableMemory"));

const nameplayer = localStorage.getItem("name").toLocaleUpperCase();


let winScores = [];
let listCards = [];


const headline = `${nameplayer} 🤓`; //the title of the headline\\

changeHeadline(headline); //display the headline to the name of the player 
document.getElementById("num-cards").innerText = cardsnumber;//display the number of cards



// initial time \\
let seconds = 0, minutes = 0;
// initial moves and win count \\
let moveCount = 0;
// rows counter \\
let rowCounter = 0;

let num = cardsnumber / 2;
let mapCards = new Map();//map to the cards value


//initial index array //
let arr = [num];
for (let i = 0; i < num; i++) {
    arr[i] = i + 1;
}

var interval;

//variables to the game logic
let matched = 0;
let clicks = 0;
let cardOne, cardTwo;
let disableDeck = false;


//-----------

getGame();


// ----------


// FUNCTIONS \\

function getGame() {
    getGamesTableScore();
    renderCards();
}

// save to local storage \\
function saveGame() {
    saveCardsList();
    saveGameScore();
}



// start the game fuunction \\
function gameStart() {
    button_start.value = "Stop Game";
    createBoard();
    changeHeadline(headline)
}


function startClockGame() {
    gameStart();
    interval = setInterval(timeGenerator, 1000);
}

function startBackTimerGame() {
    gameStart();
    interval = setInterval(timeBackGenerator, 1000);

}

// end the game function \\
function endGame() {
    deleteStartGameButton();
    deleteCountdown();
    clearInterval(interval);
    saveGameScore(playCount, timer.value);
    addRow(playCount, parseInt(pairs_el.value), timer.value);
    removeCardsList();
    cardsClass.innerHTML = "";
    mapCards.clear();
    timer.value = "00:00";
    seconds = 0; minutes = 0;
    listCards = [];
    pairs_el.value = 0;
}


// win function \\
function win() {
    if (num == pairs_el.value) {
        console.log("you win!");
        setTimeout(() => {
            shuffleCard();
            endGame();
        }, 400);
        changeHeadline(`YOU WIN! 🤗`);
        return;
    }

}



//return the game scores table from the local storage 
function getGamesTableScore() {
    for (let i = 1; i <= playCount; i++) {
        const timeplay = getPlayScore(i);
        addRow(i, pairs_el.value, timeplay);
    }
}

function getPlayScore(id) {
    const result = JSON.parse(localStorage.getItem(`"game-${id}"`));
    console.log(result);
    return result;
}


//save game time to the local storage \\
function saveGameScore(id, time) {
    localStorage.setItem(`"game-${id + 1}"`, JSON.stringify(time));
    playCount++;
    localStorage.setItem("playCount", JSON.stringify(playCount));
}


//remove game time from the local storage \\
function removeGameScore(id) {
    localStorage.removeItem(`"game-${id}"`);
    --playCount;
    window.localStorage.setItem("playCount", JSON.stringify(playCount));
}


//gets from the local storage the list of saved card
function getListCards() {
    let size = localStorage.getItem("sizeLocalList");
    let list = [];
    for (let i = 0; i < size; i++) {
        let card = localStorage.getItem(`"card-${i}"`).split(",");
        const cardPic = card[1];
        const id = card[0];
        const stringhtmlCard = `<div class="view front-view">
                                           ❔
                                 </div>
                                 <div class="view back-view">
                                 ${cardPic}
                                </div>`;

        const newCard = document.createElement("div");
        newCard.className = "card col-lg-auto col-md-auto col-sm-auto";
        newCard.id = id;
        newCard.innerHTML = stringhtmlCard;
        list.push(newCard);

    }
    return list;
}


//saving the list cards \\
function saveCardsList() {
    let sizeLocalList = 0;
    for (let i = 0; i < listCards.length; i++) {
        const card = listCards[i];
        saveCard(i, card.id, card.innerText);
        sizeLocalList++;
    }
    localStorage.setItem("sizeLocalList", JSON.stringify(sizeLocalList));
}


// save a card to the local storage \\
function saveCard(index, id, value) {
    localStorage.setItem(`"card-${index}"`, JSON.stringify(id) + "," + `${value}`);
}


// removing the cards list values local storage \\
function removeCardsList() {
    for (let i = 0; i < sizeLocalList; i++) {
        removeCard(i);
    }
}


// remove card from the local storage \\
function removeCard(index) {
    localStorage.removeItem(`"card-${index}"`);
    --sizeLocalList;
    localStorage.setItem("sizeLocalList", JSON.stringify(sizeLocalList));
}


//remove local storage \\
function removeLocal() {
    removeCardsList();
    for (let i = 1; i <= playCount; i++) {
        removeGameScore(i);
    }
}


// changing the headline title \\
function changeHeadline(string) {
    document.getElementById("name-player").innerHTML = string;
}



// createBoard cards;
function createBoard() {
    //create cards by the size of the player 
    for (let i = 0; i < num; i++) {
        createCard();
    }
    listCards.sort(() => Math.random() > 0.5 ? 1 : -1);
    saveCardsList();
    renderCards();
}


//create random card from the elements\\
function createCard() {
    // Returns a random integer from 1 to 15:
    let num = Math.floor(Math.random() * 30) + 1;
    while (mapCards.has(num)) {
        num = Math.floor(Math.random() * 30) + 1;
    }
    mapCards.set(num);
    const cardPic = tableMemory[num - 1];

    const stringhtmlCard = `<div class="view front-view">
                                ❔
                            </div> 
                            <div class="view back-view " >
                            ${cardPic}
                           </div>`;

    const newCard1 = document.createElement("div");
    const newCard2 = document.createElement("div");
    newCard1.className = "card col-lg-auto col-md-auto col-sm-auto";
    newCard2.className = "card col-lg-auto col-md-auto col-sm-auto";
    newCard1.id = num;
    newCard2.id = num;
    newCard1.innerHTML = stringhtmlCard;
    newCard2.innerHTML = stringhtmlCard;
    listCards.push(newCard1);
    listCards.push(newCard2);

}

// render the cards to the screen \\
function renderCards() {
    cardsClass.innerHTML = "";
    console.log("at render");
    if (listCards.length > 0) {
        listCards.forEach((node) => {
            if (node.className === "card col-lg-auto col-md-auto col-sm-auto") {
                cardsClass.appendChild(node);
            }

        });
    }
    console.log(listCards);

}


// create timer generator for clock play\\
const timeGenerator = () => {
    seconds += 1;
    if (seconds >= 60) {
        minutes += 1;
        seconds = 0;
    }
    // format time beffor displaying //
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    timer.value = `${minutesValue}:${secondsValue}`;
}

const timeBack = document.getElementById("timer-back");

let valueTime = "";
function timerBack(min, sec) {
    valueTime = `${min}:${sec}`;
    console.log("log in to timer back()");
    seconds = sec;
    minutes = min;

}


const timeBackGenerator = () => {

    seconds--;
    if (seconds == 0 && minutes == 0) {
        timer.value = "00:00";
        endGame();
    }
    if (seconds <= 0) {
        minutes--;
        seconds = 60;
    }
    // format time beffor displaying //
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    timer.value = `${minutesValue}:${secondsValue}`;

}


//flip a card the card function \\
function flipCard(clickedCard) {
    if (cardOne !== clickedCard && !disableDeck) {
        clickedCard.classList.add("flip");

        if (!cardOne) {
            return cardOne = clickedCard;
        }
        cardTwo = clickedCard;
        disableDeck = true;
        let cardOneImg = cardOne.querySelector(".back-view").innerHTML,
            cardTwoImg = cardTwo.querySelector(".back-view").innerHTML;
        matchCards(cardOneImg, cardTwoImg);

    }
}


// dnction to check 2 cards are mach \\
function matchCards(id1, id2) {
    if (id1 === id2) {
        matched++;
        let pairs = pairs_el.value;
        pairs++;
        pairs_el.value = pairs;
        win();
        if (matched === num) {
            setTimeout(() => {
                return shuffleCard();
            }, 1000);
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        saveCardsList();
        return disableDeck = false;

    }
    setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 400);
    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = "";
        disableDeck = false;
    }, 1200);
}


// function to shuffle the cards to the back side \\
function shuffleCard() {
    matched = 0;
    disableDeck = false;
    cardOne = cardTwo = "";
    arr.sort(() => Math.random() > 0.5 ? 1 : -1);
    cards.forEach((card, i) => {
        card.classList.remove("flip");
        let value = card.querySelector(".back-view").innerHTML;
        value = `tableMemory[${arr[i]}]`;
        card.addEventListener("click", flipCard);
    });
}
shuffleCard();



// Add a new row to the table score game winsSores
function addRow(i, pairs, time) {
    if (!pairs) {
        pairs = 0;
    }
    const stringhtml = `
    <td class="col">Game ${i}</td>
    <td class="col">${pairs}</td>
    <td class="col">${time}</td>
     `
    const newRow = document.createElement("tr");
    newRow.className = "row";
    newRow.id = playCount;
    newRow.innerHTML = stringhtml;
    winScores.push(newRow);
    scoreTable.appendChild(newRow)
    renderTable();

}


// reset the table score \\
function resetTable() {
    let i = 1;
    while (playCount > 0) {
        deleteRow(i);
        i++;
    }
    winScores = [];
}


//delets a row
function deleteRow(i) {
    winScores.splice(i - 1, 1);
    removeGameScore(i);
    renderTable();
}



// render the table game time  \\
function renderTable() {
    scoreTable.innerHTML = "";
    // Todo Tasks
    if (playCount > 0) {
        winScores.forEach((node) => {
            if (node.className === "row") {
                scoreTable.appendChild(node);
            }

        });
    }

}



// Checks for input number qualify for the cards number \\
function inputNumberError() {
    let inputValue = inputNumber.value;
    var number = parseInt(inputValue);
    if (!inputNumber) {
        inputNumber.value = 0;
        alert("You didn't fill in a number");
        return 0;
    }
    if (number > 30) {
        alert("Maximum cards is 30");
        return 0;
    }

}

var countdown_el = null;
//create the countdown submit input
function createCountdown() {
    const countdownButton = document.createElement("input");
    countdownButton.id = "time";
    countdownButton.type = "time";
    countdownButton.title = "place countdown time here";
    countdownButton.className = "input-number";
    form_countdown.appendChild(countdownButton);
    createStartGameButton("countdown");
    countdown_el = countdownButton;
    const submit_buttun_el = form_countdown.getElementsByClassName("submit-button")[0];
    submit_buttun_el.value = "save";//changing the button value to SAVE

}


//delets the countdown submit input
function deleteCountdown() {
    if (countdown_el) {
        console.log("enter delete countdown")
        var submit_buttun_el = form_countdown.getElementsByTagName("input")[0];
        var submit_time_el = form_countdown.getElementsByTagName("input")[1];
        console.log(submit_time_el.value);
        console.log(timer.value);
        timer.value = mathTimeString(submit_time_el.value, timer.value);
        console.log(timer.value);
        submit_buttun_el.value = "countdown";//changing the button value back to countdown;
        form_countdown.removeChild(submit_time_el);
        countdown_el = null;

        // countdown_el = null;
    }
}


// calculate the time for the countdown //
function mathTimeString(time1, time2) {
    console.log("enter math");
    let time_1 = time1.split(":");
    let time_2 = time2.split(":");
    let newTime = [];
    console.log(time_1, time_2);
    time_1[0] = parseInt(time_1[0]);
    time_1[1] = parseInt(time_1[1]);
    time_2[0] = parseInt(time_2[0]);
    time_2[1] = parseInt(time_2[1]);
    console.log(time_1, time_2);
    let timeSec1 = time_1[0] * 60 + time_1[1];
    let timeSec2 = time_2[0] * 60 + time_2[1];
    let calc = timeSec1 - timeSec2;
    console.log(calc);
    let minutes;
    let seconds
    if (calc >= 60) {
        minutes = calc / 60;
        seconds = calc % 60;
    } else {
        minutes = "0";
        seconds = calc;
    }
    console.log(minutes, seconds);
    return `0${minutes}:${seconds}`;

}


//save the countdown value
function saveCountdown(target) {
    console.log("save countdown function");
    value = document.getElementById("time").value;
    console.log(value);
    var time = JSON.stringify(value).slice(1).split(":");
    console.log(time);
    let minutesBack = parseInt(time[0]);
    let secondsBack = parseInt(time[1]);
    console.log(minutesBack, secondsBack);
    if ((!minutesBack && minutesBack != 0) || (!secondsBack && secondsBack != 0)) {

        alert("you need to fill the timer numbers");
        return;
    }
    timerBack(minutesBack, secondsBack);
}


// create and display a START GAME button specific to the game(countdown||clock)
var button_start;//a variable that pints the button var
function createStartGameButton(mode) {
    if (!button_start) {
        const startButton = document.createElement("input");
        startButton.className = "start-game-button";
        startButton.type = "submit";
        startButton.value = "Start Game";
        startButton.title = "start the game";
        if (mode === "countdown") {
            startButton.id = "start-game-countdown";
        } else {
            console.log("start-clock-button");
            startButton.id = "start-game-clock";
        }
        form_start_game.appendChild(startButton);
        button_start = startButton;
    }
}


//removes the button START GAME \\
function deleteStartGameButton() {
    form_start_game.innerHTML = "";
    button_start = null;
}


// ------------


// HANDLERS \\


//handle cards number changing \\


form_countdown.addEventListener("click", (e) => {
    e.preventDefault();
    const action = e.target.value;
    console.log(action);
    if (action === "countdown") {
        createCountdown();
        return;

    } else if (action === "save") {
        saveCountdown();
        e.target.value = "saved"
        return;
    }
    else {
        if (action === "saved") {
            e.target.value = "save";
        }
    }

});





form_clock.addEventListener("click", (e) => {
    e.preventDefault();
    deleteCountdown();
    createStartGameButton("clock");
})


form_cards_number.addEventListener("submit", (e) => {
    e.preventDefault();
    const target = e.target;
    if (inputNumberError() === 0) {
        return;
    };
    cardsnumber = parseInt(inputNumber.value);
    document.getElementById("num-cards-div").getElementsByTagName("p")[1].innerHTML = cardsnumber;
    localStorage.setItem("num_cards", JSON.stringify(cardsnumber));
    sizeLocalList = 0
});


//handler the reset table button \\
reset_table_el.addEventListener("click", (e) => {
    e.preventDefault();
    resetTable();
    return;
});


//handler the start game button \\
formHead.addEventListener("submit", (e) => {
    e.preventDefault();
    if (button_start.value === "Start Game" || button_start.value === "Start New") {
        const action = e.target.getElementsByTagName("input")[0].id;
        if (action === "start-game-clock") {
            startClockGame();
        } else {
            startBackTimerGame();
        }
    }
    else {
        endGame();
    }

});


//handele a cards click \\
cardsClass.addEventListener("click", (e) => {
    e.preventDefault();
    const startButton = document.getElementById("start-game-button");
    if (button_start.value === "Stop Game") {
        const target = e.target;
        let value = target.getElementsByClassName("view back-view")[0];
        flipCard(target);
    }
    return;

});





