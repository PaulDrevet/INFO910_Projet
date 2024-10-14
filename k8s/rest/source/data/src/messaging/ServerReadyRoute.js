"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageSchema = void 0;
const AbstractRMQRoute_1 = __importDefault(require("../base/AbstractRMQRoute"));
const IGlobal_1 = require("../base/IGlobal");
const joi_1 = __importDefault(require("joi"));
const Main_1 = __importDefault(require("../Main"));
const messageSchema = async () => IGlobal_1.baseSchema.keys({
    data: {
        serverName: joi_1.default.string().required(),
    }
});
exports.messageSchema = messageSchema;
class ServerReadyRoute extends AbstractRMQRoute_1.default {
    constructor() {
        super("server-ready", exports.messageSchema);
    }
    async run(data) {
        const logger = Main_1.default.log();
        const redis = Main_1.default.redis();
        console.log(data);
        logger?.info(`Le serveur ${data.data.serverName} est prêt !`);
        // Récupérer le bucket dans Redis
        const bucketData = await redis.get(`${data.data.serverName}`);
        if (!bucketData) {
            logger?.error(`Le bucket ${data.data.serverName} n'existe pas en base de données Redis, création...`);
            await Main_1.default.redis().set(`${data.data.serverName}`, JSON.stringify({
                name: data.data.serverName,
                status: "ready"
            }));
        }
        else {
            const parsedBucketData = JSON.parse(bucketData);
            parsedBucketData.status = "ready";
            await redis.set(`${data.data.serverName}`, JSON.stringify(parsedBucketData));
        }
        // Envoyer un message à la queue RabbitMQ
        await Main_1.default.rabbit().sendMessageToQueue("AvalonProxy", {
            serverName: data.data.serverName,
            status: "ready",
        }, "server-ready");
    }
}
exports.default = ServerReadyRoute;
