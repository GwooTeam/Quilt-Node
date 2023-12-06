//supplier's main code
const { spawn } = require('child_process');

// verify code


// kem code
const supplier_kem = spawn('node', ['kem_supplier.js']);



// 콘솔에 출력 표시
supplier_kem.stdout.on('data', (data) => {
    console.log(`supplier_kem output: ${data}`);
});

// 종료 이벤트 처리
supplier_kem.on('close', (code) => {
    console.log(`supplier_kem process exited with code ${code}`);
});
