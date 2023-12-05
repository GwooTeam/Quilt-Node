const { exec } = require('child_process');


function nonce_verify() {
    exec('./dmodule -v nonce.txt receivedFile.bin received_dilithium_key.puk', (error, stdout, stderr) => {
        if (error) {
            console.error(`Execution error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        console.log(`nonce_sign verify: ${stdout}`);
        return 0;
    });
}

nonce_verify();