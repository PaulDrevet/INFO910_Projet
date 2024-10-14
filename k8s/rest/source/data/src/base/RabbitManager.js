"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = require("amqplib");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Main_1 = __importDefault(require("../Main"));
class RabbitManager {
    constructor() {
        this.routes = [];
        this.PRIMARY_QUEUE_NAME = "BastionRest";
        this.APP_ID = this.PRIMARY_QUEUE_NAME;
        this.uri = process.env.RABBIT_URI;
    }
    async connect() {
        this.registerRouteFromFolder('../messaging/');
        const promiseConnection = (0, amqplib_1.connect)(this.uri);
        promiseConnection.then(() => Main_1.default.log().info("Successfully connected to RabbitMQ !")).catch(e => Main_1.default.log().error("Cannot connect to RabbitMQ: " + e));
        const connection = await promiseConnection;
        this.sendChannel = await connection.createChannel();
        this.consumerChannel = await connection.createChannel();
        await this.assertQueue(this.consumerChannel, this.PRIMARY_QUEUE_NAME);
        await this.consumerChannel.consume(this.PRIMARY_QUEUE_NAME, async (msg) => {
            if (!msg)
                return;
            try {
                const parsedContent = JSON.parse(msg.content.toString());
                const routeName = parsedContent.routeName;
                msg.content = parsedContent;
                if (routeName && this.routes.map(route => route.getRouteName()).includes(routeName)) {
                    this.consumerChannel?.ack(msg);
                    await this.receive(msg);
                }
            }
            catch (e) {
            }
        });
    }
    async removeQueue(queue) {
        return this.sendChannel?.deleteQueue(queue);
    }
    async sendMessageToQueue(queue, message, routeName, headers = {}) {
        return await this.sm(headers, queue, message, routeName);
    }
    async sendMessage(message, routeName, headers = {}) {
        return await this.sm(headers, this.PRIMARY_QUEUE_NAME, message, routeName);
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
    async sm(headers, queue, message, routeName) {
        if (!this.sendChannel)
            return false;
        try {
            // if (!(await this.sendChannel.checkQueue(queue))) await this.assertQueue(this.sendChannel, queue);
            this.sendChannel.sendToQueue(queue, Buffer.from(typeof message == 'string' ? message : (routeName ? JSON.stringify({ routeName, ...message }) : JSON.stringify(message))), {
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
    }
    async broadcast(exchangeName, message, routeName, headers = {}) {
        if (!this.sendChannel)
            return false;
        try {
            await this.sendChannel.publish(exchangeName, '', Buffer.from(typeof message == 'string' ? message : (routeName ? JSON.stringify({ routeName, ...message }) : JSON.stringify(message))), {
                appId: this.APP_ID,
                headers
            });
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
    async assertQueue(channel, queue) {
        try {
            await channel.assertQueue(queue, { autoDelete: true });
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
    registerRoute(route) {
        this.routes.push(route);
    }
    registerRoutes(...routes) {
        this.routes = [...this.routes, ...routes];
    }
    async receive(message) {
        for (const route of this.routes) {
            if (message.content.routeName == route.getRouteName()) {
                try {
                    await route.isValid(message.content);
                    await route.run(message.content);
                }
                catch (e) {
                    console.error('An error has occurred when performing message on ' + (message.content?.routeName ?? 'Unknown route') + ' from ' + (message.properties?.appId ?? 'Unknown appId'));
                    console.error(e);
                }
            }
        }
    }
}
exports.default = RabbitManager;
