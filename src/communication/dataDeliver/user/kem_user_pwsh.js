//tcp server
const net = require('net');
const fs = require('fs');
const { execSync } = require('child_process');

/*  server config  */
const config = require('./user_config.json');
const text_port = config.kem_text_port;
const file_port = config.kem_file_port;
const host = 'localhost';

/* path */
const prk_path = 'user/userResource/kyber_key.prk';
const data_path = 'user/userResource/testData.txt';
const capsule_path = './user/userResource/recieved_capsulated.cap'
const ssk_path = './user/userResource/kyber_decapsulated.ssk'

let ssk_val;
let enc_val;

// File transfer server
let nodeNum = 1;
const fileServer = net.createServer(socket => {
  console.log(`Supplier Node ${nodeNum} Connected.`);
  let fileWriteStream;

  // capsule 데이터를 받았을 때
  socket.on('data', (data) => {

    const receivedcap =  Buffer.from(data);
    const content = receivedcap.toString('utf-8');
    


    // 2자리씩 끊어서 각 부분을 16진수로 변환
    const bufferArray = [];
    for (let i = 0; i < content.length; i += 2) {
        const hexString = content.substring(i, i + 2);
        bufferArray.push(parseInt(hexString, 16));
    }

    // 변환된 값을 포함하는 Buffer 객체 생성
    const buffer = Buffer.from(bufferArray);

    // 결과 바이너리 데이터 출력
    console.log(buffer);


    fs.writeFileSync('.\\user\\userResource\\recieved_capsulated.cap', buffer,  (err) => {
      if (err) {
          console.error(err);
          return;
      }
      console.log('파일이 성공적으로 저장되었습니다.');
  });
   
    // capslue 파일을 prk로 디캡슐화
    let prk_val = readBytesFromFile(prk_path);
    kem_decapsulate(prk_val, capsule_path);

   
    socket.write(enc_val);
    socket.end();

  }); 

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


});


fileServer.listen(file_port, host, () => {
  console.log(`File server listening at ${host}:${file_port}`);
});



/*  functions  */
function kem_decapsulate(prkVal, capVal) {
  let decap_out = execSync(`wsl bash -c "export LD_LIBRARY_PATH=./KEM/modules && ./KEM/modules/kmodule -f --decap --key=${prk_path} --target=${capVal} --result=./user/userResource/"`,{shell:"powershell"}) 
  console.log('success to decapsulate and get ssk');
  
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
