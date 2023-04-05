let guessesRemaining = 7;
let nextLetter = 0;
let currentGuess = [];
let solution = '';
fetch('../public/words.json')
    .then(response => response.json())
    .then(data => {
        const words = data.words;
        const randomIndex = Math.floor(Math.random() * words.length);
        solution = words[randomIndex];
        console.log(solution);
    });
let letterColor = '';

document.addEventListener("keyup", (e) => {

    if (guessesRemaining === 0) {
        return;
    }

    let pressedKey = String(e.key);
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter();
        return;
    }

    if (pressedKey === "Enter") {
        checkGuess();
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
    if (guessesRemaining === 0 || currentGuess.join('') === solution) {
        return;
    }

    if (val === "Enter") {
        checkGuess();
        return;
    }

    if (nextLetter === 6) {
        return;
    }

    if (val === "backspace" && nextLetter !== 0) {
        deleteLetter();
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
            alert("You Win!");
            console.log("You win!");
            return;
        }
        else if(guessesRemaining === 0) {
            console.log("You lose!");
            alert("You Lose!");
            return;
        }
        nextLetter = 0;
        currentGuess = [];
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
    let occurencesInSol = []; // 4
    let occurencesInGuess = [];// 2 3
    let intersection = [];
    let count = 0;

    for(let i = 0; i < 6; ++i) {
        if(solution[i] === letter) {
            occurencesInSol.push(i);
        }
        if(currentGuess[i] === letter) {
            occurencesInGuess.push(i);
            if(solution[i] === letter) {
                intersection.push(i);

            }
        }
    }

    if(occurencesInGuess.length <= occurencesInSol.length) {
        letterColor = '#EAD554';
        return letterColor;
    }
    //more occurences in guess than solution
    if(occurencesInSol.length === intersection.length) {
        //got letters in the right spot already
        letterColor = 'DarkGray';
        return letterColor;
    }
    let index = 6;
    for(let i = 0; i < occurencesInGuess.length; ++i) {
        if(intersection.indexOf(occurencesInGuess[i]) === -1) {
            count += 1;
            if(occurencesInGuess[i] === guessPos) {
                index = count;
            }
        }
    }

    if(index <= occurencesInSol.length - intersection.length) {
        letterColor = '#EAD554';

    } else {
        letterColor = 'DarkGray';
    }
    return letterColor;
}
