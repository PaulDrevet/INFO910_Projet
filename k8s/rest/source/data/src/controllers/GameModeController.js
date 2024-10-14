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
const GameModeStartRoute_1 = __importDefault(require("../routes/mgs/GameModeStartRoute"));
const GameModeGetRoute_1 = __importDefault(require("../routes/mgs/GameModeGetRoute"));
const GameModeCreateRoute_1 = __importDefault(require("../routes/mgs/GameModeCreateRoute"));
const GameModeListRoute_1 = __importDefault(require("../routes/mgs/GameModeListRoute"));
const GameModeUpdateRoute_1 = __importDefault(require("../routes/mgs/GameModeUpdateRoute"));
const GameModeBuildImageRoute_1 = __importDefault(require("../routes/mgs/GameModeBuildImageRoute"));
const GameModeDeleteRoute_1 = __importDefault(require("../routes/mgs/GameModeDeleteRoute"));
let GameModeController = class GameModeController {
    constructor() {
        this.handlerGetMG = async (req, reply) => await new GameModeListRoute_1.default().run(req, reply);
        this.handlerGetMGByName = async (req, reply) => await new GameModeGetRoute_1.default().run(req, reply);
        this.handlerCreateMG = async (req, reply) => await new GameModeCreateRoute_1.default().run(req, reply);
        this.handlerUpdateMG = async (req, reply) => await new GameModeUpdateRoute_1.default().run(req, reply);
        this.handlerBuildImageMG = async (req, reply) => await new GameModeBuildImageRoute_1.default().run(req, reply);
        this.handlerStartMG = async (req, reply) => await new GameModeStartRoute_1.default().run(req, reply);
        this.handlerDeleteGameMode = async (req, reply) => await new GameModeDeleteRoute_1.default().run(req, reply);
    }
};
__decorate([
    (0, fastify_decorators_1.GET)("/"),
    __metadata("design:type", Object)
], GameModeController.prototype, "handlerGetMG", void 0);
__decorate([
    (0, fastify_decorators_1.GET)("/:name", {
        schema: {
            params: fluent_json_schema_1.default.object()
                .prop("name", fluent_json_schema_1.default.string().required())
        }
    }),
    __metadata("design:type", Object)
], GameModeController.prototype, "handlerGetMGByName", void 0);
__decorate([
    (0, fastify_decorators_1.POST)("/", {}),
    __metadata("design:type", Object)
], GameModeController.prototype, "handlerCreateMG", void 0);
__decorate([
    (0, fastify_decorators_1.PUT)("/:name", {
        schema: {
            params: fluent_json_schema_1.default.object()
                .prop("name", fluent_json_schema_1.default.string().required())
        }
    }),
    __metadata("design:type", Object)
], GameModeController.prototype, "handlerUpdateMG", void 0);
__decorate([
    (0, fastify_decorators_1.POST)("/:name/build-image", {
        schema: {
            params: fluent_json_schema_1.default.object()
                .prop("name", fluent_json_schema_1.default.string().required())
        }
    }),
    __metadata("design:type", Object)
], GameModeController.prototype, "handlerBuildImageMG", void 0);
__decorate([
    (0, fastify_decorators_1.POST)("/:name/start", {
        schema: {
            params: fluent_json_schema_1.default.object()
                .prop("name", fluent_json_schema_1.default.string().required())
        }
    }),
    __metadata("design:type", Object)
], GameModeController.prototype, "handlerStartMG", void 0);
__decorate([
    (0, fastify_decorators_1.DELETE)("/:name", {
        schema: {
            params: fluent_json_schema_1.default.object()
                .prop("name", fluent_json_schema_1.default.string().required())
        }
    }),
    __metadata("design:type", Object)
], GameModeController.prototype, "handlerDeleteGameMode", void 0);
GameModeController = __decorate([
    (0, fastify_decorators_1.Controller)("/game-mode")
], GameModeController);
exports.default = GameModeController;
