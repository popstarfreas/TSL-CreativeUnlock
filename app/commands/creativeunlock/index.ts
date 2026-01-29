import Client from "terrariaserver-lite/client";
import Command from "terrariaserver-lite/command";
import CommandHandler from "terrariaserver-lite/commandhandler";
import CommandHandlers from "terrariaserver-lite/commandhandlers";
import CreativeUnlock from "../../index.js";
import { NetModuleLoadPacket, PlayerTeamUpdatePacket } from "terraria-packet";

const MAX_ITEM_NET_ID = 6144;

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
            const clientId = client.id;
            if (clientId === undefined) {
                client.server.logger.error("Client ID is undefined.");
                return;
            }
            let team = PlayerTeamUpdatePacket.toBuffer({
                playerId: clientId,
                team: 1,
            })
            switch (team.TAG) {
                case "Ok":
                    client.sendPacket(team._0);
                    break;
                case "Error":
                    client.server.logger.error(`Error creating team packet: ${team._0}`);
                    break;
            }
            for (let i = 1; i <= MAX_ITEM_NET_ID; i++) {
                let buf = NetModuleLoadPacket.toBuffer({
                    TAG: "CreativeUnlocksPlayerReport",
                    _0: {
                        userId: clientId,
                        itemId: i,
                        researchedCount: 9999,
                    }
                })
                switch (buf.TAG) {
                    case "Ok":
                        client.sendPacket(buf._0);
                        break;
                    case "Error":
                        client.server.logger.error(`Error creating creative unlocks player report packet: ${buf._0}`);
                        break;
                }
            }
            this._creativeUnlock.alreadyUnlocked.add(client);
            client.sendChatMessage("Unlocked all items.", { R: 0, G: 255, B: 0 });
        } else {
            client.sendChatMessage("You've already unlocked all items.", { R: 255, G: 0, B: 0 });
        }
    }
}

export default CreativeUnlockCommand;
