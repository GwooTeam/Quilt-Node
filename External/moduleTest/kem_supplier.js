const net = require('net');
const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const config = require('./supplier_config.json');
const textPort = config.server_text_port; // Port for text communication
const filePort = config.server_file_port; // Port for file transfer
const host = config.server_ip;


/* ############### server connect ################ */
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


/* ##################### functions ####################### */


function kem_encapsulate(pukPath, result_path) {
    execSync(`../KEM/modules/kmodule -f --encap --key=${pukPath} --result=${result_path}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Execution error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        console.log(`kem_encapsulate Output: ${stdout}`);
    });
}


function ssk_decrypt(ssk_path, file_path, result_path) {
    var res = execSync(`../KEM/modules/kmodule -f --decrypt --key=${ssk_path} --target=${file_path} --result=${result_path}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Execution error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        console.log(`ssk_decrypt Output: ${stdout}`);
    });

    console.log(res.toString());
}


const fileClient = new net.Socket();

function sendFile(filePath, callback) {

    fileClient.connect(filePort, host, () => {
        console.log(`Connected to the file server for sending ${filePath}`);
        const fileContent = fs.readFileSync(filePath);

        fileClient.write(fileContent);
        // fileClient.end();
    });
}


let receivedData = Buffer.from([]);
fileClient.on('data', (data) => {
    receivedData = Buffer.concat([receivedData, data]);
});


fileClient.on('end', () => {
    
    // 서버에서 받은 작업 완료된 파일을 클라이언트에 저장
    const filename = 'suppResource/received_encrypted.bin';
    fs.writeFileSync(filename, receivedData);
    console.log('File transfer completed');

    // 소켓 연결 종료
    fileClient.end();
    fileClient.destroy();

    const ssk_path = 'suppResource/kyber_sharedSecret.ssk';
    const enc_path = 'suppResource/received_encrypted.bin';
    const result_path = 'suppResource/';
    console.log('line 131');

    ssk_decrypt(ssk_path, enc_path, result_path);
    
})



/* ############### send file ############### */
const puk_path = 'suppResource/kyber_key.puk';
const capsule_save_path = 'suppResource/';
const capsule_file_path = 'suppResource/kyber_encapsulated.cap';

async function runFunctions() {
    console.log('capsulation start: ' + (new Date()).getTime());
    await kem_encapsulate(puk_path, capsule_save_path);
    await sendFile(capsule_file_path);
}

runFunctions();

// kem_encapsulate(puk_path, capsule_save_path)

// sendFile(capsule_file_path);


// function handleNonceSign(randomValue) {
//     console.log('Executing keygen_sign...');
//     keygen_sign();

//     console.log('Saving random value to nonce.txt and executing nonce_sign...');
//     fs.writeFile('nonce.txt', randomValue, (err) => {
//         if (err) {
//             console.error(`Error writing to file: ${err}`);
//             return;
//         }
//         nonce_sign(() => {
//             sendFile('dilithium_signed.bin', () => {
//               sendFile('dilithium_key.puk');
//             }); // Replace 'exampleFile.txt' with your actual file name
//         });
//     });
// }


// function nonce_sign(callback) {
//     exec('./dmodule -s nonce.txt dilithium_key.prk', (error, stdout, stderr) => {
//         if (error) {
//             console.error(`Execution error: ${error.message}`);
//             return;
//         }
//         if (stderr) {
//             console.error(`Stderr: ${stderr}`);
//             return;
//         }
//         console.log(`nonce_sign Output: ${stdout}`);
//         if (callback) {
//             callback();
//         }
//     });
// }


