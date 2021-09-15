const fs = require('fs-extra');

class FileUtils {

    constructor() { }

    async read(targetPath) {
        return await fs.readFile(targetPath, 'utf-8');
    }

    async removeDirectoryIfExists(targetPath) {
        if (await this.isPathExists(targetPath)) {
            await fs.remove(targetPath);
        }
    }

    async createDirectoryIfNotExists(targetPath) {
        if (!await this.isPathExists(targetPath)) {
            await fs.mkdir(targetPath);
        }
    }

    async copyDirectory(sourcePath, targetPath, filterFunction) {
        await fs.copy(sourcePath, targetPath, { filter: filterFunction });
    }

    getAllDirectories(targetPath) {
        return fs.readdirSync(targetPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
    }

    async isPathExists(targetPath) {
        // Check if the path parameter was received.
        if (!targetPath) {
            throw new Error(`targetPath not received: ${targetPath} (1000024)`);
        }
        // Check if the path parameter exists.
        try {
            return await fs.stat(targetPath);
        }
        catch (error) {
            return false;
        }
    }

    createDirectory(targetPath) {
        if (!targetPath) {
            return;
        }
        if (!fs.existsSync(targetPath)) {
            fs.mkdirSync(targetPath, { recursive: true });
        }
    }

    isFilePath(path) {
        const stats = fs.statSync(path);
        return stats.isFile();
    }

    isDirectoryPath(path) {
        const stats = fs.statSync(path);
        return stats.isDirectory();
    }
}

module.exports = new FileUtils();