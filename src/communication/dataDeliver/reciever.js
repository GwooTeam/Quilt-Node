const net = require('net');
const fs = require('fs');
const { execSync } = require("child_process");

function decrypt(encryptedData) {
    try {
        const decryptedData = execSync(
            `wsl bash -c \"echo hello ${encryptedData} > decrypted_data2.txt ; cat decrypted_data.txt"`,
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
            
                // 로깅을 통해 수신된 데이터 구조 확인
                console.log('Received data:', receivedData);
                console.log(receivedData.data);
                const decryptedData = decrypt(receivedData.data);
                // 데이터 타입에 따라 처리
                if (receivedData.type === 'txt') {
                    console.log('Received text:', decryptedData);
                } else if (receivedData.type === 'file') {
                    const filename = 'receivedFile' + '.txt'; // 예시 파일명
                    fs.writeFileSync(filename, decryptedData);
                    console.log(`File saved: ${filename}`);
                } else {
                    console.error('Invalid data type received.');
                }
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