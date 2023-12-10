// sendFunction 파일
const net = require('net');
const fs = require('fs');

function encrypt(data, type) {
    // 실제 암호화 로직은 구현되지 않았습니다.
    // 여기서는 단순히 문자열에 'encrypted :'를 붙여 반환합니다.
    const encryptedData = `encrypted : ${data}`;
    return encryptedData;
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
            client.write(JSON.stringify({ type: dataType, data: encryptedData }));
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


module.exports = sender;
