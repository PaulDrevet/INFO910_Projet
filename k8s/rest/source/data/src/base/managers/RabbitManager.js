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
const amqplib_1 = require("amqplib");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Main_1 = __importDefault(require("../../Main"));
class RabbitManager {
    constructor() {
        this.routes = [];
        this.PRIMARY_QUEUE_NAME = "AvalonRest";
        this.APP_ID = this.PRIMARY_QUEUE_NAME;
        this.uri = process.env.RABBIT_URI;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.registerRouteFromFolder('../../messaging/routes');
            const promiseConnection = (0, amqplib_1.connect)(this.uri);
            promiseConnection.then(() => Main_1.default.log().info("Successfully connected to RabbitMQ !")).catch(e => Main_1.default.log().error("Cannot connect to RabbitMQ: " + e));
            const connection = yield promiseConnection;
            this.sendChannel = yield connection.createChannel();
            this.consumerChannel = yield connection.createChannel();
            yield this.assertQueue(this.consumerChannel, this.PRIMARY_QUEUE_NAME);
            yield this.consumerChannel.consume(this.PRIMARY_QUEUE_NAME, (msg) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (!msg)
                    return;
                try {
                    const parsedContent = JSON.parse(msg.content.toString());
                    const routeName = parsedContent.routeName;
                    msg.content = parsedContent;
                    if (routeName && this.routes.map(route => route.getRouteName()).includes(routeName)) {
                        (_a = this.consumerChannel) === null || _a === void 0 ? void 0 : _a.ack(msg);
                        yield this.receive(msg);
                    }
                }
                catch (e) {
                }
            }));
        });
    }
    removeQueue(queue) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (_a = this.sendChannel) === null || _a === void 0 ? void 0 : _a.deleteQueue(queue);
        });
    }
    sendMessageToQueue(queue, message, routeName, headers = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sm(headers, queue, message, routeName);
        });
    }
    sendMessage(message, routeName, headers = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sm(headers, this.PRIMARY_QUEUE_NAME, message, routeName);
        });
    }
    registerRouteFromFolder(folder) {
        const normalizedPath = path_1.default.join(__dirname, folder);
        fs_1.default.readdirSync(normalizedPath).forEach((file) => {
            if (file.endsWith('.ts')) {
                const route = new (require(normalizedPath + '/' + file).default)();
                this.registerRoute(route);
                console.log('Route ' + route.getRouteName() + ' registered.');
            }
        });
    }
    sm(headers, queue, message, routeName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sendChannel)
                return false;
            try {
                // if (!(await this.sendChannel.checkQueue(queue))) await this.assertQueue(this.sendChannel, queue);
                this.sendChannel.sendToQueue(queue, Buffer.from(typeof message == 'string' ? message : (routeName ? JSON.stringify(Object.assign({ routeName }, message)) : JSON.stringify(message))), {
                    appId: this.APP_ID,
                    headers
                });
                console.log("Un message a été envoyé.");
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
    }
    broadcast(exchangeName, message, routeName, headers = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sendChannel)
                return false;
            try {
                yield this.sendChannel.publish(exchangeName, '', Buffer.from(typeof message == 'string' ? message : (routeName ? JSON.stringify(Object.assign({ routeName }, message)) : JSON.stringify(message))), {
                    appId: this.APP_ID,
                    headers
                });
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
    }
    assertQueue(channel, queue) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield channel.assertQueue(queue, { autoDelete: true });
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
    }
    registerRoute(route) {
        this.routes.push(route);
    }
    registerRoutes(...routes) {
        this.routes = [...this.routes, ...routes];
    }
    receive(message) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            for (const route of this.routes) {
                if (message.content.routeName == route.getRouteName()) {
                    try {
                        yield route.isValid(message.content);
                        yield route.run(message.content);
                    }
                    catch (e) {
                        console.error('An error has occurred when performing message on ' + ((_b = (_a = message.content) === null || _a === void 0 ? void 0 : _a.routeName) !== null && _b !== void 0 ? _b : 'Unknown route') + ' from ' + ((_d = (_c = message.properties) === null || _c === void 0 ? void 0 : _c.appId) !== null && _d !== void 0 ? _d : 'Unknown appId'));
                        console.error(e);
                    }
                }
            }
        });
    }
}
exports.default = RabbitManager;
