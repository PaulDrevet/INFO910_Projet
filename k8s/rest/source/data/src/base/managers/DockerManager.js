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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dockerode_1 = __importDefault(require("dockerode"));
const Main_1 = __importDefault(require("../../Main"));
class DockerManager {
    constructor() {
        this.docker = new dockerode_1.default({
            socketPath: '/var/run/docker.sock'
        });
    }
    getDocker() {
        return this.docker;
    }
    /**
     * Create a service that correspond to this exact docker-compose.yml file
     * @param CUSTOM_NAME The name of the service
     **/
    createMinecraftServer(CUSTOM_NAME) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.docker.createContainer({
                Image: 'my-minecraft-server',
                name: CUSTOM_NAME,
                Env: [
                    'EULA=TRUE',
                    'ONLINE_MODE=FALSE',
                    'TYPE=PAPER',
                    'USE_AIKAR_FLAGS=true',
                    'VERSION=1.20.1',
                    'RABBIT_URI=amqp://guest:guest@localhost:5672',
                    'SERVER_NAME=' + CUSTOM_NAME,
                    'IS_MINIGAME=true',
                ],
                NetworkingConfig: {
                    EndpointsConfig: {
                        velocity: {}
                    }
                }
            });
        });
    }
    /**
     * Create a container that correspond to this exact docker-compose.yml file
     * Start a game server with the image provided
     * Will check if the image is a valid minecraft server image
     * Then it will check all the servers that are currently running with this image by checking Redis
     * The server name will be the image name with a number at the end (that doesn't exist in redis)
     * @param gameImage {string} The image of the game server
     */
    startGameServer(gameImage) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.isImageExists(gameImage);
            const image = yield this.getImageByName(gameImage);
            if (!image)
                throw new Error(`Image ${gameImage} doesn't exist`);
            const nextGameID = yield this.nextGameID(gameImage);
            try {
                Main_1.default.log().debug(`Creating container ${nextGameID}...`);
                const container = yield this.docker.createContainer({
                    Image: gameImage,
                    name: nextGameID,
                    Env: [
                        'EULA=TRUE',
                        'ONLINE_MODE=FALSE',
                        'TYPE=PAPER',
                        'USE_AIKAR_FLAGS=true',
                        'VERSION=1.20.1',
                        'RABBIT_URI=amqp://guest:guest@localhost:5672',
                        'SERVER_NAME=' + nextGameID,
                        'IS_MINIGAME=true',
                    ],
                    NetworkingConfig: {
                        EndpointsConfig: {
                            velocity: {}
                        }
                    }
                });
                Main_1.default.log().debug(`Container ${nextGameID} is starting...`);
                yield container.start();
                Main_1.default.log().debug(`Container ${nextGameID} started !`);
                return container;
            }
            catch (e) {
                Main_1.default.log().error(`Error while creating container ${nextGameID}: ${e}`);
                throw e;
            }
        });
    }
    /**
     * A promise that will resolve when the image exists
     * @param imageName {string} The image name
     */
    isImageExists(imageName) {
        return __awaiter(this, void 0, void 0, function* () {
            Main_1.default.log().debug(`Checking if image ${imageName} exists...`);
            const images = yield this.docker.listImages();
            let imagesWithoutTags = [];
            for (let image of images) {
                if (image.RepoTags && image.RepoTags[0]) {
                    imagesWithoutTags.push(image.RepoTags[0].split(":")[0]);
                }
            }
            if (!imagesWithoutTags.includes(imageName)) {
                throw new Error(`Image ${imageName} doesn't exist`);
            }
            Main_1.default.log().debug(`Image ${imageName} exists !`);
        });
    }
    getImageByName(imageName) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = (_a = (yield this.docker.listImages()).filter(image => image.RepoTags && image.RepoTags[0] && image.RepoTags[0].startsWith(imageName))[0]) === null || _a === void 0 ? void 0 : _a.Id;
                if (!id) {
                    Main_1.default.log().error(`Image ${imageName} not found, has it been removed ?`);
                    return null;
                }
                return (this.docker.getImage(id).inspect());
            }
            catch (e) {
                Main_1.default.log().error(`Image ${imageName} not found, has it been removed ?`);
                return null;
            }
        });
    }
    /**
     * Get the next game id for a game image
     * It will check all the containers that exist with this image
     * The name will be "mg-" + the image name + "-" + the number of containers with this image + 1
     */
    nextGameID(imageName) {
        return __awaiter(this, void 0, void 0, function* () {
            const containers = yield this.getContainersByGameImage(imageName);
            return `${imageName}-${containers.length + 1}`;
        });
    }
    /**
     * Get all containers that are running with this image
     * @param imageName {string} The image name
     */
    getContainersByGameImage(imageName) {
        return __awaiter(this, void 0, void 0, function* () {
            const containers = yield this.docker.listContainers({ all: true });
            return containers.filter(container => container.Image.startsWith(imageName)).map(container => this.docker.getContainer(container.Id));
        });
    }
    /**
     * Get all service that are minecraft servers, either minigame or lobby
     */
    getContainers() {
        return __awaiter(this, void 0, void 0, function* () {
            const containers = yield this.docker.listContainers({ all: true });
            const minecraftContainers = containers.filter(container => container.Image.includes("minecraft") || container.Image.includes("mg-"));
            const inspectPromises = minecraftContainers.map(container => this.docker.getContainer(container.Id).inspect());
            return yield Promise.all(inspectPromises);
        });
    }
    getContainerByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const containers = yield this.docker.listContainers({ all: true });
            const container = containers.find(container => container.Names.includes(`/${name}`));
            if (!container)
                return null;
            return this.docker.getContainer(container.Id);
        });
    }
    /**
     * Get all images that are minecraft servers, the images have a name
     * that starts with "mg-"
     */
    getImageGames() {
        return __awaiter(this, void 0, void 0, function* () {
            const images = yield this.docker.listImages({ all: true });
            const minecraftImages = images.filter(image => image.RepoTags && image.RepoTags[0] && image.RepoTags[0].startsWith("mg-"));
            const inspectPromises = minecraftImages.map(image => this.docker.getImage(image.Id).inspect());
            return yield Promise.all(inspectPromises);
        });
    }
    /**
     * Get a service by its id
     * @param id The id of the service
     **/
    getService(id) {
        return this.docker.getContainer(id);
    }
}
exports.default = DockerManager;
