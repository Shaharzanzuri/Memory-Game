
const formData = document.getElementById("submit-wellcom");
const inputText = document.getElementById("inputText");
const inputNumber = document.getElementById("input-num-cards");

localStorage.clear();

// welcom page submit handler \\
formData.addEventListener("submit", (e) => {
    e.preventDefault();
    if (inputTextError() === 0 || inputNumberError() === 0) {
        return;
    }
    var winScores = [];
    var listCards = [];


    var tableMemory = [
        "🌷", "🧚🏼", "👑", "🦋", "👽",
        "🐲", "🐩", "🕸️", "🐸", "🧞‍♀️",
        "🧝🏻‍♀️", "🧠", "🤖", "👾", "👻",
        "🤡", "☠️", "🍬", "🍓", "🍎",
        "🌈", "🌊", "🍌", "🍒", "🐚",
        "🍄", "🍁", "🌿", "🌲", "🐉",
    ]


    localStorage.setItem('name', JSON.stringify(inputText.value));//saving the name in local storage
    localStorage.setItem('num_cards', JSON.stringify(inputNumber.value));//saving the numbers of cards to local storage
    localStorage.setItem('winScores', JSON.stringify(winScores));
    localStorage.setItem('listCards', JSON.stringify(listCards));
    localStorage.setItem('playCount', "0");
    localStorage.setItem('tableMemory', JSON.stringify(tableMemory));
    window.location.href = 'game.html';


});





// Checks for input number qualify
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
    // return;
}

// Checks for input text qualify
function inputTextError() {
    let inputValue = inputText.value;
    if (!inputValue) {
        inputText.value = "";
        alert("You didn't fill in the text");
        return 0;
    }
    // return;

}

