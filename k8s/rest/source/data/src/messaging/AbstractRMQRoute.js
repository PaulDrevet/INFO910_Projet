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
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractRMQRoute {
    constructor(routeName, schema) {
        this.routeName = routeName;
        this.schema = schema;
    }
    isValid(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (yield this.schema()).validateAsync(data, {
                    abortEarly: false
                });
                return true;
            }
            catch (e) {
                throw e;
            }
        });
    }
    getRouteName() {
        return this.routeName;
    }
}
exports.default = AbstractRMQRoute;
