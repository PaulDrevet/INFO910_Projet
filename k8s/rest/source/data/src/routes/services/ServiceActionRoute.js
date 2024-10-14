"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractRoute_1 = require("../../base/AbstractRoute");
const Main_1 = __importDefault(require("../../Main"));
class ServiceActionRoute extends AbstractRoute_1.AbstractRoute {
    constructor() {
        super(...arguments);
        this.run = async (req, reply) => {
            const { id, action } = req.params;
            const service = await Main_1.default.docker().getContainers().getByName(id);
            if (!service) {
                reply.status(404).send({ error: "Service not found" });
                return;
            }
            if (action === "start")
                await service.start();
            if (action === "stop")
                await service.stop();
            if (action === "restart")
                await service.restart();
            reply.send({ success: true });
        };
    }
}
exports.default = ServiceActionRoute;
