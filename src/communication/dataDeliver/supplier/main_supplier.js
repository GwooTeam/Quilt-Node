//supplier's main code
const { spawn } = require('child_process');

let sign_time;
let kem_time;

function run(callback) {
    // verify code
    const supplier_sign = spawn('node', ['./supplier/dsa_supplier_pwsh.js']);

    
    supplier_sign.stdout.on('data', (data) => {
        console.log(`supplier_sign output: ${data}`);
        const msg = data.toString().trim();
        if (msg.includes('sign_time')) {
            // const match = msg.match(/\d+(\.\d+)?/);
            sign_time = parseFloat(msg.split('sign_time: ')[1]);
        }
    });

    // 자식 프로세스의 표준 에러 출력 처리
    supplier_sign.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    // 자식 프로세스 종료 시 처리
    supplier_sign.on('close', (code) => {
        console.log(`Child process exited with code ${code}`);
    });


    
    supplier_sign.on('exit', (code) => {
        if (code === 0) {
            // kem code
            // supplier_dsa.js가 성공적으로 완료된 경우에만 다음 프로세스 실행

            const supplier_kem = spawn('node', ['./supplier/kem_supplier_pwsh.js']);

            supplier_kem.stdout.on('data', (data) => {
                const msg = data.toString().trim();
                if (msg.includes('kem_time')) {
                    // const match = msg.match(/\d+(\.\d+)?/);
                    kem_time = parseFloat(msg.split('kem_time: ')[1]);
                }
                console.log(`supplier_kem output: ${data}`);
            });
            
            supplier_kem.on('exit', (kemCode) => {
                if (kemCode === 0) {
                    // console.log('main_supplier complete.');
                    callback();
                } else {
                    console.log(kemCode);
                    console.error('error while executing kem_supplier_pwsh.js');
                }
            });

        } else {
            console.error('error while supplier_dsa.js');
        }
    });
    
}


run( () => {   
    console.log(`sign time: ${sign_time}, kem_time: ${kem_time}, total time: ` + (sign_time + kem_time));
} );



