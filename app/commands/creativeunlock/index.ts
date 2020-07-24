import PacketWriter from "dimensions/packets/packetwriter";
import Client from "../../../../client";
import Command from "../../../../command";
import CommandHandler from "../../../../commandhandler";
import CommandHandlers from "../../../../commandhandlers";
import PacketTypes from "dimensions/packettypes";
import CreativeUnlock from "../../";

const MAX_ITEM_NET_ID = 5044;

class CreativeUnlockCommand extends CommandHandler {
    public names = ["creativeunlock", "journeyunlock", "unlockallitems"];
    public permission = "";
    public help = "Unlock all items for your journey character.\n  /creativeunlock";
    private _creativeUnlock: CreativeUnlock;

    constructor(creativeUnlock: CreativeUnlock, commandHandlers: CommandHandlers) {
        super(commandHandlers);
        this._creativeUnlock = creativeUnlock;
    }

    public handle(command: Command, client: Client): void {
        if (!this._creativeUnlock.alreadyUnlocked.has(client)) {
            for (let i = 0; i <= MAX_ITEM_NET_ID; i++) {
                const packet = new PacketWriter()
                    .setType(PacketTypes.LoadNetModule)
                    .packUInt16(5) // Creative Unlocks Module
                    .packInt16(i)
                    .packInt16(999)
                    .data;

                client.sendPacket(packet);
            }
            this._creativeUnlock.alreadyUnlocked.add(client);
            client.sendChatMessage("Unlocked all items.", { R: 0, G: 255, B: 0 });
        } else {
            client.sendChatMessage("You've already unlocked all items.", { R: 255, G: 0, B: 0 });
        }
    }
}

export default CreativeUnlockCommand;
