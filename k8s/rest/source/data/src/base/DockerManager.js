"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dockerode_1 = __importDefault(require("dockerode"));
const Main_1 = __importDefault(require("../Main"));
const GameMode_1 = __importDefault(require("../models/GameMode"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const GameMode_2 = __importDefault(require("../models/GameMode"));
const dockerUtils_1 = require("../utils/dockerUtils");
const util = __importStar(require("util"));
const child_process = __importStar(require("child_process"));
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
     * Create a container that correspond to this exact docker-compose.yml file
     * Start a game server with the image provided
     * Will check if the image is a valid minecraft server image
     * Then it will check all the servers that are currently running with this image by checking Redis
     * The server name will be the image name with a number at the end (that doesn't exist in redis)
     * @param name {string} The image of the game server
     */
    async startGameServer(name) {
        const gameModeConfig = await GameMode_1.default.findByName(name);
        if (!gameModeConfig) {
            throw new Error(`Config for gamemode ${name} not found !`);
        }
        let image = await this.getImageByName(gameModeConfig.imageName);
        if (!image) {
            Main_1.default.log().debug(`Image ${name} not found ! Trying to build it...`);
            try {
                await this.buildImage(name);
            }
            catch (e) {
                Main_1.default.log().error(`Error while building image ${name}: ${e}`);
                throw e;
            }
            image = await this.getImageByName(name);
            if (!image) {
                throw new Error(`Image ${name} not found after building it`);
            }
        }
        const nextGameID = await this.nextGameID(gameModeConfig.imageName);
        try {
            Main_1.default.log().debug(`Creating container ${nextGameID}...`);
            const container = await this.docker.createContainer({
                Image: gameModeConfig.imageName,
                name: nextGameID,
                Env: [
                    'SERVER_ID=' + nextGameID,
                    'RABBIT_URI=' + process.env.RABBIT_URI,
                ],
                HostConfig: {
                    NetworkMode: 'velocity',
                    Binds: [
                        '/home/bastion/jars/paper.jar:/data/paper.jar'
                    ],
                },
                NetworkingConfig: {
                    EndpointsConfig: {
                        velocity: {}
                    }
                }
            });
            Main_1.default.log().debug(`Container ${nextGameID} is starting...`);
            await container.start();
            Main_1.default.log().debug(`Container ${nextGameID} started !`);
            return container;
        }
        catch (e) {
            Main_1.default.log().error(`Error while creating container ${nextGameID}: ${e}`);
            throw e;
        }
    }
    async buildImage(name) {
        const imageConfig = await GameMode_1.default.findByName(name);
        if (!imageConfig) {
            throw new Error(`Config for gamemode ${name} not found`);
        }
        const baseDir = '/home/bastion/images';
        const pluginDir = path_1.default.join(baseDir, imageConfig.name);
        const defaultStarterImageDir = '/home/bastion/default-image-starter';
        try {
            // Créer le dossier si nécessaire
            if (!fs_1.default.existsSync(pluginDir)) {
                fs_1.default.mkdirSync(pluginDir, { recursive: true });
            }
            Main_1.default.log().debug(`Building image ${imageConfig.imageName} at ${pluginDir}...`);
            // Copier tous les fichiers et dossiers de default-starter-image dans pluginDir
            Main_1.default.log().debug(`Copying files from ${defaultStarterImageDir} to ${pluginDir}...`);
            const exec = util.promisify(child_process.exec);
            await exec(`cp -r ${defaultStarterImageDir}/* ${pluginDir}`);
            const copies = [];
            fs_1.default.readdirSync(defaultStarterImageDir).forEach(file => {
                const fullPath = path_1.default.join(defaultStarterImageDir, file);
                if (fs_1.default.lstatSync(fullPath).isDirectory()) {
                    copies.push({ from: `${file}/`, to: `/${file}/` });
                }
            });
            const dockerfile = new dockerUtils_1.DockerfileContent({
                from: {
                    description: ["This image is a Minecraft server image"],
                    image: (0, dockerUtils_1.getItzgMinecraftServerImage)(imageConfig.serverVersion)
                },
                copy: {
                    description: "Copy the plugins and world folders",
                    copies: [...copies,
                        { from: 'world/', to: '/data/world/' },
                    ]
                },
                environment: {
                    description: "Set the environment variables",
                    environment: [
                        { key: 'EULA', value: 'TRUE' },
                        { key: 'TYPE', value: 'CUSTOM' },
                        { key: 'CUSTOM_SERVER', value: '/data/paper.jar' },
                        //{ key: 'VERSION', value: '1.20.1' },
                        { key: 'MAX_PLAYERS', value: imageConfig.maxPlayers },
                        { key: 'MIN_PLAYERS', value: imageConfig.minPlayers },
                        { key: 'GAMEMODE', value: imageConfig.name },
                        { key: 'ONLINE_MODE', value: "FALSE" },
                        { key: 'IS_MINIGAME', value: imageConfig.isMinigame },
                        { key: 'IS_LOBBY', value: imageConfig.isLobby },
                        { key: 'IS_PROXY', value: imageConfig.isProxy },
                        { key: 'MAX_MEMORY', value: imageConfig.dockerSettings.ramLimitation + "G" },
                        { key: 'CPU_LIMIT', value: imageConfig.dockerSettings.cpuLimitation },
                        { key: 'RABBIT_URI', value: process.env.RABBIT_URI },
                        { key: 'MONGO_URI', value: process.env.MONGO_URI },
                        { key: 'MONGO_DATABASE', value: "bastionmc" },
                        { key: 'USE_AIKAR_FLAGS', value: 'TRUE' },
                        ...imageConfig.dockerSettings.env.map(env => ({ key: env.key, value: env.value }))
                    ]
                },
                volumes: {
                    description: "Add the /data volume",
                    volumes: ['/data']
                },
                commands: {
                    description: "Start the server",
                    commands: ['start']
                }
            });
            fs_1.default.writeFileSync(path_1.default.join(pluginDir, 'dockerfile'), dockerfile.toString());
            // Créer les dossiers plugins et world s'ils n'existent pas déjà
            fs_1.default.mkdirSync(path_1.default.join(pluginDir, 'plugins'), { recursive: true });
            fs_1.default.mkdirSync(path_1.default.join(pluginDir, 'world'), { recursive: true });
            // Construire l'image Docker
            Main_1.default.log().debug(`Building image ${imageConfig.imageName}...`);
            const buildStream = await Main_1.default.docker().getDocker().buildImage({
                context: pluginDir,
                src: ['dockerfile', ...dockerfile.getOptions().copy?.copies.map(copy => copy.from) ?? []]
            }, { t: imageConfig.imageName });
            Main_1.default.log().debug(`Image ${imageConfig.imageName} created successfully!`);
            await new Promise((resolve, reject) => {
                //@ts-ignore
                Main_1.default.docker().getDocker().modem.followProgress(buildStream, (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(res);
                    }
                });
            });
        }
        catch (error) {
            console.error("Erreur lors de la création du dossier d'image ou de la construction de l'image Docker :", error);
        }
    }
    async deleteImage(imageName) {
        const image = await this.getImageByName(imageName);
        if (!image) {
            throw new Error(`Image ${imageName} not found`);
        }
        Main_1.default.log().debug(`Deleting image ${imageName}...`);
        await image.remove();
        await GameMode_2.default.deleteOne({ imageName: imageName });
        // Delete the folder at /home/bastion/images/${name}
        const pluginDir = path_1.default.join('/home/bastion/images', imageName.replace("gm-", ""));
        if (fs_1.default.existsSync(pluginDir)) {
            fs_1.default.rmdirSync(pluginDir, { recursive: true });
        }
        Main_1.default.log().debug(`Image ${imageName} deleted !`);
    }
    /**
     * A promise that will resolve when the image exists
     * @param imageName {string} The image name
     */
    async isImageExists(imageName) {
        Main_1.default.log().debug(`Checking if image ${imageName} exists...`);
        const images = await this.docker.listImages();
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
    }
    /**
     * Get an image by its name and return its inspect info
     * @param imageName {string} The image name
     */
    async getImageByName(imageName) {
        try {
            await this.isImageExists(imageName);
            const id = (await this.docker.listImages()).filter(image => image.RepoTags && image.RepoTags[0] && image.RepoTags[0].startsWith(imageName))[0]?.Id;
            if (!id) {
                Main_1.default.log().error(`Image ${imageName} not found, has it been removed ?`);
                return null;
            }
            return (await this.docker.getImage(id));
        }
        catch (e) {
            Main_1.default.log().error(`Image ${imageName} not found, has it been removed ?`);
            return null;
        }
    }
    /**
     * Get the next game id for a game image
     * It will check all the containers that exist with this image
     * The name will be "mg-" + the image name + "-" + the number of containers with this image + 1
     */
    async nextGameID(imageName) {
        const containers = await this.getContainersByGameImage(imageName);
        return `${imageName}-${containers.length + 1}`;
    }
    /**
     * Get all containers that are running with this image
     * @param imageName {string} The image name
     */
    async getContainersByGameImage(imageName) {
        const containers = await this.docker.listContainers({ all: true });
        return containers.filter(container => container.Image.startsWith(imageName)).map(container => this.docker.getContainer(container.Id));
    }
    /**
     * Get all service that are minecraft servers, either minigame or lobby
     */
    async getContainers() {
        const containers = await this.docker.listContainers({ all: true });
        const minecraftContainers = containers.filter(container => container.Image.includes("gm-"));
        const inspectPromises = minecraftContainers.map(container => this.docker.getContainer(container.Id).inspect());
        return await Promise.all(inspectPromises);
    }
    async getContainerByName(name) {
        const containers = await this.docker.listContainers({ all: true });
        const container = containers.find(container => container.Names.includes(`/${name}`));
        if (!container)
            return null;
        return this.docker.getContainer(container.Id);
    }
    /**
     * Get all images that are minecraft servers, the images have a name
     * that starts with "mg-"
     */
    async getImageGames() {
        const images = await this.docker.listImages({ all: true });
        const minecraftImages = images.filter(image => image.RepoTags && image.RepoTags[0] && image.RepoTags[0].startsWith("mg-"));
        const inspectPromises = minecraftImages.map(image => this.docker.getImage(image.Id).inspect());
        return await Promise.all(inspectPromises);
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
