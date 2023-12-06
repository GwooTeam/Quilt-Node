const net = require('net');
const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const config = require('./supplier_config.json');
const filePort = config.server_file_port; // Port for file transfer
const host = config.server_ip;
const fileClient = new net.Socket();


/* paths */
const puk_path = 'suppResource/kyber_key.puk';
const capsule_save_path = 'suppResource/';
const capsule_file_path = 'suppResource/kyber_encapsulated.cap';
const ssk_path = 'suppResource/kyber_sharedSecret.ssk';
const enc_path = 'suppResource/received_encrypted.bin';
const result_path = 'suppResource/';




/*  functions  */
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
        // console.log(`kem_encapsulate Output: ${stdout}`);
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

    // console.log(res.toString());
}

function sendFile(filePath, callback) {

    fileClient.connect(filePort, host, () => {
        // console.log(`Connected to the file server for sending ${filePath}`);
        const fileContent = fs.readFileSync(filePath);

        fileClient.write(fileContent);
        // fileClient.end();
    });
}



/* receive data from User */
let receivedData = Buffer.from([]);
fileClient.on('data', (data) => {
    receivedData = Buffer.concat([receivedData, data]);
});


/* end of socket */
fileClient.on('end', () => {
    // 서버에서 받은 작업 완료된 파일을 클라이언트에 저장
    fs.writeFileSync(enc_path, receivedData);
    // console.log('File transfer completed');

    // 소켓 연결 종료
    fileClient.end();
    fileClient.destroy();

    if(fs.existsSync(enc_path)) {
        ssk_decrypt(ssk_path, enc_path, result_path);
        let endTime = new Date().getTime();
        console.log('total time: ' + (endTime - startTime) + 'ms');
    }
    else {
        console.log('오류: User로부터 암호화된 데이터를 받지 못함.');
    }
    
})



/* start KEM */

let startTime;
async function runFunctions() {
    startTime = new Date().getTime();
    await kem_encapsulate(puk_path, capsule_save_path);
    await sendFile(capsule_file_path);
}

runFunctions();




