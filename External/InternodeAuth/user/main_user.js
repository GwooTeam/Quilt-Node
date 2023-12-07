//user's main code
const { spawn } = require('child_process');

function run() {
    // verify code
    const user_sign = spawn('node', ['user.js']);

    user_sign.stdout.on('data', (data) => {
        console.log(`user_sign output: ${data}`);
    });

    const user_kem = spawn('node', ['kem_user.js']);

    user_kem.stdout.on('data', (data) => {
        console.log(`user_kem output: ${data}`);
    });
    
    // user_sign.on('exit', (code) => {
    //     if (code === 0) {
    //         // kem code
    //         // supplier.js가 성공적으로 완료된 경우에만 다음 프로세스 실행
    //         const user_kem = spawn('node', ['kem_user.js']);

    //         user_kem.stdout.on('data', (data) => {
    //             console.log(`user_kem output: ${data}`);
    //         });
            
    //         user_kem.on('exit', (kemCode) => {
    //             if (kemCode === 0) {
    //                 console.log('모든 프로세스가 성공적으로 완료되었습니다.');
    //             } else {
    //                 console.error('kem_supplier.js 실행 중 오류 발생');
    //             }
    //         });

    //     } else {
    //         console.error('supplier.js 실행 중 오류 발생');
    //     }
    // });
}


run();



// 종료 이벤트 처리
// user_sign.on('close', (code) => {
//     console.log(`user_sign process exited with code ${code}`);
// });

// user_kem.on('close', (code) => {
//     console.log(`user_kem process exited with code ${code}`);
// });
