// sendFunction 파일
const net = require('net');
const fs = require('fs');
const { execSync } = require("child_process");
const filePath = 'user\\userResource\\kyber_encrypted.bin'

function encrypt(data) {
    // 실제 암호화 로직은 구현되지 않았습니다. 테스트를 위해 wsl에 data를 넣고 inputdata.txt를 생성 후 내용을 출력하는 코드 작성
    try {
        const encryptedData = execSync(
          `wsl bash -c \"export LD_LIBRARY_PATH=./KEM/modules && ./KEM/modules/kmodule --encrypt -f --key=./user/userResource/kyber_decapsulated.ssk --target=./testfile.txt --result=./user/userResource/"`,
          { encoding: "utf-8", shell: "powershell.exe" }
        ).toString();
        console.log(`result of wsl : ${encryptedData}`);
        
        return encryptedData;
      } catch (error) {
        console.error(`Execution error: ${error.message}`);
        return 1;
      }
    
}

// 데이터 전송 함수
function sender(targetIP, targetPort, dataType, dataContext) {
    const client = new net.Socket();

    client.connect(targetPort, targetIP, () => {
        console.log('Connected to reciever.');
        console.log(dataType);
        if (dataType === 'txt') {
            // 텍스트 데이터 암호화 및 전송
            const encryptedData = encrypt(dataContext);
            console.log(`right: : ${encryptedData}`);
          
           
            const sendingdata = readBytesFromFile('.\\user\\userResource\\kyber_encrypted.bin');
            //fileClient.end();
            console.log('enc sent');
            client.write(JSON.stringify({ type: dataType, data: sendingdata }));
               
        } else if (dataType === 'file') {
            // 파일 데이터 읽기 및 암호화
            fs.readFile(dataContext, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading file:', err);
                    return;
                }
                const encryptedData = encrypt(data);
                client.write(JSON.stringify({ type: dataType, data: encryptedData }));
            });
        } else {
            console.error('Invalid data type. Use "txt" or "file".');
        }
    });

    client.on('close', () => {
        console.log('Connection closed.');
    });

    client.on('error', (err) => {
        console.error('Connection error:', err);
    });
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


module.exports = sender;
