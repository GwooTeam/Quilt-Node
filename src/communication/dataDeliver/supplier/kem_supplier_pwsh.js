//tcp client
const net = require('net');
const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const config = require('./supplier_config.json');
const filePort = config.kem_file_port; // Port for file transfer
const host = config.user_ip;
const fileClient = new net.Socket();

/* paths */
const puk_path = '.\\supplier\\suppResource\\kyber_key.puk';

let cap_val;
let ssk_val;

/*  functions  */
function kem_encapsulate(pukVal) {
    try {
        let encap_out = execSync(`wsl bash -c "export LD_LIBRARY_PATH=./KEM/modules && ./KEM/modules/kmodule --encap -f --key=./supplier/suppResource/kyber_key.puk --result=./supplier/suppResource/"`,{shell:"powershell"});

    } catch (error) {
        // 오류 발생 시, 에러 메시지를 출력합니다.
        console.error(`Execution error: ${error.message}`);
        // stderr는 error 객체의 출력에서 찾을 수 있습니다.
        if (error.stderr) {
            console.error(`Stderr: ${error.stderr.toString()}`);
        }
    }
}


// let decrypt_out;
function ssk_decrypt(sskVal, encVal) {
    
    let dec_out = execSync(`wsl bash -c "export LD_LIBRARY_PATH=./KEM/modules && ./KEM/modules/kmodule --decrypt -f --key=${sskVal} --target=${encVal}"`,{shell:"powershell"})
}


function sendFile(encapVal, callback) {

    fileClient.connect(filePort, host, () => {
        fileClient.write(readBytesFromFile('.\\supplier\\suppResource\\kyber_encapsulated.cap'));
        console.log('capsulated file was sent');
    });
}

/* receive data from User */
let receivedData = Buffer.from([]);
fileClient.on('data', (data) => {
    receivedData = Buffer.concat([receivedData, data]);
});

fileClient.on('error', (error) => {
    console.error('Socket error:', error.message);
    // Perform error handling here
});


/* end of socket */
fileClient.on('end', () => {

    // 소켓 연결 종료
    fileClient.end();
    fileClient.destroy();

    ssk_decrypt(ssk_val, receivedData);

    console.timeEnd('kem_time');
    process.exit(0);
    
})


function readBytesFromFile(filePath) {
    try {
      // 동기적으로 파일 읽기
      const fileBuffer = fs.readFileSync(filePath);
      
      // Buffer를 이용하여 각 바이트를 16진수 문자열로 변환
      const byteCodeString = [];
      for (let i = 0; i < fileBuffer.length; i++) {
        const byteCode = fileBuffer[i].toString(16).padStart(2, '0');
        byteCodeString.push(byteCode);
      }
  
      // 결과 반환
      return byteCodeString.join(''); // 띄어쓰기 없이 이어붙이기
    } catch (err) {
      console.error('파일을 읽는 동안 오류가 발생했습니다:', err);
      return null;
    }
}



/* start KEM */

let startTime;
const puk_val = readBytesFromFile(puk_path);

async function runFunctions() {
    console.time('kem_time');
    // console.log(puk_val);
    await kem_encapsulate(puk_val);
    await sendFile(cap_val);
}

runFunctions();


