"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractRoute_1 = require("../../base/AbstractRoute");
const GameMode_1 = __importDefault(require("../../models/GameMode"));
const utils_1 = require("../../utils/utils");
const Main_1 = __importDefault(require("../../Main"));
class GameModeCreateRoute extends AbstractRoute_1.AbstractRoute {
    constructor() {
        super(...arguments);
        this.run = async (req, reply) => {
            const gameMode = req.body;
            gameMode.name = (0, utils_1.slugify)(gameMode.displayName);
            gameMode.imageName = `gm-${gameMode.name}`;
            const isImageAlreadyExist = await GameMode_1.default.isImageExistsByName(gameMode.name);
            if (isImageAlreadyExist) {
                return reply.status(400).send({ error: "Un jeu avec le même nom existe déjà !" });
            }
            const imageConfig = new GameMode_1.default(gameMode);
            await imageConfig.save();
            await Main_1.default.gameMode().build(imageConfig.name);
            return reply.send({ success: true, imageConfig });
        };
    }
}
exports.default = GameModeCreateRoute;
