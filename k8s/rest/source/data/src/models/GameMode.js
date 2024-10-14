"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const imageConfigSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    enabled: { type: Boolean, required: true, default: true },
    description: { type: String, default: "Pas de description" },
    icon: { type: String },
    developerNames: { type: [String], required: true, default: [] },
    displayName: { type: String, required: true, default: "Pas de nom" },
    minimalServerCount: { type: Number, required: true, default: 0 },
    imageName: { type: String, required: true },
    serverVersion: { type: String, default: "1.20.1" },
    recommendedVersion: { type: String, default: "1.20.1" },
    types: { type: [{ name: String, displayName: String, numberAssociated: Number }], required: true, default: [] },
    isLobby: { type: Boolean, required: true, default: false },
    maxPlayers: { type: mongoose_1.Schema.Types.Mixed, required: true, default: 16 },
    minPlayers: { type: mongoose_1.Schema.Types.Mixed, required: true, default: 8 },
    isProxy: { type: Boolean, required: true, default: false },
    isMinigame: { type: Boolean, required: true, default: true },
    isPermanent: { type: Boolean, default: false },
    dockerSettings: {
        serverJarName: { type: String, default: "server.jar" },
        ramLimitation: { type: Number, required: true, default: 2048 },
        cpuLimitation: { type: Number, required: true, default: 1 },
        networks: { type: [{ name: String }], required: true, default: [] },
        env: { type: [{ key: String, value: String }], required: true, default: [] },
    },
}, {
    versionKey: false,
    timestamps: true,
    statics: {
        async isImageExistsByName(name) {
            return await this.exists({ name });
        },
        async findByName(name) {
            return await this.findOne({ name });
        }
    },
    methods: {
        async disable(callback) {
            this.enabled = false;
            await this.save();
            callback();
        },
        async enable(callback) {
            this.enabled = true;
            await this.save();
            callback();
        },
        async update(data, callback) {
            Object.assign(this, data);
            await this.save();
            callback();
        },
    }
});
exports.default = (0, mongoose_1.model)('GameMode', imageConfigSchema, 'gameModes');
