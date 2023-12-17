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


let ssk_val;
let enc_val;

// File transfer server
let nodeNum = 1;
const fileServer = net.createServer(socket => {
  console.log(`Supplier Node ${nodeNum} Connected.`);
  let fileWriteStream;

  // capsule 데이터를 받았을 때
  socket.on('data', (data) => {
    console.log(data.data);
    console.log(typeof(data));

    const cap_val = data.data;
    console.log(cap_val);
    console.log('print cap_val');

    // // Write the cap value to a file
    // fs.writeFile('.\\user\\userResource\\recieved_capsulated.cap', cap_val, (err) => {
    //   if (err) {
    //       console.error(`Error writing to file: ${err}`);
    //   } else {
    //       console.log('ecieved_capsulated saved');
    //   }
    // });
    const receivedcap =  Buffer.from(data.data);
    saveObjectAsBinaryFile(receivedcap, 'recieved_capsulated.cap');
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


fileServer.listen(file_port, host, () => {
  console.log(`File server listening at ${host}:${file_port}`);
});



/*  functions  */
function kem_decapsulate(prkVal, capVal) {
  console.log(capVal);
  let decap_out = execSync(`wsl bash -c "export LD_LIBRARY_PATH=./KEM/modules && ./KEM/modules/kmodule -f --decap --key=${prk_path} --target=${capsule_path} --result=./user/userResource/"`,{shell:"powershell"}) 
  console.log('decap done ');
  // ssk_val = ((decap_out.toString()).match(/ssk=([^&]+)/))[1];
  // console.log('ssk val: ' + ssk_val);

}
function ssk_encrypt(sskVal, dataVal) {
  let enc_out = execSync(`wsl bash -c "export LD_LIBRARY_PATH=./KEM/modules && ./KEM/modules/kmodule -f --encrypt --key=${sskVal} --target=${dataVal}"`, { shell: "powershell.exe" });
  enc_val = ((enc_out.toString()).match(/enc=([^&]+)/))[1];
}



// function ssk_encrypt(sskVal, dataVal) {
//   let enc_out = execSync(`wsl bash -c "export LD_LIBRARY_PATH=./KEM/modules && ./KEM/modules/kmodule -r --encrypt --key=${sskVal} --target=${dataVal}`,{shell:"powershell.exe"})
//   enc_val = ((enc_out.toString()).match(/enc=([^&]+)/))[1];
// }

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
function saveObjectAsBinaryFile(obj, filename) {
  try {
      // 객체를 JSON 문자열로 변환
      const jsonString = JSON.stringify(obj);

      // JSON 문자열을 Buffer로 변환
      const buffer = Buffer.from(jsonString, 'utf-8');

      // 파일에 Buffer 쓰기
      fs.writeFileSync(filename, buffer);

      console.log(`Object has been saved as a binary file: ${filename}`);
  } catch (error) {
      console.error('Error saving object to binary file:', error);
  }
}