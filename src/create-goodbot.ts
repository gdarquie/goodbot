import { BotFactory } from "./bot/bot.factory";
import { BotInterface } from './type';

const version = '1.18.2';
const factory = new BotFactory();
const bots = factory.createMany(2);
const mcData = require('minecraft-data')(version);

const lexicon = {
  "hi": ["hi", "hello"],
  "follow": ['follow'],
  "wood": ['cut', 'wood', 'woods'],
  "dig": ['dig'],
  "collect": ["collect"],
  "plan": ["plan"],
}

const greet = (bot: BotInterface, playerName: string) => {
  bot.mineflayer.chat(`Hello ${playerName}!`);
}

const follow = (bot: BotInterface, playerName: string) => {
  if (bot.isFollowing) {
    bot.mineflayer.chat('I will stop following you!');
    bot.stopFollowPlayer();
    bot.isFollowing = false;
  } else {
    bot.mineflayer.chat('I will follow you!');
    bot.followPlayer(playerName, mcData);
    bot.isFollowing = true;
  }
}

const collect = async (bot: BotInterface): Promise<void> => {
  bot.mineflayer.chat('I will collect blocks.');
  await bot.collectBlock('oak_log', mcData); //grass_block
}

bots.forEach((bot: BotInterface) => {
  bot.mineflayer.on('chat', async (username, message) => {
    if ((lexicon.hi.indexOf(message) > -1)) {
      greet(bot, username);
    }
      
    if (lexicon.follow.indexOf(message) > -1) {
      follow(bot, username);
    }

    /** todo: find a way to select in chat the type of block to collect */
    if (lexicon.collect.indexOf(message) > -1) {
      await collect(bot);
    }

    if (lexicon.plan.indexOf(message) > -1) {
      // todo: create a function to plan the ground
      bot.mineflayer.chat(`I will plan the ground.`);
    }

    if (lexicon.dig.indexOf(message) > -1) {
      bot.mineflayer.chat(`I will dig for you ${username}.`);
    }
  })
    
  // log errors and kick reasons:
  bot.mineflayer.on('kicked', console.log);
  bot.mineflayer.on('error', console.log);
});
