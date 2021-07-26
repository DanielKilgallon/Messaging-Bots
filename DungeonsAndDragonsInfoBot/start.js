'use strict';
const fs = require('fs');
const { Telegraf } = require('telegraf')
const d20 = require('d20');

const botkeys = require('../botkeys.json');
const bot = new Telegraf(botkeys.DungeonsAndDragonsInfoBotKey, {username: 'DungeonsAndDragonsInfoBot'});

const spells = JSON.parse(fs.readFileSync('./DungeonsAndDragonsInfoBot/Files/Spells.json', 'utf8'));
const conditions = JSON.parse(fs.readFileSync('./DungeonsAndDragonsInfoBot/Files/Conditions.json', 'utf8'));
const damageTypes = JSON.parse(fs.readFileSync('./DungeonsAndDragonsInfoBot/Files/Damage-Types.json', 'utf8'));
const equipment = JSON.parse(fs.readFileSync('./DungeonsAndDragonsInfoBot/Files/Equipment.json', 'utf8'));
const features = JSON.parse(fs.readFileSync('./DungeonsAndDragonsInfoBot/Files/Features.json', 'utf8'));
const languages = JSON.parse(fs.readFileSync('./DungeonsAndDragonsInfoBot/Files/Languages.json', 'utf8'));
const monsters = JSON.parse(fs.readFileSync('./DungeonsAndDragonsInfoBot/Files/Monsters.json', 'utf8'));
const races = JSON.parse(fs.readFileSync('./DungeonsAndDragonsInfoBot/Files/Races.json', 'utf8'));
const skills = JSON.parse(fs.readFileSync('./DungeonsAndDragonsInfoBot/Files/Skills.json', 'utf8'));
const traits = JSON.parse(fs.readFileSync('./DungeonsAndDragonsInfoBot/Files/Traits.json', 'utf8'));
const weaponProperties = JSON.parse(fs.readFileSync('./DungeonsAndDragonsInfoBot/Files/Weapon-Properties.json', 'utf8'));

function getGeneralInfo(ctx, set, header) {
	var allInfo = header + ":";
	set.forEach(single => {
		allInfo += "\n" + single.name;
	});
	return ctx.reply(allInfo);
}

function findInfo(ctx, set, formatter) {
	var done = false;
	set.forEach(single => {
		if (single.name.trim().toUpperCase() == ctx.message.text.substring(ctx.message.entities[0].length).trim().toUpperCase()) {
			done = true;
			return ctx.reply(formatter(single));
		}
	});
	if (!done) {
		return ctx.reply("Can't find " + ctx.message.text.substring(ctx.message.entities[0].length).trim());
	}
}

function checkAndReturn(ctx, set, formatter, header) {
	if (ctx.message.text.includes(" ")) {
		return findInfo(ctx, set, formatter);
	} else {
		return getGeneralInfo(ctx, set, header)
	}
}

bot.command('weaponproperties', (ctx) => {
	const formatter_function = function(single) {
		var retVal = single.name + "\n";
		retVal += single.desc[0];
		return retVal;
	}
	return checkAndReturn(ctx, weaponProperties, formatter_function, "All Weapon Properties");
});

bot.command('traits', (ctx) => {
	const formatter_function = function(single) {
		var retVal = single.name + "\n";
		retVal += "Races: ";
		for(var race of single.races) {
			retVal += race.name + ",";
		}
		retVal += "\n" + single.desc[0];
		return retVal;
	}
	return checkAndReturn(ctx, traits, formatter_function, "All Traits");
});

bot.command('skills', (ctx) => {
	const formatter_function = function(single) {
		var retVal = single.name + "\n";
		retVal += "Ability: " + single.ability_score.name + "\n";
		retVal += single.desc[0];
		return retVal;
	}
	return checkAndReturn(ctx, skills, formatter_function,"All Skill Names");
});

bot.command('races', (ctx) => {
	const formatter_function = function(single) {
		var retVal = single.name + "\n";
		retVal += "Alignment: " + single.alignment + "\n";
		retVal += "Size: " + single.size + "\n";
		retVal += "Speed: " + single.speed;
		return retVal;
	}
	return checkAndReturn(ctx, races, formatter_function,"All Races");
});

bot.command('monsters', (ctx) => {
	const formatter_function = function(single) {
		var retVal = single.name + "\n";
		retVal += "Size: " + single.size + "\n";
		retVal += "Type: " + single.type + "\n";
		retVal += "HP: " + single.hit_points + "\n";
		retVal += "Armor Class: " + single.armor_class + "\n";
		retVal += "Challenge Rating: " + single.challenge_rating;
		return retVal;
	}
	if (ctx.message.text.substring(ctx.message.entities[0].length).trim().substring(0, 2).toUpperCase() == "CR") {
		for(var monster of monsters) {
			if (monster.challenge_rating == ctx.message.text.substring(ctx.message.entities[0].length).trim().substring(2))  {
				ctx.reply(formatter_function(monster));
			}
		}
	} else if (ctx.message.text.substring(ctx.message.entities[0].length).trim().length == 0) {
		return checkAndReturn(ctx, monsters, formatter_function, "All Monsters");
	} else {
		for(var monster of monsters) {
			if (monster.name.trim().toUpperCase() == ctx.message.text.substring(ctx.message.entities[0].length).trim().toUpperCase())  {
				ctx.reply(formatter_function(monster));
			}
		}
	}
});

bot.command('languages', (ctx) => {
	const formatter_function = function(single) {
		var retVal = single.name + "\n";
		retVal += "Written Script: " + single.script + "\n";
		retVal += "Speakers: " + single.typical_speakers.toString();
		return retVal;
	}
	return checkAndReturn(ctx, languages, formatter_function, "All Languages");
});

bot.command('features', (ctx) => {
	const formatter_function = function(single) {
		var retVal = single.name;
		single.desc.forEach(descrip_line => {
			retVal += "\n" + descrip_line;
		});
		return retVal;
	}
	return checkAndReturn(ctx, features, formatter_function, "All Features");
});

bot.command('equipment', (ctx) => {
	const formatter_function = function(single) {
		var retVal = single.name + "\n";
		retVal += "Weapon Category: " + single.weapon_category + "\n";
		retVal += "Range: " + single.weapon_range + "\n";
		if (single.damage) {
			retVal += "Damage: " + single.damage.damage_dice + "\n";
			retVal += "Damage Type: " + single.damage.damage_type.name;
		}
		return retVal;
	}
	return checkAndReturn(ctx, equipment, formatter_function, "All Equipment");
});

bot.command('damagetypes', (ctx) => {
	const formatter_function = function(single) {
		var retVal = single.name;
		single.desc.forEach(descrip_line => {
			retVal += "\n" + descrip_line;
		});
		return retVal;
	}
	return checkAndReturn(ctx, damageTypes, formatter_function, "All Damage Types");
});

bot.command('conditions', (ctx) => {
	const formatter_function = function(single) {
		var retVal = single.name;
		single.desc.forEach(descrip_line => {
			retVal += "\n" + descrip_line;
		});
		return retVal;
	}
	return checkAndReturn(ctx, conditions, formatter_function, "All Conditions");
});

bot.command('spells', (ctx) => {
	const formatter_function = function(single) {
		var retVal = "Spell: " + single.name + "\n";
		retVal += "Casting Time: " + single.casting_time + "\n";
		retVal += "Components: " + single.components + "\n";
		retVal += "Duration: " + single.duration;
		single.desc.forEach(descrip_line => {
			retVal += "\n" + descrip_line;
		});
		return retVal;
	}
	return checkAndReturn(ctx, spells, formatter_function, "All Conditions");
});

bot.command(['r', 'roll'], (ctx) => {
	try {
		var total = 0;
		const verbose = d20.verboseRoll(ctx.message.text.substring(ctx.message.entities[0].length).trim());
		verbose.forEach(number => {
			total += number;
		});
		var ret = "total: " + total + "\n[" + verbose + "]";
		return ctx.reply(ret);
	} catch (e) {
		return ctx.reply("improper dice input");
	}
});

bot.command(['start', 'help'], (ctx) => {
  return ctx.reply('Hello, I am the DungeonsAndDragonsInfoBot! Call me 5E for short... check out my commands to see what info I have.');
});

console.log("Starting D&D Info Bot...");
bot.launch();

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
	  bot.launch();
  } else {
	   console.log(`Received: ${input}`);
  }
});