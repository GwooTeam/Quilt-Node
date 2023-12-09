const readline = require('readline');
const user = require('./user.js'); // userFunction 가져오기
const supplier = require('./supplier.js'); // supplierFunction 가져오기

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 사용자 입력 처리
rl.on('line', (input) => {
    if (input === 'user') {
        user.userFunction();
    } else if (input === 'supplier') {
        supplier.supplierFunction();
    } else {
        console.log("Invalid input. Please type 'user' or 'supplier'.");
    }
});

console.log("Who are you? Type 'user' or 'supplier':");
