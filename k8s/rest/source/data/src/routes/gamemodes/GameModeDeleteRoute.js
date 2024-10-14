"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractRoute_1 = require("../../base/AbstractRoute");
class GameModeDeleteRoute extends AbstractRoute_1.AbstractRoute {
    constructor() {
        super(...arguments);
        this.run = async (req, reply) => {
            const { name } = req.params;
            try {
            }
            catch (e) {
                return reply.status(500).send({ error: e.message });
            }
            return reply.send({ success: true });
        };
    }
}
exports.default = GameModeDeleteRoute;
