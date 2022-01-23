//
// Created by ashley white on 1/20/22.
//

#ifndef INC_6LETTERWORDLE_WORDLE_H
#define INC_6LETTERWORDLE_WORDLE_H

#include <algorithm>
#include <iostream>
#include <stdexcept>
#include <string>
#include <vector>
//#include "Word_Archive.h"

class Wordle {
public:
    const size_t WORD_LENGTH = 6;

    /**
     * default ctor: initializes Wordle object by loading database of possible
     * solutions
     * @post word archive loaded
     */
    Wordle();

    /**
     * printIntro() prints intro statements + rules
     */
    void printIntro();

    /**
     * loadFromFile: Reinitializes database from text file
     * @pre    File represents valid list of 6 letter words
     * @param  filename  Name of file
     * @post   Object reinitialized with new puzzle
     */
    void loadFromFile(std::string filename);

    /**
     * setSolution: creates solution for current puzzle
     * @post solution is generated for current puzzle
     */
    void setSolution();

    /**
     * getSolution: get solution for current puzzle
     * @return solution for current puzzle
     */
    std::string getSolution();

    /**
     * isValidGuess: Checks if input is a 6 letter word
     * @param  guess: user inputted guess
     * @return true if guess is a 6 letter word, false if not
     */
    bool isValidGuess(std::string guess);

    /**
     * newGuess: takes user input and turns it into a guess, repeating prompt if
     * input is not a 6 letter word, then calls checkGuess to check current guess against solution
     * @post guess is a valid 6 letter word
     * @return 6 letter output string returned by checkGuess is printed
     */
    std::string newGuess();

    /**
     * makeGuess: checks guess against solution and sends output
     * @pre guess is a valid 6 letter word
     * @param  guess: 6 letter string representing user inputted guess
     * @return 6 letter output string of _, +, or * depending on correctness of
     * characters in guess
     */
    std::string checkGuess(std::string guess);

    /**
     * checkChar: checks individual characters of guess for value and position in
     * solution
     * @param  guessChar: char representing current character to search for in
     * solution
     * @param guessPos: position of guess char
     * @return '_' if guess char is not in solution, '+' if guess is right letter
     * wrong spot, or '*' if guess is right letter right spot
     */
    char checkChar(char guessChar, size_t guessPos);

    /**
     * rightLetterRightSpot
     * @pre  guessChar occurs at least once in solution
     * @param guessChar: char representing current character to search for in
     * solution
     * @param guessPos: position of char guess
     * @param occurences: size_t number of occurences of guess char in solution
     * @return true if guess is right letter right spot
     */
    bool rightLetterRightSpot(char guessChar, size_t guessPos);

    /**
     * rightLetterWrongSpot: called by checkChar, helper function for solutions
     * with repeat letters
     * @pre  guessChar occurs at least once in solution and is not in the right
     * spot
     * @param guessChar: char representing current character to search for in
     * solution
     * @param guessPos: position of char guess
     * @param occurences: size_t number of occurences of guessChar in solution
     * @param occInGuess: size_t number of occurences of guessChar in guess
     * @return false true if guess is right letter wrong spot, or '_' if guessChar
     * is an extra occurence of guessChar in the solution
     */
    char rightLetterWrongSpot(char guessChar, size_t guessPos, std::vector<size_t> occurences
                              );

    /**
     * getNumGuesses: returns number of guesses made so far
     * @return number of guesses made
     */
    size_t getNumGuesses();

    /**
     * checkStatus: check if puzzle is solved
     * @return true if puzzle is solved, false if not
     */
    bool checkStatus();

    /**
     * printResults: print list of guesses and outputs side by side
     */
    void printResults();

private:
    std::vector<std::string> words;

    std::string solution;
    std::string solDoubleLetters;

    std::vector<std::string> guesses;
    std::vector<std::string> outputs;

    bool wordWasGuessed;

    char letters[26] = {'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
                        'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
                        's', 't', 'u', 'v', 'w', 'x', 'y', 'z'};
};

#endif // INC_6LETTERWORDLE_WORDLE_H
