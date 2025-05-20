import { promises as fs } from 'fs';
import { join, resolve, dirname, sep } from 'path';
import { homedir } from 'os';

export const navigation = {
    async goUp(currentPath) {
        const rootPath = currentPath.split(sep)[0] + sep;
        const parentPath = dirname(currentPath);

        // Если мы уже в корневой директории, возвращаем текущий путь
        if (parentPath === currentPath || parentPath === rootPath) {
            return currentPath;
        }

        return parentPath;
    },

    async changeDirectory(currentPath, targetPath) {
        const newPath = resolve(currentPath, targetPath);

        try {
            const stats = await fs.stat(newPath);
            if (!stats.isDirectory()) {
                throw new Error('Not a directory');
            }
            return newPath;
        } catch (error) {
            throw new Error('Operation failed');
        }
    },

    async listDirectory(currentPath) {
        try {
            const items = await fs.readdir(currentPath);
            const itemsWithStats = await Promise.all(
                items.map(async (item) => {
                    const fullPath = join(currentPath, item);
                    const stats = await fs.stat(fullPath);
                    return {
                        name: item,
                        isDirectory: stats.isDirectory(),
                        type: stats.isDirectory() ? 'directory' : 'file'
                    };
                })
            );

            // Сортируем: сначала директории, потом файлы, всё по алфавиту
            const sortedItems = itemsWithStats.sort((a, b) => {
                if (a.isDirectory === b.isDirectory) {
                    return a.name.localeCompare(b.name);
                }
                return b.isDirectory - a.isDirectory;
            });

            // Выводим результат
            console.log('\nDirectory contents:');
            console.log('Type\t\tName');
            console.log('----------------------------');
            sortedItems.forEach(item => {
                console.log(`${item.type.padEnd(15)}\t${item.name}`);
            });
            console.log('----------------------------\n');
        } catch (error) {
            throw new Error('Operation failed');
        }
    }
}; 