const net = require('net');
const { exec } = require('child_process');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const config = require('./config.json');
const textPort = config.server_port; // Port for text communication
const filePort = config.file_port; // Port for file transfer
const host = config.server_ip;

const textClient = new net.Socket();

textClient.connect(textPort, host, () => {
    console.log('Connected to the text server');
    rl.prompt();

    rl.on('line', (line) => {
        textClient.write(line);
        rl.prompt();
    });
});

textClient.on('data', (data) => {
    const message = data.toString().trim();
    console.log(`Server: ${message}`);

    // Check if the message is a random value
    if (message.startsWith('Random Value: ')) {
        const randomValue = message.split('Random Value: ')[1];
        handleNonceSign(randomValue);
    }

    rl.prompt();
});

textClient.on('close', () => {
    console.log('Connection to the text server closed');
    rl.close();
});

textClient.on('error', (err) => {
    console.error(`Error: ${err.message}`);
});

function handleNonceSign(randomValue) {
    console.log('Executing keygen_sign...');
    keygen_sign();

    console.log('Saving random value to nonce.txt and executing nonce_sign...');
    fs.writeFile('nonce.txt', randomValue, (err) => {
        if (err) {
            console.error(`Error writing to file: ${err}`);
            return;
        }
        nonce_sign(() => {
            sendFile('dilithium_signed.bin', () => {
              sendFile('dilithium_key.puk');
            }); // Replace 'exampleFile.txt' with your actual file name
        });
    });
}

function keygen_sign() {
    exec('./dmodule --keygen', (error, stdout, stderr) => {
        if (error) {
            console.error(`Execution error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        console.log(`keygen_sign Output: ${stdout}`);
    });
}

function nonce_sign(callback) {
    exec('./dmodule -s nonce.txt dilithium_key.prk', (error, stdout, stderr) => {
        if (error) {
            console.error(`Execution error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        console.log(`nonce_sign Output: ${stdout}`);
        if (callback) {
            callback();
        }
    });
}

function sendFile(filePath, callback) {
    const fileClient = new net.Socket();
    fileClient.connect(31246, host, () => {
        console.log(`Connected to the file server for sending ${filePath}`);
        const readStream = fs.createReadStream(filePath);
        readStream.on('open', () => {
            readStream.pipe(fileClient);
        });
        readStream.on('end', () => {
            fileClient.end();
            console.log(`${filePath} has been sent`);
            if (callback) {
              callback();
            }
        });
        readStream.on('error', (err) => {
            console.error(`Error reading file: ${err}`);
            fileClient.end();
        });
    });
}





