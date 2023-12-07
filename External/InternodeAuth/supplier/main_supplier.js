//supplier's main code
const { spawn } = require('child_process');

let sign_time;
let kem_time;

function run(callback) {
    // verify code
    const supplier_sign = spawn('node', ['supplier.js']);

    supplier_sign.stdout.on('data', (data) => {
        const msg = data.toString().trim();
        if (msg.includes('sign_time')) {
            // const match = msg.match(/\d+(\.\d+)?/);
            sign_time = parseFloat(msg.split('sign_time: ')[1]);
        }
        // console.log(`supplier_sign output: ${data}`);
    });
    
    supplier_sign.on('exit', (code) => {
        if (code === 0) {
            // kem code
            // supplier.js가 성공적으로 완료된 경우에만 다음 프로세스 실행
            const supplier_kem = spawn('node', ['kem_supplier.js']);

            supplier_kem.stdout.on('data', (data) => {
                const msg = data.toString().trim();
                if (msg.includes('kem_time')) {
                    // const match = msg.match(/\d+(\.\d+)?/);
                    kem_time = parseFloat(msg.split('kem_time: ')[1]);
                }
                // console.log(`supplier_kem output: ${data}`);
            });
            
            supplier_kem.on('exit', (kemCode) => {
                if (kemCode === 0) {
                    console.log('main_supplier complete.');
                    callback();
                } else {
                    console.error('kem_supplier.js 실행 중 오류 발생');
                }
            });

        } else {
            console.error('supplier.js 실행 중 오류 발생');
        }
    });
    
}


run( () => {
    console.log('sign_time: ' + sign_time );
    console.log('kem_time: ' + kem_time);
    console.log('total time: ' + (sign_time + kem_time));
} );



// 콘솔에 출력 표시

// 종료 이벤트 처리
// supplier_sign.on('close', (code) => {
//     console.log(`supplier_sign process exited with code ${code}`);
// });

// supplier_kem.on('close', (code) => {
//     console.log(`supplier_kem process exited with code ${code}`);
// });
