//tcp server
const net = require('net');
const fs = require('fs');
const { exec } = require('child_process');
const process = require('process');



const config = require('./config.json');
const host = config.supplier_ip;
const textPort = config.supplier_txt_port;
const filePort = config.supplier_file_port;

let fileReceivedCount = 0;


const socket = new net.Socket();


const textServer = net.createServer(socket => {
    console.log('Client connected');
    console.time("authModuleExecutionTime");
    // Generate a random value
    const randomValue = Math.random().toString(36).substr(2, 9);
    // console.log(`Generated Random Value: ${randomValue}`);

    // Send the random value to the client
    socket.write(`Random Value: ${randomValue}`);

    // Save the random value to a file
    fs.writeFile('nonce.txt', randomValue, err => {
        if (err) {
            console.error(`Error writing to file: ${err}`);
        } else {
            // console.log('Nonce saved to nonce.txt');
        }
    });

    socket.on('data', data => {
        // const message = data.toString().trim();
        // if (message === 'auth request') { 

    }

    )
});

socket.on('end', () => {
    console.log('Client disconnected');
});

socket.on('error', (error) => {
    console.error(`Error: ${error.message}`);
});

textServer.listen(textPort, host, () => {
    // console.log(`Server listening at ${host}:${textPort}`);
});


// File transfer server
const fileServer = net.createServer(socket => {
    // console.log('File transfer connection established');
    
    let fileWriteStream;
    socket.on('data', data => {
        if (!fileWriteStream) {
            const filename = fileReceivedCount === 0 ? 'received_dilithium_key.puk' : 'received_signed.bin';
            fileWriteStream = fs.createWriteStream(filename);
            // console.log(`Receiving and saving to ${filename}`);
        }
        fileWriteStream.write(data);
    });

    socket.on('end', () => {
        fileWriteStream.end();
        // console.log('File transfer completed');
        fileReceivedCount++;

        if (fileReceivedCount === 2) { // 두 번째 파일 수신 후 verify 실행
            nonce_verify();
        }
    });

    socket.on('error', error => {
        console.error(`Error: ${error.message}`);
    });
});

fileServer.listen(filePort, host, () => {
    // console.log('File server listening on port 31246');
});

function nonce_verify() {
    exec('node verify.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`Execution error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        console.log(`nonce_verify Output: ${stdout}`);
        console.timeEnd("authModuleExecutionTime");
        fileReceivedCount = 0;
        // process.exit(0);
        return;
    });
}