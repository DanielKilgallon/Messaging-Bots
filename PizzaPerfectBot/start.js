'use strict';
const fs = require('fs');
const { Telegraf } = require('telegraf')

const botkeys = require('../botkeys.json');
const bot = new Telegraf(botkeys.PizzaPerfectBot, {username: 'PizzaPerfectBot'});

bot.command('calculate', (ctx) => {
    bot.telegram.sendMessage(ctx.message.from.id, 'ask your group for a list of toppings')
    console.log(ctx.getChatMembersCount());
});

bot.command(['start', 'help'], (ctx) => {
    return ctx.reply('Hello, I am the PizzaPerfectBot! I can calculate the number of pizzas and the optimal topping. Just use /calculate to get started!');
});

console.log("Starting Pizza Perfect Bot...");
bot.launch();