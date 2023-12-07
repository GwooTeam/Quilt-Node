//tcp server
const net = require('net');
const fs = require('fs');
const { exec } = require('child_process');
const process = require('process');
const { execSync } = require('child_process');


const config = require('./user_config.json');
const host = config.user_ip;
const textPort = config.sign_text_port;
const filePort = config.sign_file_port; 

let fileReceivedCount = 0; 

let verify_res = 1;

const socket = new net.Socket();

let textServer_socket;



let sign_flag = 0;
let nodeNum = 0;

let socket_pool = [];

const textServer = net.createServer(socket => {

    // let nonce_val;
    // let puk_val;
    // let sign_val;
    // socket_pool.push({  'num':++nodeNum,
    //                     'nonce': nonce_val,
    //                     'puk': puk_val,
    //                     'sign': sign_val});

    console.log('Client connected');
    textServer_socket = socket;
    socket.on('data', data => {
        const message = data.toString().trim();
        if (message === 'auth request') { 
            console.log('Authentication request received');
            // console.time("authModuleExecutionTime");
           // Generate a random value
           const randomValue = Math.random().toString(36).substr(2, 9);
           console.log(`Generated Random Value: ${randomValue}`);

           // Send the random value to the client
           socket.write(`Random Value: ${randomValue}`);

           nonce_val = randomValue;
           // Save the random value to a file
          //  fs.writeFile('nonce.txt', randomValue, err => {
          //   if (err) {
          //       console.error(`Error writing to file: ${err}`);
          //   } else {
          //       console.log('Nonce saved to nonce.txt');
          //   }
          //   });
        }
        }
      )
    });

  socket.on('end', () => {
        console.log('Client disconnected');
    });

  socket.on('error', (error) => {
      console.error(`Error: ${error.message}`);
    });

textServer.listen(textPort, host, () => {
    console.log(`Server listening at ${host}:${textPort}`);
});


// File transfer server
const fileServer = net.createServer(socket => {
  console.log('File transfer connection established');
  let fileWriteStream;
  socket.on('data', data => {
    const msg = data.toString();
    if(msg.startsWith('puk=')) {
      puk_val = msg.split('puk=')[1];
      // console.log('received puk data: ' + puk_val);
    }
    else if (msg.startsWith('sign=')) {
      sign_val = msg.split('sign=')[1];
      // console.log('received sign data: ' + sign_val);
      sign_flag = 1;
    }
    
});

  socket.on('end', () => {
      console.log('File transfer completed');
      // fileReceivedCount++;

      if (sign_flag === 1) { // 두 번째 파일 수신 후 verify 실행
        verify_res = nonce_verify_raw(nonce_val, sign_val, puk_val);
        console.log('verify_res: ' + verify_res);
        if(verify_res == 0) {
            textServer_socket.write('verify OK');
            sign_flag = 0;
        }
        // fileReceivedCount = 0;
        // process.exit(0);
      }

  });

  socket.on('error', error => {
      console.error(`Error: ${error.message}`);
  });
});

fileServer.listen(filePort, host, () => {
  console.log('File server listening on port 31246');
});


function nonce_verify_raw(dataVal, signVal, pukVal) {
  exec(`../../DigitalSignature/dmodule -v -r ${dataVal} ${signVal} ${pukVal}`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Execution error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
    }
    // console.log(`keygen_sign Output: ${stdout}`); -- test code
  });
  return 0;
}


function nonce_verify() {
  exec('node verify.js', (error, stdout, stderr) => {
      if (error) {
          console.error(`Execution error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.error(`Stderr: ${stderr}`);
          return;
      }
      // console.log(`nonce_verify Output: ${stdout}`);
      // console.timeEnd("authModuleExecutionTime");
      
      // process.exit(0);  
  });
  return 0;
}

