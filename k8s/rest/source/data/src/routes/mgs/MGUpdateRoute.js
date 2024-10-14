"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractRoute_1 = require("../../base/AbstractRoute");
const Main_1 = __importDefault(require("../../Main"));
class MGUpdateRoute extends AbstractRoute_1.AbstractRoute {
    constructor() {
        super(...arguments);
        this.run = async (req, reply) => {
            const { name } = req.params;
            const image = await Main_1.default.docker().getImageByName(name);
            if (!image) {
                reply.code(404).send({ error: "Image not found" });
                return;
            }
        };
    }
}
exports.default = MGUpdateRoute;
