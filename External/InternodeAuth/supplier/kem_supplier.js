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
const puk_path = 'suppResource/kyber_key.puk';
// const capsule_save_path = 'suppResource/';
// const capsule_file_path = 'suppResource/kyber_encapsulated.cap';
// const ssk_path = 'suppResource/kyber_sharedSecret.ssk';
// const enc_path = 'suppResource/received_encrypted.bin';
// const result_path = 'suppResource/';


let cap_val;
let ssk_val;


/*  functions  */
function kem_encapsulate(pukVal) {
    let encap_out = execSync(`../../KEM/modules/kmodule --encap -r --key=${pukVal}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Execution error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        
    });
    cap_val = ((encap_out.toString()).match(/encapsulated=([^&]+)/))[1];
    ssk_val = ((encap_out.toString()).match(/ssk=([^&]+)/))[1];
}


// let decrypt_out;
function ssk_decrypt(sskVal, encVal) {
    
    let dec_out = execSync(`../../KEM/modules/kmodule --decrypt -r --key=${sskVal} --target=${encVal}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Execution error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        
    });
    let res = ((dec_out.toString()).match(/dec=([^&]+)/))[1];
    console.log('dec res: ' + res);
}


function sendFile(encapVal, callback) {

    fileClient.connect(filePort, host, () => {
        // console.log(`Connected to the file server for sending ` + encapVal);
        // const fileContent = fs.readFileSync(filePath);

        fileClient.write(encapVal);
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
    // fs.writeFileSync(enc_path, receivedData);
    // console.log('File transfer completed');

    // 소켓 연결 종료
    fileClient.end();
    fileClient.destroy();

    ssk_decrypt(ssk_val, receivedData);

    // let endTime = new Date().getTime();
    // console.log('total time: ' + (endTime - startTime) + 'ms');
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
    // console.log(cap_val);
    await sendFile(cap_val);
}

runFunctions();


