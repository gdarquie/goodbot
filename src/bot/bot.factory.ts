import { createBot, Bot as MineflayerBot } from 'mineflayer';
import { Bot } from './bot.entity';
import { BotInterface } from '../type';

export class BotFactory {
    /** todo: use en vars */
    createOne(index: number): BotInterface {
        const mineflayerBot: MineflayerBot = createBot({
            host: 'localhost', // minecraft server ip
            username: `GaoBot_${index}`, // minecraft username
            // password: '', // minecraft password, comment out if you want to log into online-mode=false servers
            // port: 25565,                // only set if you need a port that isn't 25565
            // version: false,             // only set if you need a specific version or snapshot (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
            // auth: 'mojang'              // only set if you need microsoft auth, then set this to 'microsoft'
        });

        return new Bot(mineflayerBot);
    }

    createMany(count: number): BotInterface[] {
        const bots: Bot[] = [];
        for (let i = 0; i < count; i++ ) {
            bots.push(this.createOne(i));
        }

        return bots;
    }
}

