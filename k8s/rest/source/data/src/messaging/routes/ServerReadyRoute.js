"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageSchema = void 0;
const AbstractRMQRoute_1 = __importDefault(require("../AbstractRMQRoute"));
const IGlobal_1 = require("../../base/IGlobal");
const joi_1 = __importDefault(require("joi"));
const Main_1 = __importDefault(require("../../Main"));
const messageSchema = () => __awaiter(void 0, void 0, void 0, function* () {
    return IGlobal_1.baseSchema.keys({
        data: {
            serverName: joi_1.default.string().required(),
        }
    });
});
exports.messageSchema = messageSchema;
class ServerReadyRoute extends AbstractRMQRoute_1.default {
    constructor() {
        super("server-ready", exports.messageSchema);
    }
    run(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const logger = Main_1.default.log();
            const redis = Main_1.default.redis();
            console.log(data);
            logger === null || logger === void 0 ? void 0 : logger.info(`Le serveur ${data.data.serverName} est prêt !`);
            // Récupérer le bucket dans Redis
            const bucketData = yield redis.get(`${data.data.serverName}`);
            if (!bucketData) {
                logger === null || logger === void 0 ? void 0 : logger.error(`Le bucket ${data.data.serverName} n'existe pas en base de données Redis, création...`);
                yield Main_1.default.redis().set(`${data.data.serverName}`, JSON.stringify({
                    name: data.data.serverName,
                    status: "ready"
                }));
            }
            else {
                const parsedBucketData = JSON.parse(bucketData);
                parsedBucketData.status = "ready";
                yield redis.set(`${data.data.serverName}`, JSON.stringify(parsedBucketData));
            }
            // Envoyer un message à la queue RabbitMQ
            yield Main_1.default.rabbit().sendMessageToQueue("AvalonProxy", {
                serverName: data.data.serverName,
                status: "ready",
            }, "server-ready");
        });
    }
}
exports.default = ServerReadyRoute;
