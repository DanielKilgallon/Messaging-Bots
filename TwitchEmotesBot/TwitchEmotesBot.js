'use strict';
const fs = require('fs');
const request = require('request');
const Telegraf = require('telegraf');

const botkeys = require('../botkeys.json');
const bot = new Telegraf(botkeys.TwitchBotKey, {username: 'TwitchEmotesBot'});

var emotes;
var url = 'https://api.twitchemotes.com/api/v4/emotes';
var emote_image_url = "https://static-cdn.jtvnw.net/emoticons/v1/";

request.get(url, (error, response, body) => {
    if (!error && response.statusCode === 200)
      emotes = JSON.parse(body);
    else
      console.log("error with twitchemotes api: " + error);
});

bot.command(['start', 'help'], (ctx) => {
  return ctx.reply('Hello, I am the Twitch Emotes Bot! I will send back stickers of popular twitch emotes given their emote-name in any chat I am in. Type \'/responses\' for a list.');
});

bot.command('responses', (ctx) => {
  return ctx.reply('This bot responds to all global twitch emotes!');
});

bot.on('text', ctx => {
  var message = ctx.message.text;
  if (emotes) {
    var emote = emotes[message];
    if (emote) {
      var emote_image = emote_image_url + emote.id + "/3.0";
	  console.log(ctx.message.from.username + " said " + message);
      ctx.replyWithPhoto(emote_image).catch(error => { console.log('caught error for ' + message + "." +  emote_image); });
    }
  }
});

console.log("Starting Twitch Bot...");
bot.startPolling();
