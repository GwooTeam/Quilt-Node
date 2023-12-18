const net = require('net');
const fs = require('fs');
const { execSync } = require("child_process");

function decrypt() {
    try {
        const decryptedData = execSync(
            //환경변수 설정 && 복호화 && 복호화 결과 출력
            `wsl bash -c \"export LD_LIBRARY_PATH=./KEM/modules && ./KEM/modules/kmodule --decrypt -f --key=./supplier/suppResource/kyber_sharedSecret.ssk --target=./supplier/suppResource/recieved_kyber_encrypted.bin --result=./supplier/suppResource/ && cat ./supplier/suppResource/kyber_decrypted.bin"`,
            { encoding: "utf-8", shell: "powershell.exe" }
          ).toString();
        console.log(`result of dec_wsl : ${decryptedData}`);
        return decryptedData;
    } catch (error) {
        console.error(`Execution error: ${error.message}`);
        return 1;
    }
}


function receiver(){
    const server = net.createServer((socket) => {
        console.log('Sender connected.');
    
        socket.on('data', (data) => {
            try {
                const receivedData = JSON.parse(data.toString());

                const receivedenc =  Buffer.from(receivedData.data);
                const content = receivedenc.toString('utf-8');
            
            
                // 2자리씩 끊어서 각 부분을 16진수로 변환
                const bufferArray = [];
                for (let i = 0; i < content.length; i += 2) {
                    const hexString = content.substring(i, i + 2);
                    bufferArray.push(parseInt(hexString, 16));
                }
            
                // 변환된 값을 포함하는 Buffer 객체 생성
                const buffer = Buffer.from(bufferArray);
              
                fs.writeFileSync('.\\supplier\\suppResource\\recieved_kyber_encrypted.bin', buffer,  (err) => {
                  if (err) {
                      console.error(err);
                      return;
                  }
                  console.log('파일이 성공적으로 저장되었습니다.');
                });

                const decryptedData = decrypt();
        
            } catch (err) {
                console.error('Error processing data:', err.message);
            }
        });
    
        socket.on('end', () => {
            console.log('Client disconnected.');
        });
    
        socket.on('error', (err) => {
            console.error('Connection error:', err);
        });
    });
    
    // 서버가 6000 포트에서 리스닝
    server.listen(6000, () => {
        console.log('Server listening on port 6000');
    });
}



module.exports = receiver;