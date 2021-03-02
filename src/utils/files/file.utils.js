const fs = require('fs-extra');
const pathUtils = require('./path.utils');

class FileUtils {

    constructor() { }

    async removeDirectoryIfExists(targetPath) {
        if (!await this.isPathExists(targetPath)) {
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
            throw new Error(`targetPath not received: ${targetPath} (1000025)`);
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

    isDirectoryPath(path) {
        const stats = fs.statSync(path);
        return stats.isDirectory();
    }

/*     async read(targetPath) {
        return await fs.readFile(targetPath, 'utf-8');
    }

    async appendFile(data) {
        const { targetPath, message } = data;
        if (!targetPath) {
            throw new Error(`targetPath not found: ${targetPath} (1000026)`);
        }
        if (!message) {
            throw new Error(`message not found: ${message} (1000027)`);
        }
        if (!await this.isPathExists(targetPath)) {
            await fs.promises.mkdir(pathUtils.getDirName(targetPath), { recursive: true }).catch();
        }
        // Append the message to the file.
        await fs.appendFile(targetPath, message);
    }

    isFilePath(path) {
        const stats = fs.statSync(path);
        return stats.isFile();
    }*/
}

module.exports = new FileUtils();