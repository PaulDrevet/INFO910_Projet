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
const fastify_1 = __importDefault(require("fastify"));
const fastify_decorators_1 = require("fastify-decorators");
const path_1 = require("path");
const Main_1 = __importDefault(require("../Main"));
class Webserver {
    constructor(option) {
        this.server = (0, fastify_1.default)({ logger: true, disableRequestLogging: true });
        this.middlewares = [
            {
                import: Promise.resolve().then(() => __importStar(require("@fastify/cors"))),
                config: {
                    origin: "*",
                },
            }, {
                import: Promise.resolve().then(() => __importStar(require("@fastify/jwt"))),
                config: {
                    secret: "ssZQy6xL4QA6k492L3cw7SxgsRP2H6"
                }
            },
            {
                import: Promise.resolve().then(() => __importStar(require("fastify-bcrypt"))),
                config: {
                    saltWorkFactor: 12
                }
            },
            {
                import: Promise.resolve().then(() => __importStar(require("@fastify/routes")))
            }, {
                import: Promise.resolve().then(() => __importStar(require("fastify-socket.io"))),
                config: {
                    cors: {
                        origin: "*",
                        credentials: true
                    }
                }
            },
            ...option?.middlewares ?? []
        ];
    }
    async start() {
        this.middlewares.forEach((middleware) => {
            this.server.register(middleware.import, middleware.config);
        });
        this.server.register(fastify_decorators_1.bootstrap, {
            // Specify directory with our controllers
            directory: (0, path_1.resolve)(__dirname, "../", `controllers`),
            // Specify mask to match only our controllers
            mask: /Controller\./,
        });
        this.server.listen({ port: Number(process.env.PORT ?? 80), host: process.env.HOST ?? "0.0.0.0" }, (err, address) => {
            if (err)
                throw err;
            Main_1.default.log().info("The server was successfully started on : " + address);
        });
    }
    addMiddleware(middleware) {
        this.middlewares.push(middleware);
        return this;
    }
    getServer() {
        return this.server;
    }
    getSocket() {
        //@ts-ignore
        return this.server.io;
    }
}
exports.default = Webserver;
