//supplier's main code
const { spawn } = require('child_process');



/*//////////ML-DSA(digital signature) code ////////*/

// verify code
const supplier_dsa = spawn('node', ['supplier.js']);

// 콘솔에 출력 표시
supplier_dsa.stdout.on('data', (data) => {
    console.log(`supplier_dsa output: ${data}`);
});

// 종료 이벤트 처리
supplier_dsa.on('close', (code) => {
    console.log(`supplier_dsa process exited with code ${code}`);
});





/////////////// kem code ///////////////
const supplier_kem = spawn('node', ['kem_supplier.js']);



// 콘솔에 출력 표시
supplier_kem.stdout.on('data', (data) => {
    console.log(`supplier_kem output: ${data}`);
});

// 종료 이벤트 처리
supplier_kem.on('close', (code) => {
    console.log(`supplier_kem process exited with code ${code}`);
});
