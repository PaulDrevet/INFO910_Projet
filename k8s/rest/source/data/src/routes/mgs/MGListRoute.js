"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractRoute_1 = require("../../base/AbstractRoute");
const Main_1 = __importDefault(require("../../Main"));
class MGListRoute extends AbstractRoute_1.AbstractRoute {
    constructor() {
        super(...arguments);
        this.run = async (req, reply) => {
            const gameImages = await Main_1.default.docker().getImageGames();
            const images = gameImages.map((image) => {
                return {
                    created: new Date(image.Created),
                    updated: new Date(image.Created),
                    name: image.RepoTags[0],
                    env: image.Config.Env.map((env) => {
                        return {
                            [env.split('=')[0]]: env.split('=')[1]
                        };
                    }).reduce((acc, val) => {
                        return { ...acc, ...val };
                    })
                };
            });
            reply.send(images);
        };
    }
}
exports.default = MGListRoute;
