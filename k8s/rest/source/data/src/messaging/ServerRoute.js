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
        player: joi_1.default.string().required(),
    }
});
exports.messageSchema = messageSchema;
class ServerRoute extends AbstractRMQRoute_1.default {
    constructor() {
        super("server", exports.messageSchema);
    }
    async run(data) {
        const logger = Main_1.default.log();
        const redis = Main_1.default.redis();
    }
}
exports.default = ServerRoute;
