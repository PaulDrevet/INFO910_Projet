"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractRoute_1 = require("../../base/AbstractRoute");
const GameMode_1 = __importDefault(require("../../models/GameMode"));
class GameModeGetRoute extends AbstractRoute_1.AbstractRoute {
    constructor() {
        super(...arguments);
        this.run = async (req, reply) => {
            const { name } = req.params;
            const gameMode = await GameMode_1.default.findByName(name);
            if (!gameMode) {
                return reply.status(404).send({ error: "Le jeu n'existe pas" });
            }
            return reply.send({ gameMode });
        };
    }
}
exports.default = GameModeGetRoute;
