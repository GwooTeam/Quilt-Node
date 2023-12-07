const { spawnSync } = require('child_process');

const child = [];
const numInstances = 100;

for (let i = 1; i <= numInstances; i++) {
    child[i] = spawnSync('node', ['main_supplier.js']);

    console.log(child[i].stdout.toString())

    // child[i].on('close', (code) => {
    //     console.log(`Child ${i} process exited with code ${code}`);
    // });
}