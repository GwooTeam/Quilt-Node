//tcp server
const net = require('net');
const fs = require('fs');
const { exec } = require('child_process');

const port = 31245;
const host = 'localhost';

const socket = new net.Socket();


const textServer = net.createServer(socket => {
    console.log('Client connected');
    socket.on('data', data => {
        const message = data.toString().trim();
        if (message === 'auth request') {
            console.log('Authentication request received');
           // Generate a random value
           const randomValue = Math.random().toString(36).substr(2, 9);
           console.log(`Generated Random Value: ${randomValue}`);

           // Send the random value to the client
           socket.write(`Random Value: ${randomValue}`);
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

textServer.listen(port, host, () => {
    console.log(`Server listening at ${host}:${port}`);
});


// File transfer server
const fileServer = net.createServer(socket => {
  console.log('File transfer connection established');
  // 'receivedFile.bin' 파일에 데이터 쓰기
  const fileWriteStream = fs.createWriteStream('receivedFile.bin');


  socket.on('data', data => {
      fileWriteStream.write(data);
  });

  socket.on('end', () => {
      fileWriteStream.end();
      console.log('File transfer completed, receivedFile.bin saved');
  });

  socket.on('error', error => {
      console.error(`Error: ${error.message}`);
  });
  nonce_verify();


});

fileServer.listen(31246, 'localhost', () => {
  console.log('File server listening on port 31246');
});

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
      console.log(`nonce_verify Output: ${stdout}`);
  });
}