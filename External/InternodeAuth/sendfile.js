const net = require('net');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const config = require('./config.json');
const port = config.server_port;
const host = config.server_ip;

const client = new net.Socket();
client.connect(port, host, () => {
    console.log('Connected to the server');
    sendFile(client, 'exampleFile.txt'); // Replace 'exampleFile.txt' with your file name
});

function sendFile(socket, filePath) {
    const readStream = fs.createReadStream(filePath);
    readStream.on('open', () => {
        readStream.pipe(socket);
    });
    readStream.on('error', (err) => {
        console.error(`Error reading file: ${err}`);
    });
}

client.on('close', () => {
    console.log('Connection closed');
    rl.close();
});

client.on('error', (err) => {
    console.error(`Error: ${err.message}`);
});
