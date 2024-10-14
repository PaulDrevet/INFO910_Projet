"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tslog_1 = require("tslog");
const Webserver_1 = __importDefault(require("./base/Webserver"));
const RabbitManager_1 = __importDefault(require("./base/RabbitManager"));
const RedisManager_1 = __importDefault(require("./base/RedisManager"));
require("reflect-metadata");
const MongoManager_1 = __importDefault(require("./base/MongoManager"));
const ServerStateRoute_1 = __importDefault(require("./messaging/ServerStateRoute"));
const ServerRoute_1 = __importDefault(require("./messaging/ServerRoute"));
const GamemodeManager_1 = __importDefault(require("./base/docker/GamemodeManager"));
const DockerManager_1 = __importDefault(require("./base/docker/DockerManager"));
class Main {
    constructor() {
        this.webserver = new Webserver_1.default({
            middlewares: [
                {
                    import: Promise.resolve().then(() => __importStar(require("@fastify/multipart"))),
                    config: {
                        attachFieldsToBody: true,
                        throwFileSizeLimit: true,
                        limits: {
                            files: 1,
                            fileSize: 1000000,
                        },
                    }
                }
            ]
        });
        this.mongoManager = new MongoManager_1.default();
        this.rabbitManager = new RabbitManager_1.default();
        this.redisManager = new RedisManager_1.default();
        this.dockerManager = new DockerManager_1.default();
        this.gameModeManager = new GamemodeManager_1.default();
        this.logger = new tslog_1.Logger({
            displayFilePath: "hidden",
            displayFunctionName: false,
            prefix: ["RAPI |"],
            overwriteConsole: true,
            dateTimeTimezone: "Europe/Paris",
            dateTimePattern: "day/month/year hour:minute:second.millisecond",
        });
    }
    async start() {
        this.rabbitManager.registerRoutes(new ServerStateRoute_1.default(), new ServerRoute_1.default());
        await this.webserver.start();
        await this.redisManager.connect();
        await this.rabbitManager.connect();
        await this.mongoManager.connect();
    }
    getWebServer() {
        return this.webserver;
    }
    mongo() {
        return this.mongoManager;
    }
    redis() {
        return this.redisManager.getClient();
    }
    rabbit() {
        return this.rabbitManager;
    }
    log() {
        return this.logger;
    }
    gameMode() {
        return this.gameModeManager;
    }
    docker() {
        return this.dockerManager;
    }
}
exports.default = new Main();
