const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
let currentAttempt = 0;
let currentGuess = [];
let wordList = [];
let WORD = "";

const rows = document.querySelectorAll("#wordle > div");
const buttons = document.querySelectorAll("#keys button");
const keyMap = {};

buttons.forEach(button => {
    keyMap[button.innerText] = button;
});

async function loadWords() {
    try {
        const response = await fetch("words.txt");
        const text = await response.text();
        wordList = text.split("\n").map(word => word.trim().toUpperCase()).filter(word => word.length === WORD_LENGTH);
        WORD = wordList[Math.floor(Math.random() * wordList.length)];
        console.log("Secret Word:", WORD);
    } catch (error) {
        console.error("Error loading words:", error);
    }
}

function updateDisplay() {
    const inputs = rows[currentAttempt].querySelectorAll("input");
    inputs.forEach((input, index) => {
        input.value = currentGuess[index] || "";
    });
}

function handleInput(letter) {
    letter = letter.toUpperCase();

    if (letter === "ENTER") {
        if (currentGuess.length === WORD_LENGTH) {
            validateGuess();
        }
        return;
    }

    if (letter === "BACKSPACE" || letter === "DELETE") {
        currentGuess.pop();
    } else if (currentGuess.length < WORD_LENGTH && /^[A-Z]$/.test(letter)) {
        currentGuess.push(letter);
    }

    updateDisplay();
}

function validateGuess() {
    const guessedWord = currentGuess.join("");

    if (!wordList.includes(guessedWord)) {
        alert("❌ Invalid word! Try again.");
        return;
    }

    checkGuess();
}

function checkGuess() {
    const inputs = rows[currentAttempt].querySelectorAll("input");

    for (let i = 0; i < WORD_LENGTH; i++) {
        const letter = currentGuess[i];
        const button = keyMap[letter];

        if (letter === WORD[i]) {
            inputs[i].style.backgroundColor = "green";
            button.style.backgroundColor = "green";
        } else if (WORD.includes(letter)) {
            inputs[i].style.backgroundColor = "orange";
            if (button.style.backgroundColor !== "green") {
                button.style.backgroundColor = "orange";
            }
        } else {
            inputs[i].style.backgroundColor = "gray";
            if (button.style.backgroundColor !== "green" && button.style.backgroundColor !== "orange") {
                button.style.backgroundColor = "gray";
            }
        }
    }

    if (currentGuess.join("") === WORD) {
        setTimeout(() => alert("🎉 Congratulations! You guessed the word!"), 200);
        disableButtons();
        return;
    }

    currentGuess = [];
    currentAttempt++;

    if (currentAttempt === MAX_ATTEMPTS) {
        setTimeout(() => alert(`❌ Game Over! The word was ${WORD}`), 200);
        disableButtons();
    }
}

function disableButtons() {
    buttons.forEach(button => button.disabled = true);
}

document.addEventListener("keydown", (event) => {
    handleInput(event.key);
});

buttons.forEach(button => {
    button.addEventListener("click", () => handleInput(button.innerText));
});

loadWords();
