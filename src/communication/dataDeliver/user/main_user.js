//user's main code
const { spawn } = require('child_process');

function run() {
    // verify code
    const user_sign = spawn('node', ['./user/dsa_user.js']);

    user_sign.stdout.on('data', (data) => {
        console.log(`user_sign output: ${data}`);
    });

    // 자식 프로세스의 표준 에러 출력 처리
    user_sign.stderr.on('data', (data) => {
        console.error(`user_sign stderr: ${data}`);
    });

    // 자식 프로세스 종료 시 처리
    user_sign.on('close', (code) => {
        console.log(`Child process exited with code ${code}`);
    });


    const user_kem = spawn('node', ['./user/kem_user.js']);

    user_kem.stdout.on('data', (data) => {
        console.log(`user_kem output: ${data}`);
    });
    // 자식 프로세스의 표준 에러 출력 처리
    user_kem.stderr.on('data', (data) => {
        console.error(`user_sign stderr: ${data}`);
    });

    // 자식 프로세스 종료 시 처리
    user_kem.on('close', (code) => {
        console.log(`Child process exited with code ${code}`);
    });

}

run();


