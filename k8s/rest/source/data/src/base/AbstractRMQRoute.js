"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractRMQRoute {
    constructor(routeName, schema) {
        this.routeName = routeName;
        this.schema = schema;
    }
    async isValid(data) {
        try {
            await (await this.schema()).validateAsync(data, {
                abortEarly: false
            });
            return true;
        }
        catch (e) {
            throw e;
        }
    }
    getRouteName() {
        return this.routeName;
    }
}
exports.default = AbstractRMQRoute;
