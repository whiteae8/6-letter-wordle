
const NUMBER_OF_GUESSES = 6;
let guessesRemaining = 7;
let nextLetter = 0;
let currentGuess = [];
let solution = getSol();
let letterColor = '';
let greenCount = 0;

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

function getSol() {
  //const f = require('fs');
 // var solutions = fs.readFileSync('./CLionProjects/6letterwordle/txt/possible-solutions.txt').toString().split("\n");
 
  const solutions = new Array("access", "bronze", "celery", "domain", "doctor", "escape", "flight", "forest", "genius", "ground", "helmet", "infect", "jacket", "kidnap", "leader", "lizard", "magnet", "meadow", "orange", "parent", "phrase", "quiver", "riddle", "sample", "shriek", "sister", "splash", "thirst", "ticket", "unless", "valley", "vision", "waffle", "wallet", "yellow", "zipper");
  const min = Math.ceil(0);
  const max = Math.floor(solutions.length);
  const number = Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  alert(solutions[number]);
  return solutions[number];
}


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
   for (var i = 0; i < 6; ++i) {
      const tiles = document.getElementsByClassName('tile');
      let element = tiles[i + (6*row)];
      let button = document.querySelector(`button[data-key="${currentGuess[i]}"]`);
      letterColor = checkChar(currentGuess[i], i, row);
      (function(i, letterColor) {
        setTimeout(() => {
          element.style.backgroundColor = letterColor;
          //alert(`letterColor: ${letterColor} solution.indexOf(currentGuess[i]): ${solution.indexOf(currentGuess[i])} button.style.backgroundColor: ${button.style.backgroundColor}next`);
          
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
          return;
      }
      else if(guessesRemaining === 0) {
          alert("You Lose!");
          return;
      }
      nextLetter = 0;
      currentGuess = [];
   }, 1500); // Delay before displaying the "You Win!" alert
   
   return;
}

function checkChar(letter, pos, row) {
   if(solution[pos] === letter) {
       letterColor = '#5FB25A';
       return letterColor;
   } else if (solution.indexOf(letter) === -1) {
       letterColor = 'DarkGray';
       return letterColor;
   } else {
       letterColor = rightLetterWrongSpot(letter, pos, row);
       return letterColor;
   } 
   return letterColor;
}

function rightLetterWrongSpot(letter, guessPos, row) { //guesspos = 4
  let occurencesInSol = []; // 4 
  let occurencesInGuess = [];// 2 3
  let intersection = []; 
  let count = 0;
 
  for(var i = 0; i < 6; ++i) {
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
    for(var i = 0; i < occurencesInGuess.length; ++i) {
     //  num = occurencesInSol.indexOf(occurencesInGuess[i], i);
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
