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
            player: joi_1.default.string().required(),
        }
    });
});
exports.messageSchema = messageSchema;
class ServerRoute extends AbstractRMQRoute_1.default {
    constructor() {
        super("server", exports.messageSchema);
    }
    run(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const logger = Main_1.default.log();
            const redis = Main_1.default.redis();
            logger === null || logger === void 0 ? void 0 : logger.info("Une nouvelle demande de serveur a été reçue");
            // Récupérer tous les keys commençant par "test-" pour déterminer le nombre actuel de buckets
            const keys = yield redis.keys("test-*");
            const nb = keys.length;
            const newBucketName = `test-${nb + 1}`;
            // Créer un nouveau serveur Minecraft
            const server = yield Main_1.default.docker().createMinecraftServer(newBucketName);
            if (!server)
                return logger === null || logger === void 0 ? void 0 : logger.error("Le serveur n'a pas pu être créé");
            yield server.start();
            logger === null || logger === void 0 ? void 0 : logger.info("Le serveur a été créé et démarré");
            // Sauvegarder le nouveau bucket dans Redis avec le statut "waiting"
            const bucketData = {
                name: newBucketName,
                status: "starting",
            };
            yield redis.set(newBucketName, JSON.stringify(bucketData));
            logger === null || logger === void 0 ? void 0 : logger.info(`Un nouveau bucket a été créé dans Redis avec le nom : ${newBucketName}`);
            // Envoyer un message à la queue RabbitMQ
            yield Main_1.default.rabbit().sendMessageToQueue("AvalonProxy", {
                name: newBucketName,
                status: "starting",
            }, "server-starting");
        });
    }
}
exports.default = ServerRoute;
