const net = require('net');
const { exec } = require('child_process');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const config = require('./config.json');
const host = config.user_ip;
const textPort = config.user_txt_port; // Port for text communication
const filePort = config.user_file_port; // Port for file transfer

const textClient = new net.Socket();

textClient.connect(textPort, host, () => {
    // console.log('Connected to the text server');
    rl.prompt();
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

    // console.log('Saving random value to nonce.txt and executing nonce_sign...');
    fs.writeFile('nonce.txt', randomValue, (err) => {
        if (err) {
            console.error(`Error writing to file: ${err}`);
            return;
        }
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
        // console.log(`keygen_sign Output: ${stdout}`);
        // 파일 전송은 여기서 실행
        // if (fs.existsSync('./dilithium_key.puk')) {
        sendFile('./dilithium_key.puk');
        // } else {
            // console.error('File not found: ./dilithium_key.puk');
        // }
    });
    nonce_sign();
}

function nonce_sign() {
    exec('node sign.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`Execution error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        // console.log(`nonce_sign Output: ${stdout}`);
       // 파일 전송은 여기서 실행
    //    if (fs.existsSync('./dilithium_signed.bin')) {
        sendFile('./dilithium_signed.bin');
        console.log( 'sendFile dilithium_signed.bin');
    // // } else {
    //     console.error('File not found: ./dilithium_signed.bin');
    // }
    });
    return;
}



function sendFile(filePath) {
    const fileClient = new net.Socket();
    fileClient.connect(filePort, host, () => {
        // console.log(`Connected to the file server for sending ${filePath}`);
        const readStream = fs.createReadStream(filePath);
        readStream.on('open', () => {
            readStream.pipe(fileClient);
        });
        readStream.on('end', () => {
            fileClient.end();
            // console.log(`${filePath} has been sent`);
        });
        readStream.on('error', (err) => {
            console.error(`Error reading file: ${err}`);
            fileClient.end();
        });
    });
}





