import Client from "../../client";
import TerrariaServer from "../..//terrariaserver";
import Extension from "../../extensions/extension";

class CreativeUnlocks extends Extension {
    public name = "Creative Unlocks";
    public version = "v1.0";
    public path = "";
    public alreadyUnlocked: Set<Client> = new Set(); // don't allow clients to spam the command

    constructor(server: TerrariaServer) {
        super(server);
        this.loadCommands(__dirname);
    }

    public handleClientDisconnect(client: Client): void {
        this.alreadyUnlocked.delete(client);
    }
}

export default CreativeUnlocks;
