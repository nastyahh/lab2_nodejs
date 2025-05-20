import { EOL, cpus, homedir, userInfo, arch } from 'os';

export const osInfo = {
    getEOL() {
        console.log('\nSystem EOL:');
        console.log('----------------------------');
        console.log(JSON.stringify(EOL));
        console.log('----------------------------\n');
    },

    getCPUs() {
        const cpuInfo = cpus();
        console.log('\nCPU Information:');
        console.log('----------------------------');
        console.log(`Total CPUs: ${cpuInfo.length}`);
        console.log('\nCPU Details:');
        cpuInfo.forEach((cpu, index) => {
            const speedGHz = (cpu.speed / 1000).toFixed(2);
            console.log(`CPU ${index + 1}:`);
            console.log(`  Model: ${cpu.model}`);
            console.log(`  Speed: ${speedGHz} GHz`);
        });
        console.log('----------------------------\n');
    },

    getHomeDir() {
        console.log('\nHome Directory:');
        console.log('----------------------------');
        console.log(homedir());
        console.log('----------------------------\n');
    },

    getUsername() {
        console.log('\nSystem Username:');
        console.log('----------------------------');
        console.log(userInfo().username);
        console.log('----------------------------\n');
    },

    getArchitecture() {
        console.log('\nCPU Architecture:');
        console.log('----------------------------');
        console.log(arch());
        console.log('----------------------------\n');
    }
}; 