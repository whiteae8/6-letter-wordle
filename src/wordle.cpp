//
// Created by ashley white on 1/20/22.
//
#ifndef INC_6LETTERWORDLE_WORDLE_CPP
#define INC_6LETTERWORDLE_WORDLE_CPP

#include "../include/wordle.h"
#include <algorithm>
#include <cstdint>
#include <fstream>
#include <iostream>
#include <iterator>
#include <numeric>
#include <stdexcept>
#include <string>
#include <vector>

Wordle::Wordle() : wordWasGuessed(false) {
    std::string filename = "possible-solutions.txt";
    loadFromFile("../txt/" + filename);
}

void Wordle::printIntro() {
    std::cout << "Enter a 6 letter word to guess!" << std::endl;
    std::cout << "_ means incorrect letter." << std::endl;
    std::cout << "+ means right letter wrong position." << std::endl;
    std::cout << "* means right letter right position!" << std::endl;
    std::cout << "You get 6 guesses. Once you get the output, guess again!"
              << std::endl;
}

void Wordle::loadFromFile(std::string filename) {
    std::ifstream in(filename);
    std::string str;
    // Read the next line from File until it reaches the end.
    while (std::getline(in, str)) {
        if (str.size() > 0) // String exists
            words.push_back(str);
    }
}

void Wordle::setSolution() {
   srand(time(0));
   int index = rand() % 990;
   solution = words[index];
}

std::string Wordle::getSolution() { return solution; }

bool Wordle::isValidGuess(std::string guess) {
    if (guess.size() != WORD_LENGTH) {
        return false;
    }
    char *end = letters + 26;
    for (int i = 0; i < WORD_LENGTH; ++i) {
        char *position = std::find(letters, end, guess[i]);
        if (position == end) {
            return false;
        }
    }
    return true;
}

std::string Wordle::newGuess() {
    std::string guess;
    std::cin >> guess;
    while (!isValidGuess(guess)) {
        std::cout << "Guesses must be 6 letter words!\nRetry" << std::endl;
        std::cin >> guess;
    }
    guesses.push_back(guess);
    return checkGuess(guess);
}

std::string Wordle::checkGuess(std::string guess) {
    std::string output = "";
    for (size_t i = 0; i < WORD_LENGTH; ++i) {
        output += checkChar(guess[i], i);
    }
    outputs.push_back(output);

    if (output == "******") {
        wordWasGuessed = true;
    }
    return output;
}

char Wordle::checkChar(char guessChar, size_t guessPos) {
    size_t occur = std::count(solution.begin(), solution.end(), guessChar);
    size_t occurInGuess =
            std::count(guesses.back().begin(), guesses.back().end(), guessChar);
    if (occur == 0) {
        return '_';
    }

    size_t pos = solution.find(guessChar);
    std::vector<size_t> occurences;
    while (pos < WORD_LENGTH) {
        if (pos == guessPos) {
            return '*'; // right letter right spot
        }
        occurences.push_back(pos);
        pos = solution.find(guessChar, pos + 1);
    }

    if (occurInGuess <= occurences.size()) {
        return '+'; // char not in the right position(s)
    }
  // helper function for when there are more occurences of char in guess than solution
   return rightLetterWrongSpot(guessChar, guessPos, occurences);
}

bool Wordle::rightLetterRightSpot(char guessChar, size_t guessPos) {
    size_t pos = solution.find(guessChar);
    while (pos < WORD_LENGTH) {
        if (pos == guessPos) {
            return true; // found the right pos
        }
        pos = solution.find(guessChar, pos + 1);
    }
    return false;
}

char Wordle::rightLetterWrongSpot(char guessChar, size_t guessPos,
                                  std::vector<size_t> occurences) {
    // char guess repeats in string guess > char guess repeats in solution
    std::vector<size_t> guessOccurences;
    size_t cur = guesses.back().find(guessChar);
    while (cur < WORD_LENGTH) {
        guessOccurences.push_back(cur);
        cur = guesses.back().find(guessChar, cur + 1);
    }

    std::vector<size_t> intersection;
    std::set_intersection(
            occurences.begin(), occurences.end(),
            guessOccurences.begin(), guessOccurences.end(),
            std::back_inserter( intersection )
    );
    if(intersection.size() == occurences.size()) { // right letter right spot already accounted for
        return '_';
    }
    auto iter = find(guessOccurences.begin(), guessOccurences.end(), guessPos);
    size_t index = iter - guessOccurences.begin();

    if(index < occurences.size() - intersection.size()) {
        return '+';
    } else {
        return '_';
    }
}

size_t Wordle::getNumGuesses() { return guesses.size(); }

bool Wordle::checkStatus() { return wordWasGuessed; }

void Wordle::printResults() {
    for (size_t i = 0; i < guesses.size(); i++) {
        std::cout << guesses[i] << " " << outputs[i] << std::endl;
    }
}

#endif // INC_6LETTERWORDLE_WORDLE_CPP