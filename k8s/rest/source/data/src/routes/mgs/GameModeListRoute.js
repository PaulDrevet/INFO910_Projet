"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractRoute_1 = require("../../base/AbstractRoute");
const GameMode_1 = __importDefault(require("../../models/GameMode"));
class GameModeListRoute extends AbstractRoute_1.AbstractRoute {
    constructor() {
        super(...arguments);
        this.run = async (req, reply) => {
            const gameModes = await GameMode_1.default.find({ isMinigame: true });
            return reply.send({ gameModes });
        };
    }
}
exports.default = GameModeListRoute;
