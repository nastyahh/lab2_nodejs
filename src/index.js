import { homedir } from 'os';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createInterface } from 'readline';
import { navigation } from './navigation.js';
import { fileOperations } from './fileOperations.js';
import { osInfo } from './osInfo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let username = '';
let currentDirectory = homedir();

const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--username=')) {
        username = args[i].split('=')[1];
        break;
    }
}

if (!username) {
    console.error('Please provide username using --username flag');
    process.exit(1);
}

console.log(`Welcome to the File Manager, ${username}!`);
console.log(`You are currently in ${currentDirectory}`);

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

const handleCommand = async (input) => {
    const [command, ...args] = input.trim().split(' ');

    try {
        switch (command) {
            case 'up':
                currentDirectory = await navigation.goUp(currentDirectory);
                break;
            case 'cd':
                if (!args[0]) {
                    console.log('Invalid input');
                    return;
                }
                currentDirectory = await navigation.changeDirectory(currentDirectory, args[0]);
                break;
            case 'ls':
                await navigation.listDirectory(currentDirectory);
                break;
            case 'cat':
                if (!args[0]) {
                    console.log('Invalid input');
                    return;
                }
                await fileOperations.readFile(join(currentDirectory, args[0]));
                break;
            case 'add':
                if (!args[0]) {
                    console.log('Invalid input');
                    return;
                }
                await fileOperations.createFile(args[0], currentDirectory);
                break;
            case 'rn':
                if (args.length !== 2) {
                    console.log('Invalid input');
                    return;
                }
                await fileOperations.renameFile(args[0], args[1], currentDirectory);
                break;
            case 'cp':
                if (args.length !== 2) {
                    console.log('Invalid input');
                    return;
                }
                await fileOperations.copyFile(args[0], args[1], currentDirectory);
                break;
            case 'mv':
                if (args.length !== 2) {
                    console.log('Invalid input');
                    return;
                }
                await fileOperations.moveFile(args[0], args[1], currentDirectory);
                break;
            case 'rm':
                if (!args[0]) {
                    console.log('Invalid input');
                    return;
                }
                await fileOperations.removeFile(args[0], currentDirectory);
                break;
            case 'os':
                if (!args[0]) {
                    console.log('Invalid input');
                    return;
                }
                switch (args[0]) {
                    case '--EOL':
                        osInfo.getEOL();
                        break;
                    case '--cpus':
                        osInfo.getCPUs();
                        break;
                    case '--homedir':
                        osInfo.getHomeDir();
                        break;
                    case '--username':
                        osInfo.getUsername();
                        break;
                    case '--architecture':
                        osInfo.getArchitecture();
                        break;
                    default:
                        console.log('Invalid input');
                }
                break;
            case 'hash':
                if (!args[0]) {
                    console.log('Invalid input');
                    return;
                }
                await fileOperations.calculateHash(args[0], currentDirectory);
                break;
            case '.exit':
                console.log(`Thank you for using File Manager, ${username}, goodbye!`);
                process.exit(0);
            default:
                console.log('Invalid input');
        }
        if (command !== 'os' && command !== 'hash') {
            console.log(`You are currently in ${currentDirectory}`);
        }
    } catch (error) {
        console.log('Operation failed');
    }
};

rl.on('line', handleCommand);

process.on('SIGINT', () => {
    console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
    process.exit(0);
}); 