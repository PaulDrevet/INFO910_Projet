"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameMode_1 = __importDefault(require("../../models/GameMode"));
const Main_1 = __importDefault(require("../../Main"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
const child_process_1 = __importDefault(require("child_process"));
const dockerUtils_1 = require("../../utils/dockerUtils");
class GameModeManager {
    /**
     * Retrieves a game mode by its name.
     * @param gameName {string} - The name of the game mode.
     * @returns {Promise<HydratedDocument<IGameMode> | null>} - The game mode document.
     */
    async get(gameName) {
        return await GameMode_1.default.findByName(gameName);
    }
    /**
     * Retrieves the next game ID for a specific game.
     * @param gameName {string} - The name of the game.
     * @returns {Promise<string>} - The next game ID.
     */
    async nextGameID(gameName) {
        const containers = await Main_1.default.docker().getContainers().get({ nameStartsWith: `gm-${gameName}` });
        return `gm-${gameName}-${containers.length + 1}`;
    }
    /**
     * Starts a new game server for the specified game mode.
     * @param gameName {string} - The name of the game mode.
     * @returns {Promise<Container>} - The newly created and started container.
     */
    async start(gameName) {
        const game = await this.get(gameName);
        if (!game) {
            Main_1.default.log().error(`Game mode ${gameName} not found.`);
            return null;
        }
        const nextGameID = await this.nextGameID(gameName);
        if (!nextGameID) {
            Main_1.default.log().error(`Error generating next game ID for ${gameName}.`);
            return null;
        }
        const containerOptions = this.getNextContainerOptions(game, nextGameID);
        const container = await Main_1.default.docker().getDocker().createContainer(containerOptions);
        Main_1.default.log().info(`Starting server "${containerOptions.name}" ...`);
        await container.start();
        Main_1.default.log().info(`Successfully started server "${containerOptions.name}".`);
        return container;
    }
    /**
     * Stops all game servers matching the filter.
     * If no filter is provided, stops all game servers.
     * @param filter {FilterContainer} - Optional filter for stopping game servers.
     * @returns {Promise<void>}
     */
    async stopAll(filter) {
        if (filter.name) {
            const game = await this.get(filter.name);
            if (!game) {
                Main_1.default.log().error(`Game mode ${filter.name} not found.`);
                return;
            }
            filter.nameStartsWith = `gm-${game.name}`;
            delete filter.name; // Remove `name` filter to avoid conflicts
        }
        await Main_1.default.docker().getContainers().stopAll(filter);
        Main_1.default.log().info(`Stopped all containers matching filter: ${JSON.stringify(filter)}`);
    }
    /**
     * Retrieves all containers associated with a specific game mode.
     * @param gameName {string} - The name of the game mode.
     * @returns {Promise<ContainerInfo[]>} - A list of containers for the game mode.
     */
    async getContainers(gameName) {
        const game = await this.get(gameName);
        if (!game) {
            Main_1.default.log().error(`Game mode ${gameName} not found.`);
            return [];
        }
        return await Main_1.default.docker().getContainers().get({ nameStartsWith: `gm-${game.name}` });
    }
    /**
     * Retrieves all images associated with a specific game mode.
     * @param gameName {string} - The name of the game mode.
     * @returns {Promise<ImageInspectInfo[] | null>} - A list of images for the game mode.
     */
    async getImage(gameName) {
        const game = await this.get(gameName);
        if (!game) {
            Main_1.default.log().error(`Game mode ${gameName} not found.`);
            return null;
        }
        const image = await Main_1.default.docker().getImages().getByName(game.imageName);
        if (!image) {
            Main_1.default.log().error(`Image ${game.imageName} not found.`);
            return null;
        }
        return image;
    }
    /**
     * Builds the Docker image for a specific game mode.
     *
     * @param gameName {string} - The name of the game mode.
     */
    async build(gameName) {
        const imageConfig = await GameMode_1.default.findByName(gameName);
        if (!imageConfig) {
            throw new Error(`Config for gamemode ${gameName} not found`);
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
            const exec = util_1.default.promisify(child_process_1.default.exec);
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
                        { from: 'world/', to: '/data/world/', },
                        { from: 'config/', to: '/config/', },
                    ]
                },
                environment: {
                    description: "Set the environment variables",
                    environment: [
                        { key: 'EULA', value: 'TRUE' },
                        { key: 'TYPE', value: 'CUSTOM' },
                        { key: 'CUSTOM_SERVER', value: '/data/paper.jar' },
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
    /**
     * Retrieves the next container for a specific game mode.
     *
     * @param game {HydratedDocument<IGameMode>} - The game mode document.
     * @param nextGameID {string} - The next game ID.
     */
    getNextContainerOptions(game, nextGameID) {
        return ({
            Image: game.imageName,
            name: nextGameID,
            Env: [
                'SERVER_ID=' + nextGameID,
                'OPS=RealDragonMA,Pourtoutix'
            ],
            HostConfig: {
                NetworkMode: 'bridge',
                Binds: [
                    '/home/bastion/jars/paper.jar:/data/paper.jar'
                ],
            },
            NetworkingConfig: {
                EndpointsConfig: {
                    velocity: {},
                    backend: {},
                }
            }
        });
    }
}
exports.default = GameModeManager;
