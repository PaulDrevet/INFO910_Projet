"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractRoute_1 = require("../../base/AbstractRoute");
const Main_1 = __importDefault(require("../../Main"));
const GameMode_1 = __importDefault(require("../../models/GameMode"));
class ServiceListRoute extends AbstractRoute_1.AbstractRoute {
    constructor() {
        super(...arguments);
        this.run = async (req, reply) => {
            const containerInfos = await Main_1.default.docker().getContainers().get();
            const services = await Promise.all(containerInfos.map(container => Main_1.default.docker().getDocker().getContainer(container.Id).inspect()));
            let response = [];
            for (let service of services) {
                const gamemode = service.Config.Env.find(env => env.startsWith("GAMEMODE="))?.split("=")[1] ?? null;
                if (!gamemode)
                    continue;
                const serverId = service.Config.Env.find(env => env.startsWith("SERVER_ID="))?.split("=")[1] ?? null;
                if (!serverId)
                    continue;
                const gameMode = await GameMode_1.default.findByName(gamemode);
                if (!gameMode)
                    continue;
                response.push({
                    gameName: gameMode.displayName,
                    name: serverId,
                    config: gameMode,
                    status: service.State.Status,
                });
            }
            reply.send(response);
        };
    }
}
exports.default = ServiceListRoute;
