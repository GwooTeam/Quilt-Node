const net = require('net');
const fs = require('fs');

function decrypt(encryptedData) {
    // 실제 복호화 로직 구현 필요
    // 여기서는 단순히 문자열에서 'encrypted :'를 제거합니다.
    const decryptedData = `decrypted : ${encryptedData}`;
    return decryptedData;
}

function receiver(){
    const server = net.createServer((socket) => {
        console.log('Client connected.');
    
        socket.on('data', (data) => {
            try {
                const receivedData = JSON.parse(data.toString());
            
                // 로깅을 통해 수신된 데이터 구조 확인
                console.log('Received data:', receivedData);
    
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