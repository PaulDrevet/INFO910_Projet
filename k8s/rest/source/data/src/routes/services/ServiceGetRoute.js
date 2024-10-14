"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Main_1 = __importDefault(require("../../Main"));
const AbstractRoute_1 = require("../../base/AbstractRoute");
const GameMode_1 = __importDefault(require("../../models/GameMode"));
class ServiceGetRoute extends AbstractRoute_1.AbstractRoute {
    constructor() {
        super(...arguments);
        this.run = async (req, reply) => {
            const { containerName } = req.params;
            const service = await Main_1.default.docker().getContainers().getByName(containerName);
            if (!service) {
                reply.status(404).send({ error: "Service not found" });
                return;
            }
            const serviceInfo = await service.inspect();
            const gamemode = serviceInfo.Config.Env.find(env => env.startsWith("GAMEMODE="))?.split("=")[1] ?? null;
            if (!gamemode) {
                reply.status(404).send({ error: "Game mode not found" });
                return;
            }
            const gameModeInspect = await GameMode_1.default.findByName(gamemode);
            if (!gameModeInspect) {
                reply.status(404).send({ error: "Game mode not found (config)" });
                return;
            }
            const serverId = serviceInfo.Config.Env.find(env => env.startsWith("SERVER_ID="))?.split("=")[1] ?? null;
            if (!serverId) {
                reply.status(404).send({ error: "Server ID not found" });
                return;
            }
            reply.send({
                gameName: gamemode,
                name: serverId,
                config: gameModeInspect,
                status: serviceInfo.State.Status,
                createdAt: serviceInfo.Created,
            });
        };
    }
}
exports.default = ServiceGetRoute;
