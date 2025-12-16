import Client from "terrariaserver-lite/client";
import Command from "terrariaserver-lite/command";
import CommandHandler from "terrariaserver-lite/commandhandler";
import CommandHandlers from "terrariaserver-lite/commandhandlers";
import CreativeUnlock from "../../index.js";
import { NetModuleLoadPacket } from "terraria-packet";

const MAX_ITEM_NET_ID = 5087;

class CreativeUnlockCommand extends CommandHandler {
    public names = ["creativeunlock", "journeyunlock", "unlockallitems"];
    public permission = "";
    public help = "Unlock all items for your journey character.\n  /creativeunlock";
    private _creativeUnlock: CreativeUnlock;

    constructor(creativeUnlock: CreativeUnlock, commandHandlers: CommandHandlers) {
        super(commandHandlers);
        this._creativeUnlock = creativeUnlock;
    }

    public handle(_command: Command, client: Client): void {
        if (!this._creativeUnlock.alreadyUnlocked.has(client)) {
            for (let i = 0; i <= MAX_ITEM_NET_ID; i++) {
                const netModuleLoadPacketResult = NetModuleLoadPacket.toBuffer({
                    TAG: "CreativeUnlocks",
                    _0: {
                        itemId: i,
                        researchedCount: 999
                    }
                })

                if (netModuleLoadPacketResult.TAG == "Error") {
                    const errorMessage = netModuleLoadPacketResult._0.error.message;
                    client.server.logger.error(`Error while creating NetModuleLoadPacket for creative unlocks: ${netModuleLoadPacketResult._0.context}; ${errorMessage}`);
                    return
                }
                client.sendPacket(netModuleLoadPacketResult._0);
            }
            this._creativeUnlock.alreadyUnlocked.add(client);
            client.sendChatMessage("Unlocked all items.", { R: 0, G: 255, B: 0 });
        } else {
            client.sendChatMessage("You've already unlocked all items.", { R: 255, G: 0, B: 0 });
        }
    }
}

export default CreativeUnlockCommand;
