import { createReadStream, createWriteStream, promises as fs } from 'fs';
import { join, dirname } from 'path';
import { pipeline } from 'stream/promises';

export const fileOperations = {
    async readFile(filePath) {
        try {
            const readStream = createReadStream(filePath, 'utf-8');
            let content = '';

            for await (const chunk of readStream) {
                content += chunk;
            }

            console.log('\nFile contents:');
            console.log('----------------------------');
            console.log(content);
            console.log('----------------------------\n');
        } catch (error) {
            throw new Error('Operation failed');
        }
    },

    async createFile(fileName, currentPath) {
        try {
            const filePath = join(currentPath, fileName);
            await fs.writeFile(filePath, '');
        } catch (error) {
            throw new Error('Operation failed');
        }
    },

    async renameFile(oldPath, newFileName, currentPath) {
        try {
            const oldFilePath = join(currentPath, oldPath);
            const newFilePath = join(currentPath, newFileName);
            await fs.rename(oldFilePath, newFilePath);
        } catch (error) {
            throw new Error('Operation failed');
        }
    },

    async copyFile(sourcePath, targetPath, currentPath) {
        try {
            const sourceFilePath = join(currentPath, sourcePath);
            const targetDirPath = join(currentPath, targetPath);

            // Проверяем, что целевая директория существует
            const targetDirStats = await fs.stat(targetDirPath);
            if (!targetDirStats.isDirectory()) {
                throw new Error('Target is not a directory');
            }

            const fileName = sourcePath.split('/').pop();
            const targetFilePath = join(targetDirPath, fileName);

            const readStream = createReadStream(sourceFilePath);
            const writeStream = createWriteStream(targetFilePath);

            await pipeline(readStream, writeStream);
        } catch (error) {
            throw new Error('Operation failed');
        }
    },

    async moveFile(sourcePath, targetPath, currentPath) {
        try {
            // Сначала копируем файл
            await this.copyFile(sourcePath, targetPath, currentPath);

            // Затем удаляем исходный файл
            const sourceFilePath = join(currentPath, sourcePath);
            await fs.unlink(sourceFilePath);
        } catch (error) {
            throw new Error('Operation failed');
        }
    },

    async removeFile(filePath, currentPath) {
        try {
            const fullPath = join(currentPath, filePath);
            await fs.unlink(fullPath);
        } catch (error) {
            throw new Error('Operation failed');
        }
    }
}; 