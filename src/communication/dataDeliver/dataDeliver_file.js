const sendFunction = require('./sender');
const recieveFunction = require('./reciever');

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


rl.on('line', (input) => {
    if(input === '1'){
        recieveFunction();
    }
    else if (input === '2'){
        sendFunction('127.0.0.1', 6000, 'txt', 'Hello, this is a test message.');
        // sendFunction('127.0.0.1', 6000, 'file', './testfile.txt');
    }
});
