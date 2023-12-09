const net = require('net');
const { execSync } = require('child_process');
const readline = require('readline');

const config = require('./supplier_config.json');
const host = config.user_ip;
const userPort = config.user_port;

console.log('1111');

let puk_val;
let prk_val;
let sign_val;




const textClient = new net.Socket();
textClient.connect(userPort, host, () => {
    console.log(111111);
    console.time('sign_time');
    textClient.write('auth request');
});

textClient.on('data', (data) => {
    console.log(data);
    const message = data.toString().trim();
    console.log(`Server: ${message}`);

    // Check if the message is a random value
    if (message.startsWith('Random Value: ')) {
        const randomValue = message.split('Random Value: ')[1];
        console.log(randomValue);
        handleNonceSign(randomValue);
    }
    else if (message.startsWith('verify OK')) {
        // console.log('message: ' + message); -- test code
        console.timeEnd('sign_time');
        textClient.end();
    }
});

textClient.on('close', () => {
    console.log('Connection to the text server closed');
    // rl.close();
});

textClient.on('error', (err) => {
    console.error(`Error: ${err.message}`);
});

function handleNonceSign(randomValue) {
    keygen_sign(() => {
        nonce_sign_raw(randomValue, prk_val);
    });

}

function keygen_sign(callback) {
    let keygen_out = execSync('./DigitalSignature/dmodule --keygen -r', (error, stdout, stderr) => {
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
  
    textClient.write('puk=' + puk_val);
    callback();
}

function nonce_sign_raw(dataVal, prkVal) {

    let sign_out = execSync(`./DigitalSignature/dmodule -s -r ${dataVal} ${prkVal}`, (error, stdout, stderr) => {
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

}

