//tcp server
const net = require('net');
const fs = require('fs');
const { execSync } = require('child_process');


/*  server config  */
const text_port = 31245;
const file_port = 31246;
const host = 'localhost';

// const socket = new net.Socket();

let fileCount = 0; // To keep track of the number of files received

/* path */
const prk_path = 'userResource/kyber_key.prk';
// const capsule_path = 'userResource/received_capsule.cap';
// const result_path = 'userResource/';
// const ssk_path = 'userResource/kyber_sharedsecret.ssk';
const data_path = 'userResource/testData.txt';
// const encryptFilePath = 'userResource/kyber_encrypted.bin';

let ssk_val;
let enc_val;


// File transfer server
let nodeNum = 1;
const fileServer = net.createServer(socket => {
  console.log(`Supplier Node ${nodeNum} Connected.`);
  let fileWriteStream;

  // capsule 데이터를 받았을 때
  socket.on('data', (data) => {

    // capsule 데이터 파일로 저장
    if (!fileWriteStream) {
        // fs.writeFileSync(capsule_path, data);
        // console.log(`Receiving file: ${capsule_path}`);
    }
    
    // capslue 파일을 prk로 디캡슐화 하고 암호화 파일을 생성한다.
    let prk_val = readBytesFromFile(prk_path);
    kem_decapsulate(prk_val, data);

    let data_val = readBytesFromFile(data_path);
    ssk_encrypt(ssk_val, data_val);
    
    // const content = fs.readFileSync(encryptFilePath); 
    socket.write(enc_val);
    socket.end();

  }); // socket.on('data')

  socket.on('end', () => {
    console.log(`File transfer completed to Node ${nodeNum}`);
    nodeNum++;
    socket.end();
  });

  socket.on('error', (error) => {
    console.error(`Error: ${error.message}`);
    console.error(`Error Node Num: ${nodeNum}`);
    nodeNum++;
  });


}); // const fileServer


fileServer.listen(file_port, 'localhost', () => {
  console.log(`File server listening at ${host}:${file_port}`);
});



/*  functions  */
function kem_decapsulate(prkVal, capVal) {
  // console.log('into decapsulte.')
  let decap_out = execSync(`../../KEM/modules/kmodule -r --decap --key=${prkVal} --target=${capVal}`, (error, stdout, stderr) => {
      if (error) {
          console.error(`Execution error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.error(`Stderr: ${stderr}`);
          return;
      }
      // console.log(`decapsulate Output: ${stdout.toString()}`);
  });
  ssk_val = ((decap_out.toString()).match(/ssk=([^&]+)/))[1];
  // console.log(res.toString());

}



function ssk_encrypt(sskVal, dataVal) {
  // console.log('into encrypt.')
  let enc_out = execSync(`../../KEM/modules/kmodule -r --encrypt --key=${sskVal} --target=${dataVal}`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Execution error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
    }
    // console.log(`decrypt Output: ${stdout}`);
  });
  enc_val = ((enc_out.toString()).match(/enc=([^&]+)/))[1];
}

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

