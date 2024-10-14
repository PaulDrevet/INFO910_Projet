"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_decorators_1 = require("fastify-decorators");
const ServiceListRoute_1 = __importDefault(require("../routes/services/ServiceListRoute"));
const fluent_json_schema_1 = __importDefault(require("fluent-json-schema"));
const ServiceActionRoute_1 = __importDefault(require("../routes/services/ServiceActionRoute"));
const ServiceDeleteRoute_1 = __importDefault(require("../routes/services/ServiceDeleteRoute"));
const ServiceLogsRoute_1 = __importDefault(require("../routes/services/ServiceLogsRoute"));
const ServiceGetRoute_1 = __importDefault(require("../routes/services/ServiceGetRoute"));
let ServiceController = class ServiceController {
    constructor() {
        this.handlerGetServices = async (req, reply) => await new ServiceListRoute_1.default().run(req, reply);
        this.handlerGetService = async (req, reply) => await new ServiceGetRoute_1.default().run(req, reply);
        this.handlerActionRoute = async (req, reply) => await new ServiceActionRoute_1.default().run(req, reply);
        this.handlerDeleteService = async (req, reply) => await new ServiceDeleteRoute_1.default().run(req, reply);
        this.handlerGetServiceLogs = async (req, reply) => await new ServiceLogsRoute_1.default().run(req, reply);
    }
};
__decorate([
    (0, fastify_decorators_1.GET)("/"),
    __metadata("design:type", Object)
], ServiceController.prototype, "handlerGetServices", void 0);
__decorate([
    (0, fastify_decorators_1.GET)("/:containerName", {
        schema: {
            params: fluent_json_schema_1.default.object()
                .prop("containerName", fluent_json_schema_1.default.string().required())
        }
    }),
    __metadata("design:type", Object)
], ServiceController.prototype, "handlerGetService", void 0);
__decorate([
    (0, fastify_decorators_1.POST)("/:id/:action", {
        schema: {
            params: fluent_json_schema_1.default.object()
                .prop("id", fluent_json_schema_1.default.string().required())
                .prop("action", fluent_json_schema_1.default.enum(["start", "stop", "restart"]).required())
        }
    }),
    __metadata("design:type", Object)
], ServiceController.prototype, "handlerActionRoute", void 0);
__decorate([
    (0, fastify_decorators_1.DELETE)("/:containerName", {
        schema: {
            params: fluent_json_schema_1.default.object()
                .prop("containerName", fluent_json_schema_1.default.string().required())
        }
    }),
    __metadata("design:type", Object)
], ServiceController.prototype, "handlerDeleteService", void 0);
__decorate([
    (0, fastify_decorators_1.GET)("/:containerName/logs", {
        schema: {
            params: fluent_json_schema_1.default.object()
                .prop("containerName", fluent_json_schema_1.default.string().required()),
            querystring: fluent_json_schema_1.default.object()
                .prop("html", fluent_json_schema_1.default.boolean())
                .prop("length", fluent_json_schema_1.default.number())
        }
    }),
    __metadata("design:type", Object)
], ServiceController.prototype, "handlerGetServiceLogs", void 0);
ServiceController = __decorate([
    (0, fastify_decorators_1.Controller)("/service")
], ServiceController);
exports.default = ServiceController;
