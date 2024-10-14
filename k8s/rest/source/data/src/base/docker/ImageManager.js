"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ImageManager {
    constructor(docker) {
        this.docker = docker;
    }
    /**
     * Retrieve an image by its name.
     * @param name - The name of the image.
     * @returns {Promise<ImageInspectInfo | null>} Image info if found, otherwise null.
     */
    async getByName(name) {
        try {
            const images = await this.docker.listImages();
            const imageInfo = images.find(image => image.RepoTags && image.RepoTags[0] && image.RepoTags[0].includes(name));
            if (imageInfo) {
                return await this.docker.getImage(imageInfo.Id).inspect();
            }
            return null;
        }
        catch (error) {
            console.error(`Error retrieving image by name: ${name}`, error);
            return null;
        }
    }
    /**
     * Retrieve images based on a filter.
     * @param filter - The filter object to apply.
     * @returns {Promise<ImageInfo[]>} A list of images matching the filter criteria.
     */
    async get(filter) {
        const images = await this.docker.listImages({ all: true });
        return images.filter(image => {
            const imageName = image.RepoTags ? image.RepoTags[0] : '';
            // Filter by name
            if (filter.name && !imageName.includes(filter.name)) {
                return false;
            }
            if (filter.nameStartsWith && !imageName.startsWith(filter.nameStartsWith)) {
                return false;
            }
            if (filter.nameIncludes && !imageName.includes(filter.nameIncludes)) {
                return false;
            }
            // Filter by size
            if (filter.sizeGreaterThan && image.Size <= filter.sizeGreaterThan) {
                return false;
            }
            if (filter.sizeLessThan && image.Size >= filter.sizeLessThan) {
                return false;
            }
            return true;
        });
    }
    /**
     * Deletes an image by its name.
     * @param name - The name of the image to delete.
     * @returns {Promise<void>}
     */
    async delete(name) {
        const image = await this.getByName(name);
        if (image) {
            await this.docker.getImage(image.Id).remove();
            console.log(`Deleted image: ${name}`);
        }
        else {
            console.error(`Image ${name} not found`);
        }
    }
    /**
     * Check if an image exists.
     * @param imageName {string} The image name.
     */
    async isImageExist(imageName) {
        const images = await this.docker.listImages();
        let imagesWithoutTags = [];
        for (let image of images) {
            if (image.RepoTags && image.RepoTags[0]) {
                imagesWithoutTags.push(image.RepoTags[0].split(":")[0]);
            }
        }
        return imagesWithoutTags.includes(imageName);
    }
    /**
     * Inspect an image and return detailed information.
     * @param name - The name of the image.
     * @returns {Promise<ImageInspectInfo | null>} Detailed image information if found, otherwise null.
     */
    async inspect(name) {
        const image = await this.getByName(name);
        if (image) {
            return image;
        }
        return null;
    }
}
exports.default = ImageManager;
