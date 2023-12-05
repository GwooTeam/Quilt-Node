const {spawn} = require('child_process');

const exeFilePath = 'dmodule';
const exeFile = spawn(exeFilePath, ['--keygen', '-r']);

// const externalProgram = spawn('external_program/a.out', ['arg1', 'arg2']);

let res = '';

exeFile.stdout.on('data', (data) => {
    console.log(`execute result of c code: ${data}`);
    res = data;
});

exeFile.on('close', (code) => {
    console.log(`exit code of c program: ${code}`);
    console.log(`\nlet res: ${res}`);
    console.log('typeof(res): ' + typeof(res));
});

