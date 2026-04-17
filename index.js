#!/usr/bin/env node

import chalk from "chalk";
import { select, input } from "@inquirer/prompts";

const questions = [
  { question: "Which is the tallest mountain in the world?", answer: "Mt Everest" },
  { question: "Which Ocean borders Kenya", answer: "Indian Ocean" },
  { question: "How many colors does the Kenyan flag have", answer: "five" }
];

const results = [];

// function to start the game, gives user option to start game, read instructions or quit
async function startGame() {
  console.log(chalk.blue("\n Welcome to Trivia Game\n"));

  try {
    const choice = await select({
      message: "Menu",
      choices: [
        { name: "Start Game", value: "start" },
        { name: "Instructions", value: "instructions" },
        { name: "Quit", value: "quit" }
      ]
    });

    if (choice === "start") {
      await answerQuiz();
    } else if (choice === "instructions") {
      showInstructions();
      await startGame();
    } else {
      console.log(chalk.yellow("Goodbye!"));
      process.exit(0);
    }

  } catch (error) {
    console.log(chalk.red("An error occurred"));
    process.exit(0);
  }
}
// Instructions 
function showInstructions() {
  console.log(chalk.green("\n Instructions:\n"));
  console.log("Answer questions by typing and pressing Enter.");
  console.log("You have 30 seconds to complete the quiz.");
  console.log("For answers requiring a number, write in words eg. one instead of 1.")
  
}

// functionality to enable user answer quiz
async function answerQuiz() {
  results.length = 0;

  let timeUp = false;
  // set timer to end quiz after 30 seconds
  // Prints a message when time is up
  const timer = setTimeout(() => {
    timeUp = true;
    console.log(chalk.red("\n Time's up!\n"));
  }, 30000);

  try {
    for (const quiz of questions) {
      if (timeUp) break;

      const answer = await input({
        message: quiz.question
      });
      // edge case:capital letters and spaces
      const isCorrect =
        answer.trim().toLowerCase() === quiz.answer.toLowerCase();
      // immediate feedback to user after every quiz
      if (isCorrect) {
        console.log(chalk.green("Correct!\n"));
      } else {
        console.log(chalk.red("Incorrect!\n"));
      }
      // store each result in the array
      results.push({
        question: quiz.question,
        userAnswer: answer,
        correctAnswer: quiz.answer,
        isCorrect
      });
    }
  } catch (error) {
    console.log(chalk.red("An error occurred."));
  }

  clearTimeout(timer);

  showResults();
  console.log(chalk.yellow("Congratulations! Game ended"))
}
// results: plus total score
function showResults() {
  console.log(chalk.blue("\n RESULTS \n"));

  for (const result of results) {
    console.log(result.question);

    if (result.isCorrect) {
      console.log(chalk.green("Correct"));
    } else {
      console.log(chalk.red(`Incorrect (Answer: ${result.correctAnswer})`));
    }

    console.log("");
  }

  const score = results.reduce((total, result) => {
    if (result.isCorrect) {
      return total + 1;
    } else {
      return total;
    }
  }, 0);

  console.log(chalk.yellow(`Score: ${score}/${results.length}\n`));
}

startGame();