const net = require('net');
const { exec } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const process = require('process');
const { execSync } = require('child_process');

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

const config = require('./supplier_config.json');
const host = config.user_ip;
const userPort = config.user_port;
const textPort = config.sign_text_port; // Port for text communication
const filePort = config.sign_file_port; // Port for file transfer



let puk_val;
let prk_val;
let sign_val;

const textClient = new net.Socket();
textClient.connect(userPort, host, () => {
    // console.log('Connected to the text server'); - test code
    // rl.prompt();

    // rl.on('line', (line) => {
    //     textClient.write(line);
    //     rl.prompt();
    // });
    console.time('sign_time');
    textClient.write('auth request');
});

textClient.on('data', (data) => {
    const message = data.toString().trim();
    console.log(`Server: ${message}`);

    // Check if the message is a random value
    if (message.startsWith('Random Value: ')) {
        const randomValue = message.split('Random Value: ')[1];
        handleNonceSign(randomValue);
    }
    else if (message.startsWith('verify OK')) {
        // console.log('message: ' + message); -- test code
        console.timeEnd('sign_time');
        textClient.end();
    }
    // rl.prompt();
});

textClient.on('close', () => {
    console.log('Connection to the text server closed');
    // rl.close();
});

textClient.on('error', (err) => {
    console.error(`Error: ${err.message}`);
});

function handleNonceSign(randomValue) {
    // console.log('Executing keygen_sign...'); -- test code
    keygen_sign(() => {
        nonce_sign_raw(randomValue, prk_val);
    });

    // console.log('Saving random value to nonce.txt and executing nonce_sign...'); -- test code
    // fs.writeFile('nonce.txt', randomValue, (err) => {
    //     if (err) {
    //         console.error(`Error writing to file: ${err}`);
    //         return;
    //     }
    // });
}

function keygen_sign(callback) {
    let keygen_out = execSync('../../DigitalSignature/dmodule --keygen -r', (error, stdout, stderr) => {
        if (error) {
            console.error(`Execution error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        // console.log(`keygen_sign Output: ${stdout}`); -- test code
    });
    puk_val = ((keygen_out.toString()).match(/puk=(.*?)prk=/))[1];
    prk_val = ((keygen_out.toString()).match(/prk=([^&]+)/))[1];
    // console.log('puk_val: ' + puk_val);
    // console.log('prk_val: ' + prk_val);
    // sendData('puk=' + puk_val);
    textClient.write('puk=' + puk_val);
    callback();
    // nonce_sign();
}

function nonce_sign_raw(dataVal, prkVal) {
    let sign_out = execSync(`../../DigitalSignature/dmodule -s -r ${dataVal} ${prkVal}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Execution error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        // console.log(`keygen_sign Output: ${stdout}`); -- test code
    });
    sign_val = ((sign_out.toString()).match(/sign=([^&]+)/))[1];
    // console.log('sign_val: ' + sign_val);
    textClient.write('sign=' + sign_val);
    // textClient.end();
    // sendData('sign=' + sign_val);
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
        // console.log(`nonce_sign Output: ${stdout}`); -- test code
       // 파일 전송은 여기서 실행
       if (fs.existsSync('./dilithium_signed.bin')) {
        sendFile('./dilithium_signed.bin');
    } else {
        console.error('File not found: ./dilithium_signed.bin');
    }
    });
}


function sendData(data) {
    textClient.write(data);
    // textClient.end();
    // const Client = new net.Socket();
    // Client.connect(userPort, host, () => {
    //     // console.log(`Connected to the file server for sending ${filePath}`); -- test code
    //     Client.write(data);
    //     Client.end();
    // });
    
}


function sendFile(filePath) {
    const fileClient = new net.Socket();
    fileClient.connect(filePort, host, () => {
        // console.log(`Connected to the file server for sending ${filePath}`); -- test code
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



