#include "../include/wordle.h"
#include <fstream>
#include <iostream>
#include <stdlib.h>
#include <string>
#include <vector>

using namespace std;

int main() {

  Wordle puzzle;

  // function to sort names alphabetically & delete repeats
  // words = alphabaticallySort(words);
  // words = deleteRepeats(words);

  // generate solution
  puzzle.setSolution();
  puzzle.printIntro();

  while (puzzle.getNumGuesses() != 6 &&
         !puzzle.checkStatus()) { // have more guesses and not out of tries
    cout << puzzle.newGuess() << endl;
  }

  if (puzzle.checkStatus()) {
    cout << "Solution (" << puzzle.getSolution() << ") guessed correctly!"
         << endl;
  } else {
    cout << "Out of tries!" << endl;
    cout << "Solution: " << puzzle.getSolution() << "\n" << endl;
  }
  puzzle.printResults();

  return 0;
}
