const authFunction = require('./auth');


const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("Who are you? Type 'user' or 'supplier':");

rl.on('line', (input) => {
    authFunction(input);
});
