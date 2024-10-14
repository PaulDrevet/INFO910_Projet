"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractRoute_1 = require("../../base/AbstractRoute");
const Main_1 = __importDefault(require("../../Main"));
class MGStartRoute extends AbstractRoute_1.AbstractRoute {
    constructor() {
        super(...arguments);
        this.run = async (req, reply) => {
            const { gameImage } = req.params;
            const container = await Main_1.default.docker().startGameServer(gameImage);
            const inspect = await container.inspect();
            reply.send(inspect.Config.Env.find(env => env.startsWith("SERVER_NAME="))?.split("=")[1] ?? "Unknown");
        };
    }
}
exports.default = MGStartRoute;
