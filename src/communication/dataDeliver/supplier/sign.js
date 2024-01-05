const { exec } = require('child_process');


function nonce_sign() {
    exec('../DigitalSignature/dmodule -s -f nonce.txt dilithium_key.prk', (error, stdout, stderr) => {
        if (error) {
            console.error(`Execution error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        console.log(`nonce_sign Output: ${stdout}`);
        // if (callback) {
        //     callback();
        // }
        return 0;
    });
}

nonce_sign();