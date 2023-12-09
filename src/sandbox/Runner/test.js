const { spawn } = require('child_process');

async function runPythonScript() {
    return new Promise((resolve, reject) => {
        const pyProcess = spawn('python', ['./main.py']);

        pyProcess.on('exit', code => {
            if(code === 1) {
                reject(new Error('Sandbox Runner Error'));
            } else if(code === 0) {
                resolve(true);
            }
        });
    });
}

// 함수 사용 예시
runPythonScript().then(result => {
    console.log(result);  // true
}).catch(error => {
    console.error(error);  // Error: Python script ended with error
});