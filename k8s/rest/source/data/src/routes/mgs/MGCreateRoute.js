"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractRoute_1 = require("../../base/AbstractRoute");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("../../utils/utils");
const Main_1 = __importDefault(require("../../Main"));
class MGCreateRoute extends AbstractRoute_1.AbstractRoute {
    constructor() {
        super(...arguments);
        this.run = async (req, reply) => {
            const { name, description, cpuLimitation, ramLimitation, maxPlayers, environment } = req.body;
            if (!name) {
                return reply.status(400).send({ error: "Name is required" });
            }
            Main_1.default.log().debug("Creation of a new Minecraft game server image...");
            const baseDir = '/home/bastion/images';
            const imageName = `mg-${(0, utils_1.slugify)(name.toLowerCase())}`;
            const pluginDir = path_1.default.join(baseDir, (0, utils_1.slugify)(name.toLowerCase()));
            try {
                // Créer le dossier si nécessaire
                if (!fs_1.default.existsSync(pluginDir)) {
                    fs_1.default.mkdirSync(pluginDir, { recursive: true });
                }
                Main_1.default.log().debug(`Building dockerfile for image ${imageName} at ${pluginDir}`);
                let imageFrom = 'my-minecraft-server';
                let copyFiles = [
                    { from: 'plugins/', to: '/plugins/' },
                    { from: 'world/', to: '/world/' }
                ];
                let defaultEnvironment = [
                    { key: 'EULA', value: 'TRUE' },
                    { key: 'ONLINE_MODE', value: 'FALSE' },
                    { key: 'TYPE', value: 'PAPER' },
                    { key: 'USE_AIKAR_FLAGS', value: 'true' },
                    { key: 'VERSION', value: '1.20.1' },
                    { key: 'IMAGE', value: imageName },
                    { key: 'DESCRIPTION', value: description },
                    { key: 'GAME_NAME', value: name },
                    { key: 'CPU_LIMITATION', value: cpuLimitation.toString() },
                    { key: 'RAM_LIMITATION', value: ramLimitation.toString() },
                    { key: 'MAX_PLAYERS', value: maxPlayers.toString() },
                    { key: 'RABBIT_URI', value: process.env.RABBIT_URI },
                    { key: 'IS_MINIGAME', value: 'true' },
                    ...environment
                ];
                let volumes = ['/data'];
                let commands = ['start'];
                // Écrire le fichier Dockerfile
                let dockerfileContent;
                dockerfileContent = "# This Dockerfile was generated automatically\n";
                dockerfileContent += "# Do not edit it manually\n\n";
                dockerfileContent += "# Base image\n";
                dockerfileContent += `FROM ${imageFrom}\n\n`;
                dockerfileContent += "# Copy files\n";
                for (let file of copyFiles) {
                    dockerfileContent += `COPY ${file.from} ${file.to}\n`;
                }
                dockerfileContent += "\n";
                dockerfileContent += "# Environment variables\n";
                for (let env of defaultEnvironment) {
                    dockerfileContent += `ENV ${env.key}="${env.value}"\n`;
                }
                dockerfileContent += "\n";
                dockerfileContent += "# Volumes\n";
                dockerfileContent += `VOLUME ${volumes.join(' ')}\n`;
                dockerfileContent += "\n";
                dockerfileContent += "# Commands\n";
                dockerfileContent += `CMD ["${commands.join('", "')}"]\n`;
                fs_1.default.writeFileSync(path_1.default.join(pluginDir, 'dockerfile'), dockerfileContent);
                // Create the folder plugins and world
                fs_1.default.mkdirSync(path_1.default.join(pluginDir, 'plugins'), { recursive: true });
                fs_1.default.mkdirSync(path_1.default.join(pluginDir, 'world'), { recursive: true });
                // Construire l'image Docker
                Main_1.default.log().debug(`Building image ${imageName}...`);
                const buildStream = await Main_1.default.docker().getDocker().buildImage({
                    context: pluginDir,
                    src: ['dockerfile', 'plugins/', 'world/']
                }, { t: imageName });
                // Gestion du flux de construction
                await new Promise((resolve, reject) => {
                    Main_1.default.docker().getDocker().modem.followProgress(buildStream, (err, res) => {
                        if (err) {
                            reply.status(500).send({ error: "Erreur lors de la construction de l'image Docker.", err });
                        }
                        else {
                            resolve(res);
                        }
                    });
                });
                Main_1.default.log().debug(`Image ${imageName} created successfully !`);
                return reply.status(200).send({ message: `Image ${imageName} created successfully.` });
            }
            catch (error) {
                console.error("Erreur lors de la création du dossier d'image ou de la construction de l'image Docker :", error);
                return reply.status(500).send({ error: "Erreur lors de la création du dossier d'image ou de la construction de l'image Docker." });
            }
        };
    }
}
exports.default = MGCreateRoute;
