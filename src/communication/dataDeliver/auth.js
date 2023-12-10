//sign and kem
const { spawn } = require('child_process');

function auth(role) {
    if (role === 'user' || role === 'supplier') {
        const scriptPath = role === 'user' ? './user/main_user.js' : './supplier/main_supplier.js';
        const child = spawn('node', [scriptPath]);

        child.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        child.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        child.on('close', (code) => {
            console.log(`Child process exited with code ${code}`);
        });
    } else {
        console.log("Invalid role. Please use 'user' or 'supplier'.");
    }
}

module.exports = auth;

