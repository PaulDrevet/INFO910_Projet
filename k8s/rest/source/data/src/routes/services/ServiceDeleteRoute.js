"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractRoute_1 = require("../../base/AbstractRoute");
const Main_1 = __importDefault(require("../../Main"));
class ServiceDeleteRoute extends AbstractRoute_1.AbstractRoute {
    constructor() {
        super(...arguments);
        this.run = async (req, reply) => {
            const { containerName } = req.params;
            const service = await Main_1.default.docker().getContainers().getByName(containerName);
            if (!service) {
                reply.status(404).send({ error: "Service not found" });
                return;
            }
            // Check if we need to stop the service before removing it
            const status = await service.inspect();
            if (status.State.Status === "running" || status.State.Status === "paused" || status.State.Status === "restarting") {
                await service.stop();
            }
            await service.remove();
            reply.send({ success: true });
        };
    }
}
exports.default = ServiceDeleteRoute;
