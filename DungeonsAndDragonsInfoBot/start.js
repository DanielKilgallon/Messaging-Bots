'use strict';
const fs = require('fs');
const request = require('request');
const Telegraf = require('telegraf');
const d20 = require('d20');

const botkeys = require('../botkeys.json');
const bot = new Telegraf(botkeys.DungeonsAndDragonsInfoBotKey, {username: 'DungeonsAndDragonsInfoBot'});

var spells = JSON.parse(fs.readFileSync('./Files/Spells.json', 'utf8'));
var conditions = JSON.parse(fs.readFileSync('./Files/Conditions.json', 'utf8'));
var damageTypes = JSON.parse(fs.readFileSync('./Files/Damage-Types.json', 'utf8'));
var equipment = JSON.parse(fs.readFileSync('./Files/Equipment.json', 'utf8'));
var features = JSON.parse(fs.readFileSync('./Files/Features.json', 'utf8'));
var languages = JSON.parse(fs.readFileSync('./Files/Languages.json', 'utf8'));
var monsters = JSON.parse(fs.readFileSync('./Files/Monsters.json', 'utf8'));
var races = JSON.parse(fs.readFileSync('./Files/Races.json', 'utf8'));
var skills = JSON.parse(fs.readFileSync('./Files/Skills.json', 'utf8'));
var traits = JSON.parse(fs.readFileSync('./Files/Traits.json', 'utf8'));
var weaponProperties = JSON.parse(fs.readFileSync('./Files/Weapon-Properties.json', 'utf8'));

bot.command('weaponproperties', (ctx) => {
	var retVal = "Cannot find weapon property...";
	for(var weaponProperty of weaponProperties) {
		if (weaponProperty.name.trim().toUpperCase() == ctx.message.text.substring(ctx.message.entities[0].length).trim().toUpperCase())  {
			  retVal = weaponProperty.name + "\n";
			  retVal += weaponProperty.desc[0];
		}
	}
	return ctx.reply(retVal);
});

bot.command('traits', (ctx) => {
	var retVal = "Cannot find trait...";
	for(var trait of traits) {
		if (trait.name.trim().toUpperCase() == ctx.message.text.substring(ctx.message.entities[0].length).trim().toUpperCase())  {
			  retVal = trait.name + "\n";
			  retVal += "Races: ";
			  for(var race of trait.races) {
				 retVal += race.name + ",";
			  }
			  retVal += "\n" + trait.desc[0];
		}
	}
	return ctx.reply(retVal);
});

bot.command('skills', (ctx) => {
	var retVal = "Cannot find skill...";
	for(var skill of skills) {
		if (skill.name.trim().toUpperCase() == ctx.message.text.substring(ctx.message.entities[0].length).trim().toUpperCase())  {
			  retVal = skill.name + "\n";
			  retVal += "Ability: " + skill.ability_score.name + "\n";
			  retVal += skill.desc[0];
		}
	}
	return ctx.reply(retVal);
});

bot.command('races', (ctx) => {
	var retVal = "Cannot find race...";
	for(var race of races) {
		if (race.name.trim().toUpperCase() == ctx.message.text.substring(ctx.message.entities[0].length).trim().toUpperCase())  {
			  retVal = race.name + "\n";
			  retVal += "Alignment: " + race.alignment + "\n";
			  retVal += "Size: " + race.size + "\n";
			  retVal += "Speed: " + race.speed;
		}
	}
	return ctx.reply(retVal);
});

bot.command('monsters', (ctx) => {
	var retVal = "Cannot find monster(s)...";
	if (ctx.message.text.substring(ctx.message.entities[0].length).trim().substring(0, 2).toUpperCase() == "CR") {
		retVal = "";
		for(var monster of monsters) {
			if (monster.challenge_rating == ctx.message.text.substring(ctx.message.entities[0].length).trim().substring(2))  {
				  retVal += monster.name + "\n";
				  retVal += "Size: " + monster.size + "\n";
				  retVal += "Tye: " + monster.type + "\n";
				  retVal += "HP: " + monster.hit_points + "\n";
				  retVal += "Armor Class: " + monster.armor_class + "\n";
				  retVal += "---" + "\n";
			}
		}
	} else {
		for(var monster of monsters) {
			if (monster.name.trim().toUpperCase() == ctx.message.text.substring(ctx.message.entities[0].length).trim().toUpperCase())  {
				  retVal = monster.name + "\n";
				  retVal += "Size: " + monster.size + "\n";
				  retVal += "Tye: " + monster.type + "\n";
				  retVal += "HP: " + monster.hit_points + "\n";
				  retVal += "Armor Class: " + monster.armor_class + "\n";
				  retVal += "Challenge Rating: " + monster.challenge_rating;
			}
		}
	}
	return ctx.reply(retVal);
});

bot.command('languages', (ctx) => {
	var retVal = "Cannot find language...";
	for(var language of languages) {
		if (language.name.trim().toUpperCase() == ctx.message.text.substring(ctx.message.entities[0].length).trim().toUpperCase())  {
			  retVal = language.name + "\n";
			  retVal += "Written Script: " + language.script + "\n";
			  retVal += "Speakers: " + language.typical_speakers.toString();
		}
	}
	return ctx.reply(retVal);
});

bot.command('features', (ctx) => {
	var retVal = "Cannot find feature...";
	for(var feature of features) {
		if (feature.name.trim().toUpperCase() == ctx.message.text.substring(ctx.message.entities[0].length).trim().toUpperCase())  {
			  retVal = feature.name + "\n";
			  retVal += feature.desc[0];
		}
	}
	return ctx.reply(retVal);
});

bot.command('equipment', (ctx) => {
	var retVal = "Cannot find equipment...";
	for(var equipmentVal of equipment) {
		if (equipmentVal.name.trim().toUpperCase() == ctx.message.text.substring(ctx.message.entities[0].length).trim().toUpperCase())  {
			  retVal = equipmentVal.name + "\n";
			  retVal += "Weapon Category: " + equipmentVal.weapon_category + "\n";
			  retVal += "Range: " + equipmentVal.weapon_range + "\n";
			  if (equipmentVal.damage) {
				  retVal += "Damage: " + equipmentVal.damage.damage_dice + "\n";
				  retVal += "Damage Type: " + equipmentVal.damage.damage_type.name;
			  }
		}
	}
	return ctx.reply(retVal);
});

bot.command('damagetypes', (ctx) => {
	var retVal = "Cannot find damage type...";
	for(var damageType of damageTypes) {
		if (damageType.name.trim().toUpperCase() == ctx.message.text.substring(ctx.message.entities[0].length).trim().toUpperCase())  {
			  retVal = damageType.name + "\n";
			  retVal += damageType.desc[0];
		}
	}
	return ctx.reply(retVal);
});

bot.command('conditions', (ctx) => {
	var retVal = "Cannot find condition...";
	for(var condition of conditions) {
		if (condition.name.trim().toUpperCase() == ctx.message.text.substring(ctx.message.entities[0].length).trim().toUpperCase())  {
			  retVal = condition.name + "\n";
			  retVal += condition.desc[0];
		}
	}
	return ctx.reply(retVal);
});

bot.command('spells', (ctx) => {
	var retVal = "Cannot find spell...";
	for(var spell of spells) {
		if (spell.name.trim().toUpperCase() == ctx.message.text.substring(ctx.message.entities[0].length).trim().toUpperCase())  {
			  retVal = "Spell: " + spell.name + "\n";
			  retVal += "Casting Time: " + spell.casting_time + "\n";
			  retVal += "Components: " + spell.components + "\n";
			  retVal += "Duration: " + spell.duration + "\n";
			  retVal += spell.desc[0];
		}
	}
	return ctx.reply(retVal);
});

bot.command(['r', 'roll'], (ctx) => {
	try {
		var single = d20.roll(ctx.message.text.substring(ctx.message.entities[0].length).trim());
		var verbose = d20.roll(ctx.message.text.substring(ctx.message.entities[0].length).trim(), true);
		var ret = single + "\n" + verbose;
		return ctx.reply(ret);
	} catch (e) {
		return ctx.reply("improper dice input");
	}
});

bot.command(['start', 'help'], (ctx) => {
  return ctx.reply('Hello, I am the DungeonsAndDragonsInfoBot! Call me 5E for short... check out my commands to see what info I have.');
});

console.log("Starting D&D Info Bot...");
bot.startPolling();

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

readline.on('SIGINT', () => {
  readline.close();
  process.exit(0);
});

readline.on('line', (input) => {
  if (input.trim().toUpperCase() == "STOP") {
	  console.log("Stopping polling");
	  bot.stop();
  } else if (input.trim().toUpperCase() == "START") {
	  console.log("Starting polling");
	  bot.startPolling();
  } else {
	   console.log(`Received: ${input}`);
  }
});

