const { spawn } = require('child_process');

// 첫 번째 인스턴스 실행
const child1 = spawn('node', ['supplier.js']);

// 두 번째 인스턴스 실행
const child2 = spawn('node', ['supplier.js']);

const child3 = spawn('node', ['supplier.js']);


// 각 인스턴스의 출력을 콘솔에 표시
child1.stdout.on('data', (data) => {
  console.log(`Child 1 output: ${data}`);
});

child2.stdout.on('data', (data) => {
  console.log(`Child 2 output: ${data}`);
});

child3.stdout.on('data', (data) => {
  console.log(`Child 3 output: ${data}`);
});


// 각 인스턴스의 종료 이벤트 처리
child1.on('close', (code) => {
  console.log(`Child 1 process exited with code ${code}`);
});

child2.on('close', (code) => {
  console.log(`Child 2 process exited with code ${code}`);
});

child3.on('close', (code) => {
    console.log(`Child 3 process exited with code ${code}`);
});

