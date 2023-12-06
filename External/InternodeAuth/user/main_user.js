//user's main code
const { spawn } = require('child_process');

/*//////////ML-DSA(digital signature) code ////////*/

// verify code
const user_dsa = spawn('node', ['user.js']);

// 콘솔에 출력 표시
user_dsa.stdout.on('data', (data) => {
    console.log(`user_dsa output: ${data}`);
});

// 종료 이벤트 처리
user_dsa.on('close', (code) => {
    console.log(`user_dsa process exited with code ${code}`);
});




///////////// kem code/////////////
const user_kem = spawn('node', ['kem_user.js']);



// 콘솔에 출력 표시
user_kem.stdout.on('data', (data) => {
    console.log(`user_kem output: ${data}`);
});

// 종료 이벤트 처리
user_kem.on('close', (code) => {
    console.log(`user_kem process exited with code ${code}`);
});

