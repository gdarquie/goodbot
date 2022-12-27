import { Bot as MineflayerBot } from 'mineflayer';
import { BotInterface } from '../type';
import { pathfinder, Movements, goals } from 'mineflayer-pathfinder';
import { plugin as tool } from 'mineflayer-tool';
import { plugin as collectblock, CollectBlock} from 'mineflayer-collectblock';

export class Bot implements BotInterface {
    constructor(mineflayer: MineflayerBot) {
        this.mineflayer = mineflayer;
        this.mcData = require('minecraft-data')(this.mineflayer.version);
        this.mineflayer.loadPlugin(pathfinder);
        this.mineflayer.loadPlugin(tool);
        this.mineflayer.loadPlugin(collectblock);
    }

    mineflayer: MineflayerBot;
    isCutting: boolean = false;
    isFollowing: boolean = false;
    mcData: any = null;
    blockCollector: any = null;

    followPlayer(playerName: string, mcData: any): void {
        const player = this.mineflayer.players[playerName];
        const GoalFollow = goals.GoalFollow;

        if (player) {
            const movements = new Movements(this.mineflayer, mcData);
            movements.scafoldingBlocks = [];

            this.mineflayer.pathfinder.setMovements(movements);

            const goal = new GoalFollow(player.entity, 1);
            this.mineflayer.pathfinder.setGoal(goal, true);
        }
    }

    stopFollowPlayer(): void {
        const GoalBlock = goals.GoalBlock;
        this.mineflayer.loadPlugin(pathfinder);
        const goal = new GoalBlock(this.mineflayer.entity.position.x, this.mineflayer.entity.position.y, this.mineflayer.entity.position.z);
        this.mineflayer.pathfinder.setGoal(goal, true);
    }

    async collectBlock(type: string, mcData: any): Promise<void> {
        const grass = this.mineflayer.findBlock({
            matching: mcData.blocksByName[type].id,
            maxDistance: 64
        });

        this.blockCollector = new CollectBlock(this.mineflayer);

        if (grass) {
            try {
                await this.blockCollector.collect(grass);
                this.collectBlock(type, mcData);
            } catch (err) {
                console.log(err);
            }
        }
    }
}