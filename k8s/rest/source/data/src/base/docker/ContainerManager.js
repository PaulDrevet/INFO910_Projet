"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Main_1 = __importDefault(require("../../Main"));
class ContainerManager {
    constructor(docker) {
        this.docker = docker;
    }
    /**
     * Retrieves a container by its name.
     * @param name - The name of the container.
     * @returns {Promise<Container | null>} A container instance if found, otherwise null.
     */
    async getByName(name) {
        const containers = await this.docker.listContainers({ all: true });
        const containerInfo = containers.find(container => container.Names.includes(`/${name}`));
        return containerInfo ? this.docker.getContainer(containerInfo.Id) : null;
    }
    /**
     * Retrieves all containers that match a specific state.
     * @param state - The state of the containers (e.g., running, exited, etc.).
     * @returns {Promise<Container[]>} A list of containers matching the specified state.
     */
    async getByState(state) {
        const containers = await this.docker.listContainers({ all: true });
        const filteredContainers = containers.filter(container => container.State === state);
        return filteredContainers.map(container => this.docker.getContainer(container.Id));
    }
    /**
     * Stops all containers matching the specified filter.
     * If no filter is provided, stops all running containers.
     * @param filter - (Optional) The filter object to apply to the container search.
     * @returns {Promise<void>}
     */
    async stopAll(filter) {
        const containers = filter ? await this.get(filter) : await this.docker.listContainers({ all: true });
        for (const containerInfo of containers) {
            if (containerInfo.State === "running") {
                const container = this.docker.getContainer(containerInfo.Id);
                await container.stop();
                console.log(`Stopped container: ${containerInfo.Names[0]}`);
            }
        }
    }
    /**
     * Starts a new container with the specified properties.
     * @param options - The container properties (e.g., Image, name, environment variables).
     * @returns {Promise<Container>} The newly created and started container.
     */
    async start(options) {
        const container = await this.docker.createContainer(options);
        Main_1.default.log().info(`Starting container "${options.name}" ...`);
        await container.start();
        Main_1.default.log().info(`Successfully started container "${options.name}".`);
        return container;
    }
    /**
     * Inspects a container by its name.
     * @param name - The name of the container to inspect.
     * @returns {Promise<ContainerInfo | null>} Detailed information about the container, or null if not found.
     */
    async inspect(name) {
        const container = await this.getByName(name);
        return container ? await container.inspect() : null;
    }
    /**
     * Retrieves containers based on a filter.
     * Supports filtering by container name, state, and image.
     * @param filter - The filter object to apply to the container search.
     * @returns {Promise<ContainerInfo[]>} A list of containers matching the filter criteria.
     */
    async get(filter) {
        const containers = await this.docker.listContainers({ all: true });
        return containers.filter(container => {
            if (!filter)
                return true;
            if (filter.name && !container.Names.some(name => name === `/${filter.name}`)) {
                return false;
            }
            if (filter.nameStartsWith && !container.Names.some(name => name.startsWith(`/${filter.nameStartsWith}`))) {
                return false;
            }
            if (filter.nameEndsWith && !container.Names.some(name => name.endsWith(filter.nameEndsWith))) {
                return false;
            }
            if (filter.nameIncludes && !container.Names.some(name => name.includes(filter.nameIncludes))) {
                return false;
            }
            // Filtering by state
            if (filter.state && container.State !== filter.state) {
                return false;
            }
            // Filtering by image
            if (filter.image && container.Image !== filter.image) {
                return false;
            }
            return true;
        });
    }
}
exports.default = ContainerManager;
