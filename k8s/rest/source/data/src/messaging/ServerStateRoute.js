"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractRMQRoute_1 = __importDefault(require("../base/AbstractRMQRoute"));
const IGlobal_1 = require("../base/IGlobal");
const joi_1 = __importDefault(require("joi"));
const Main_1 = __importDefault(require("../Main"));
const messageSchema = async () => IGlobal_1.baseSchema.keys({
    serverName: joi_1.default.string().required(),
    state: joi_1.default.string().required()
});
class ServerStateRoute extends AbstractRMQRoute_1.default {
    constructor() {
        super("server-state", messageSchema);
    }
    async run(data) {
        const logger = Main_1.default.log();
        logger?.info(`Le serveur ${data.serverName} à changé de status: ${data.state} !`);
        // Envoyer un message à la queue RabbitMQ
        await Main_1.default.rabbit().sendMessageToQueue("BastionProxy", {
            serverName: data.serverName,
            state: data.state,
        }, "server-state");
    }
}
exports.default = ServerStateRoute;
