const readline = require('readline');
const { spawn } = require('child_process');
const { exec } = require('child_process');



const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



// 사용자 입력 처리
rl.on('line', (input) => {
    if (input === 'user') {

        const child = spawn('node', ['./user/main_user.js']);

        child.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        child.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        child.on('close', (code) => {
            console.log(`Child process exited with code ${code}`);
        });

    } else if (input === 'supplier') {
        const child = spawn('node', ['./supplier/main_supplier.js']);

        child.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        child.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        child.on('close', (code) => {
            console.log(`Child process exited with code ${code}`);
        });
    } else {
        console.log("Invalid input. Please type 'user' or 'supplier'.");
    }
});

console.log("Who are you? Type 'user' or 'supplier':");