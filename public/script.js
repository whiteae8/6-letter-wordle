let guessesRemaining = 7;
let nextLetter = 0;
let currentGuess = [];
let solution = '';
let checkingGuess = false;
fetch('https://raw.githubusercontent.com/whiteae8/6-letter-wordle/main/public/words.json')
    .then(response => response.json())
    .then(data => {
        const words = data.words;
        const randomIndex = Math.floor(Math.random() * words.length);
        solution = words[randomIndex];
        console.log(solution);
    });
let letterColor = '';

document.addEventListener("keydown", (e) => {

    if (checkingGuess) {
        return;
    }
    if (guessesRemaining === 0) {
        return;
    }
    let pressedKey = String(e.key);
    if (pressedKey === "Enter") {
        e.preventDefault();
        checkGuess();
        return;
    }

    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter();
        return;
    }

    let found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return;
    } else {
        pressKey(pressedKey.toLowerCase());
    }
});


function deleteLetter () {
    const tiles = document.getElementsByClassName('tile');
    let element = tiles[nextLetter + (6*(7-guessesRemaining)) - 1];
    element.textContent = "";
    nextLetter -= 1;
    currentGuess.pop();
}

function pressKey(val) {
    if (checkingGuess) {
        return;
    }
    if (guessesRemaining === 0) {
        return;
    }

    if (val === "Enter") {
        checkGuess();
        return;
    }

    if (val === "Backspace" && nextLetter !== 0) {
        deleteLetter();
        return;
    }

    if (nextLetter === 6) {
        return;
    }

    let letter = val;

    const tiles = document.getElementsByClassName('tile');
    let element = tiles[nextLetter + (6*(7-guessesRemaining))];
    nextLetter += 1;
    element.textContent = letter;
    currentGuess.push(letter);

}

function checkGuess() {
    if(nextLetter !== 6) {
        return;
    }
    checkingGuess = true;
    let row = 7-guessesRemaining;
    for (let i = 0; i < 6; ++i) {
        const tiles = document.getElementsByClassName('tile');
        let element = tiles[i + (6*row)];
        let button = document.querySelector(`button[data-key="${currentGuess[i]}"]`);
        letterColor = checkChar(currentGuess[i], i);
        (function(i, letterColor) {
            setTimeout(() => {
                element.style.backgroundColor = letterColor;

                if(button.style.backgroundColor !== 'rgb(95, 178, 90)' || letterColor === 'rgb(95, 178, 90)') {
                    if(solution.indexOf(currentGuess[i]) === -1) {
                        button.style.backgroundColor = 'DarkGray';
                    } else if(letterColor !== 'DarkGray') {
                        button.style.backgroundColor = letterColor;
                    }
                }
                element.style.color = 'white';
            }, 250 * i);
        })(i, letterColor);
    }
    guessesRemaining -= 1;
    setTimeout(() => {
        if(currentGuess.join('') === solution) {
            guessesRemaining = 0
            gameEnd("win");
            return;
        }
        else if(guessesRemaining === 0) {
            gameEnd("lose");
            return;
        }
        nextLetter = 0;
        currentGuess = [];
        checkingGuess = false;
    }, 1500); // Delay before displaying the "You Win!" alert
}

function checkChar(letter, pos) {
    if(solution[pos] === letter) {
        letterColor = '#5FB25A';
        return letterColor;
    } else if (solution.indexOf(letter) === -1) {
        letterColor = 'DarkGray';
        return letterColor;
    } else {
        letterColor = rightLetterWrongSpot(letter, pos);
        return letterColor;
    }
}

function rightLetterWrongSpot(letter, guessPos) { //guesspos = 4
    let occurrencesInSol = []; // 4
    let occurrencesInGuess = [];// 2 3
    let intersection = [];
    let count = 0;

    for(let i = 0; i < 6; ++i) {
        if(solution[i] === letter) {
            occurrencesInSol.push(i);
        }
        if(currentGuess[i] === letter) {
            occurrencesInGuess.push(i);
            if(solution[i] === letter) {
                intersection.push(i);

            }
        }
    }

    if(occurrencesInGuess.length <= occurrencesInSol.length) {
        letterColor = '#EAD554';
        return letterColor;
    }
    //more occurrences in guess than solution
    if(occurrencesInSol.length === intersection.length) {
        //got letters in the right spot already
        letterColor = 'DarkGray';
        return letterColor;
    }
    let index = 6;
    for(let i = 0; i < occurrencesInGuess.length; ++i) {
        if(intersection.indexOf(occurrencesInGuess[i]) === -1) {
            count += 1;
            if(occurrencesInGuess[i] === guessPos) {
                index = count;
            }
        }
    }

    if(index <= occurrencesInSol.length - intersection.length) {
        letterColor = '#EAD554';

    } else {
        letterColor = 'DarkGray';
    }
    return letterColor;
}

function gameEnd(score) {
    // Create the popup container
    let container = document.createElement("div");
    container.classList.add("popup-container");
    let paragraph = document.createElement("p");
    if(score === "win") {
        container.innerHTML = "<h1>You Win!</h1><button class='popup-close'>X</button>";
        paragraph.textContent = "Congratulations, you have won the game!";
    } else {
        container.innerHTML = "<h1>You Lose!</h1><button class='popup-close'>X</button>";
        paragraph.textContent = "Sorry, the correct answer was " + solution;
    }

    // Create the close button
    let button = container.querySelector(".popup-close");

    // Add event listener to the button
    button.addEventListener("click", function() {
        // Remove the popup container and the button from the DOM
        document.body.removeChild(container);
       // document.body.removeChild(button);
        document.body.removeChild(overlay);
    });

    let overlay = document.createElement("div");
    overlay.classList.add("overlay");
    overlay.style.opacity = "0";

    // Append the popup container and the button to the DOM
    document.body.appendChild(overlay);
    document.body.appendChild(container);
    container.appendChild(paragraph);
    container.appendChild(button);

    let fadeIn = setInterval(function () {
        if (overlay.style.opacity > 0.98) clearInterval(fadeIn);
        overlay.style.opacity= parseFloat(overlay.style.opacity,10)+0.05;
        console.log(parseFloat(overlay.style.opacity,10));
    }, 25);
}
