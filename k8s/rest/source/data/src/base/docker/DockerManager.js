"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dockerode_1 = __importDefault(require("dockerode"));
const ContainerManager_1 = __importDefault(require("./ContainerManager"));
const ImageManager_1 = __importDefault(require("./ImageManager"));
class DockerManager {
    constructor() {
        this.docker = new dockerode_1.default({
            socketPath: '/var/run/docker.sock'
        });
        this.containers = new ContainerManager_1.default(this.docker);
        this.images = new ImageManager_1.default(this.docker);
    }
    getDocker() {
        return this.docker;
    }
    getContainers() {
        return this.containers;
    }
    getImages() {
        return this.images;
    }
}
exports.default = DockerManager;
