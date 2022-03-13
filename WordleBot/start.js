'use strict';
const fs = require('fs');
const readline = require('readline');
const { Telegraf } = require('telegraf')

const botkeys = require('../botkeys.json');
const bot = new Telegraf(botkeys.WordleFriendBot, { username: 'WordleFriendBot' });
const word_guesses = fs.readFileSync('WordleBot/5-letter-words.txt', 'UTF-8').split(/\r?\n/);
const word_solutions = fs.readFileSync('WordleBot/5-letter-solutions.txt', 'UTF-8').split(/\r?\n/);
let playerMap = new Map();
let restartBool = true;

let playerMessageArray = [];

bot.command('wordle', (ctx) => {
    if (restartBool) {
        const playerArr = playerMap.get(ctx.message.chat.id);
        if (playerArr === undefined) {
            playerMessageArray.push(ctx.message.from.id);
            makeNewGame(ctx);
        } else if (playerArr[0] !== 0) {
            bot.telegram.sendMessage(ctx.message.chat.id, "You've already started a game! Send a word of 5 letters to me and I'll tell you what letters are close!");
        } else {
            makeNewGame(ctx);
        }
    } else {
        console.log(`${ctx.message.chat.username} tried to restart`);
        ctx.reply("Sorry, I need to do a quick update, so you cannot start a new game! Please try again later.");
    }
});

bot.command(['start', 'help'], (ctx) => {
    return ctx.reply('Hello, I am the WordleFriendBot! use /wordle to get started!');
});

bot.command(['rules'], (ctx) => {
    return ctx.reply('Guess the WORDLE in 6 tries.\r\nEach guess must be a valid 5 letter word. send a message to submit.\r\nAfter each guess, the color of the tiles will change to show how close your guess was to the word.');
});

bot.on('text', (ctx) => {
    const playerArr = playerMap.get(ctx.message.chat.id);
    if (playerArr === undefined) {
        console.log(`${ctx.message.chat.id} ${ctx.message.chat.username} is confused!`);
        console.log(ctx.message.text);
        return ctx.reply('You need to use /wordle to start!');
    } else if (playerArr[0] === 0) {
        console.log(`${ctx.message.chat.id} ${ctx.message.chat.username} is angry!`);
        console.log(ctx.message.text);
        return ctx.reply('You ran out of tries! Restart with /wordle!');
    } else {
        const tries = playerArr[0];
        const playerTrueWord = playerArr[1];
        const playerWord = ctx.message.text.toLowerCase();
        if (playerWord.length === 5 && word_guesses.includes(playerWord)) {
            playerMap.set(ctx.message.chat.id, [tries - 1, playerTrueWord]);
            if (playerWord === playerTrueWord) {
                playerMap.set(ctx.message.chat.id, [0, playerTrueWord]);
                console.log(`${ctx.message.chat.id} ${ctx.message.chat.username} won! True Word: ${playerTrueWord}`);
                return ctx.reply(`You got it! The word was ${playerTrueWord}\r\nRestart with /wordle!`);
            } else {
                let output = '';
                for (let i = 0; i < playerWord.length; i++) {
                    let result = '⬛';
                    if (playerTrueWord.includes(playerWord[i])) {
                        result = '🟨';
                    }
                    if (playerTrueWord[i] === playerWord[i]) {
                        result = '🟩';
                    }
                    output += result;
                }
                console.log(`${ctx.message.chat.id} ${ctx.message.chat.username}'s ${tries} guess: ${playerWord} - ${output}. True Word: ${playerTrueWord}`);
                if (tries - 1 === 0) {
                    playerMap.set(ctx.message.chat.id, [0, playerTrueWord]);
                    console.log(`${ctx.message.chat.id} ${ctx.message.chat.username} lost! True Word: ${playerTrueWord}`);
                    return ctx.replyWithMarkdown(`You lost! The word was ${playerTrueWord.toUpperCase()}\r\nYour Word: ${playerWord.toUpperCase()}\r\nScore: ${output}`);
                }
                return ctx.reply(`Remaining Tries: ${tries - 1}\r\nWord: ${playerWord.toUpperCase()}\r\nScore: ${output}`);
            }
        } else {
            console.log(`invalid word detected: ${ctx.message.text}`);
            return ctx.reply(`Invalid word!\r\nWord: ${playerWord.toUpperCase()}`);
        }
    }
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', function (line) {
    if (line === 'restart') {
        restartBool = !restartBool;
        console.log(`restart is ${restartBool}`);
    } else if (line.split(' ')[0] === ('message')) {
        const newline = line.substring(8).trim();
        const sendToPlayer = newline.substring(0, newline.indexOf(' ')).trim();
        const message = newline.substring(newline.indexOf(' ') + 1).trim();
        for (const player in playerMessageArray) {
            if (playerMessageArray[player] == sendToPlayer) {
                bot.telegram.sendMessage(playerMessageArray[player], message);
            }
        }
    } else if (line.split(' ')[0] === ('messageall')) {
        const message = line.substring(11).trim();
        for (const player in playerMessageArray) {
            bot.telegram.sendMessage(playerMessageArray[player], message);
        }
    }
});

function setCurrentWord() {
    return word_solutions[Math.floor(Math.random() * word_solutions.length)];
}

function makeNewGame(ctx) {
    bot.telegram.sendMessage(ctx.message.chat.id, "Let's start! Send a word of 5 letters to me and I'll tell you what letters are close!");
    const playerTrueWord = setCurrentWord();
    playerMap.set(ctx.message.chat.id, [6, playerTrueWord]);
    console.log(`${ctx.message.chat.id} ${ctx.message.chat.username} started with ${playerTrueWord}`);
}

console.log("Starting Wordle Friend Bot...");
bot.launch();