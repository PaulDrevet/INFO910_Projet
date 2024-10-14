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
const fluent_json_schema_1 = __importDefault(require("fluent-json-schema"));
const MGListRoute_1 = __importDefault(require("../routes/mgs/MGListRoute"));
const MGStartRoute_1 = __importDefault(require("../routes/mgs/MGStartRoute"));
const MGGetRoute_1 = __importDefault(require("../routes/mgs/MGGetRoute"));
const GameModeCreateRoute_1 = __importDefault(require("../routes/mgs/GameModeCreateRoute"));
let MGController = class MGController {
    constructor() {
        this.handlerGetMG = async (req, reply) => await new MGListRoute_1.default().run(req, reply);
        this.handlerGetMGByName = async (req, reply) => await new MGGetRoute_1.default().run(req, reply);
        this.handlerCreateMG = async (req, reply) => await new GameModeCreateRoute_1.default().run(req, reply);
        this.handlerStartMG = async (req, reply) => await new MGStartRoute_1.default().run(req, reply);
    }
};
__decorate([
    (0, fastify_decorators_1.GET)("/"),
    __metadata("design:type", Object)
], MGController.prototype, "handlerGetMG", void 0);
__decorate([
    (0, fastify_decorators_1.GET)("/:name", {
        schema: {
            params: fluent_json_schema_1.default.object()
                .prop("name", fluent_json_schema_1.default.string().required())
        }
    }),
    __metadata("design:type", Object)
], MGController.prototype, "handlerGetMGByName", void 0);
__decorate([
    (0, fastify_decorators_1.POST)("/", {}),
    __metadata("design:type", Object)
], MGController.prototype, "handlerCreateMG", void 0);
__decorate([
    (0, fastify_decorators_1.POST)("/start/:gameImage", {
        schema: {
            params: fluent_json_schema_1.default.object()
                .prop("gameImage", fluent_json_schema_1.default.string().required())
        }
    }),
    __metadata("design:type", Object)
], MGController.prototype, "handlerStartMG", void 0);
MGController = __decorate([
    (0, fastify_decorators_1.Controller)("/mg")
], MGController);
exports.default = MGController;
