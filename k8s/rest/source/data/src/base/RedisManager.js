"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const Main_1 = __importDefault(require("../Main"));
class RedisManager {
    constructor() {
        this.client = (0, redis_1.createClient)({
            url: process.env.REDIS_URI,
        });
    }
    async connect() {
        await this.client.connect();
        Main_1.default.log().info("Successfully connected to Redis !");
    }
    getClient() {
        return this.client;
    }
}
exports.default = RedisManager;
