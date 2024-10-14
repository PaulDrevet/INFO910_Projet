"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractRoute_1 = require("../../base/AbstractRoute");
const Main_1 = __importDefault(require("../../Main"));
class GameModeStartRoute extends AbstractRoute_1.AbstractRoute {
    constructor() {
        super(...arguments);
        this.run = async (req, reply) => {
            const { name } = req.params;
            const container = await Main_1.default.gameMode().start(name);
            if (!container) {
                return reply.status(404).send({ error: "Le jeu n'existe pas" });
            }
            const inspect = await container.inspect();
            reply.send(inspect.Config.Env.find(env => env.startsWith("SERVER_ID="))?.split("=")[1] ?? "Unknown");
        };
    }
}
exports.default = GameModeStartRoute;
