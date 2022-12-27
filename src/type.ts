import {Bot as MineflayerBot} from 'mineflayer';
import { CollectBlock } from 'mineflayer-collectblock';

export class BotInterface {
    mineflayer: MineflayerBot;
    isCutting: boolean;
    isFollowing: boolean;
    mcData: any;
    followPlayer: (playerName: string, mcData:any) => void;
    stopFollowPlayer:() => void;
    collectBlock: (type:string, mcData: any) => Promise<void>;
    blockCollector: CollectBlock;
}