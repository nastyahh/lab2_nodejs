import { createReadStream, createWriteStream, promises as fs } from 'fs';
import { join, dirname } from 'path';
import { pipeline } from 'stream/promises';
import { createHash } from 'crypto';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';

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
    },

    async calculateHash(filePath, currentPath) {
        try {
            const fullPath = join(currentPath, filePath);
            const fileStream = createReadStream(fullPath);
            const hash = createHash('sha256');

            for await (const chunk of fileStream) {
                hash.update(chunk);
            }

            console.log('\nFile hash:');
            console.log('----------------------------');
            console.log(hash.digest('hex'));
            console.log('----------------------------\n');
        } catch (error) {
            throw new Error('Operation failed');
        }
    },

    async compressFile(sourcePath, targetPath, currentPath) {
        try {
            const sourceFilePath = join(currentPath, sourcePath);
            const targetFilePath = join(currentPath, targetPath);

            // Проверяем существование исходного файла
            await fs.access(sourceFilePath);

            const readStream = createReadStream(sourceFilePath);
            const writeStream = createWriteStream(targetFilePath);
            const brotliCompress = createBrotliCompress();

            await pipeline(readStream, brotliCompress, writeStream);

            console.log('\nFile compressed successfully');
            console.log('----------------------------');
            console.log(`Source: ${sourceFilePath}`);
            console.log(`Target: ${targetFilePath}`);
            console.log('----------------------------\n');
        } catch (error) {
            throw new Error('Operation failed');
        }
    },

    async decompressFile(sourcePath, targetPath, currentPath) {
        try {
            const sourceFilePath = join(currentPath, sourcePath);
            const targetFilePath = join(currentPath, targetPath);

            // Проверяем существование исходного файла
            await fs.access(sourceFilePath);

            const readStream = createReadStream(sourceFilePath);
            const writeStream = createWriteStream(targetFilePath);
            const brotliDecompress = createBrotliDecompress();

            await pipeline(readStream, brotliDecompress, writeStream);

            console.log('\nFile decompressed successfully');
            console.log('----------------------------');
            console.log(`Source: ${sourceFilePath}`);
            console.log(`Target: ${targetFilePath}`);
            console.log('----------------------------\n');
        } catch (error) {
            throw new Error('Operation failed');
        }
    }
}; 