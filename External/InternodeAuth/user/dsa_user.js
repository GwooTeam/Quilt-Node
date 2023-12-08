//tcp server
const net = require('net');
const fs = require('fs');
const { exec } = require('child_process');
const process = require('process');
const { execSync } = require('child_process');


const config = require('./user_config.json');
const host = config.user_ip;
const userPort = config.user_port;
const textPort = config.sign_text_port;
const filePort = config.sign_file_port;

let fileReceivedCount = 0; 

let verify_res = 1;

const socket = new net.Socket();

let sign_flag = 0;
let nodeNum = 0;

let clients = {};


const textServer = net.createServer(socket => {

  const clientId = socket.remoteAddress + ':' + socket.remotePort;
  clients[clientId] = { socket, nonce_val: null, puk_val: null, sign_val: null, sign_flag: 0 };
    
    console.log('Client connected');
    socket.on('data', data => {
        const message = data.toString();
        const clientData = clients[clientId];
        // console.log('message: ' + message);
        if (message === 'auth request') { 
            console.log('Authentication request received');
            // console.time("authModuleExecutionTime");
           // Generate a random value
           const randomValue = Math.random().toString(36).substr(2, 9);
           console.log(`Generated Random Value: ${randomValue}`);

           // Send the random value to the client
           socket.write(`Random Value: ${randomValue}`);

           clientData.nonce_val = randomValue;
        }
        else if(message.startsWith('puk=')) {
          clientData.puk_val = message.split('puk=')[1];
          console.log('received puk data: ' + clientData.puk_val);
        }
        else if (message.startsWith('sign=')) {
          clientData.sign_val = message.split('sign=')[1];
          console.log('received sign data: ' + clientData.sign_val);
          verify_res = nonce_verify_raw(clientData.nonce_val, clientData.sign_val, clientData.puk_val);
          console.log('verify_res: ' + verify_res);
          if(verify_res == 0) {
              socket.write('verify OK');
              clientData.sign_flag = 0;
              verify_res = 1;
          }
        }

      })
    
    socket.on('end', () => {
        console.log('File transfer completed');
        // fileReceivedCount++;
        const clientData = clients[clientId];
  
        // if (clientData.sign_flag === 1) { // 두 번째 파일 수신 후 verify 실행
        //   verify_res = nonce_verify_raw(clientData.nonce_val, clientData.sign_val, clientData.puk_val);
        //   console.log('verify_res: ' + verify_res);
        //   if(verify_res == 0) {
        //       socket.write('verify OK');
        //       clientData.sign_flag = 0;
        //       delete clients[clientId];
        //       verify_res = 1;
        //   }
        //   // fileReceivedCount = 0;
        //   // process.exit(0);
        // }
        
        console.log('Client disconnected');
        delete clients[clientId];
  
    });
  
    socket.on('error', (error) => {
        console.error(`Error: ${error.message}`);
    });

});



textServer.listen(userPort, host, () => {
    console.log(`Server listening at ${host}:${userPort}`);
});


// // File transfer server
// const fileServer = net.createServer(socket => {
//   console.log('File transfer connection established');
//   let fileWriteStream;
//   socket.on('data', data => {
//     const msg = data.toString();
//     if(msg.startsWith('puk=')) {
//       puk_val = msg.split('puk=')[1];
//       // console.log('received puk data: ' + puk_val);
//     }
//     else if (msg.startsWith('sign=')) {
//       sign_val = msg.split('sign=')[1];
//       // console.log('received sign data: ' + sign_val);
//       sign_flag = 1;
//     }
    
// });

//   socket.on('end', () => {
//       console.log('File transfer completed');
//       // fileReceivedCount++;

//       if (sign_flag === 1) { // 두 번째 파일 수신 후 verify 실행
//         verify_res = nonce_verify_raw(nonce_val, sign_val, puk_val);
//         console.log('verify_res: ' + verify_res);
//         if(verify_res == 0) {
//             textServer_socket.write('verify OK');
//             sign_flag = 0;
//         }
//         // fileReceivedCount = 0;
//         // process.exit(0);
//       }

//   });

//   socket.on('error', error => {
//       console.error(`Error: ${error.message}`);
//   });
// });

// fileServer.listen(filePort, host, () => {
//   console.log('File server listening on port 31246');
// });


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

