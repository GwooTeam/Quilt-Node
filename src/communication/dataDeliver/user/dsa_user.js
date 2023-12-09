//tcp server

const net = require('net');
const { exec } = require('child_process');
const { execSync } = require('child_process');


const config = require('./user_config.json');
const host = config.user_ip;
const userPort = config.user_port;


let verify_res = 1;


let nodeNum = 0;

let clients = {};
const textServer = net.createServer(socket => {

  const clientId = socket.remoteAddress + ':' + socket.remotePort;
  clients[clientId] = { socket, nonce_val: null, puk_val: null, sign_val: null, sign_flag: 0, verify_res: null };
    
    console.log('Client connected');
    socket.on('data', data => {
        const message = data.toString();
        const clientData = clients[clientId];
        if (message === 'auth request') { 
            console.log('Authentication request received');
           // Generate a random value
           const randomValue = Math.random().toString(36).substr(2, 9);
           console.log(`Generated Random Value: ${randomValue}`);

           // Send the random value to the client
           socket.write(`Random Value: ${randomValue}`);

           clientData.nonce_val = randomValue;
        }
        else if(message.startsWith('puk=')) {
          clientData.puk_val = message.split('puk=')[1];
          // console.log('received puk data: ' + clientData.puk_val);
          console.log('success to receivce puk');
        }
        else if (message.startsWith('sign=')) {
          clientData.sign_val = message.split('sign=')[1];
          // console.log('received sign data: ' + clientData.sign_val);
          console.log('success to receivce sign');
          clientData.verify_res = nonce_verify_raw(clientData.nonce_val, clientData.sign_val, clientData.puk_val);
          if(clientData.verify_res == 0) {
              socket.write('verify OK');
              console.log('send OK' + ++nodeNum);
              clientData.sign_flag = 0;
              verify_res = 1;
          }
        }

      })
    
    socket.on('end', () => {
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



function nonce_verify_raw(dataVal, signVal, pukVal) {
  try {
    const result = execSync(`./DigitalSignature/dmodule -v -r ${dataVal} ${signVal} ${pukVal}`).toString();
    console.log(`keygen_sign Output: ${result}`);
    if (result.includes('success verify !!')) {
      return 0;
    } else {
      return 1;
    }
  } catch (error) {
    console.error(`Execution error: ${error.message}`);
    return 1;
  }
 
}



