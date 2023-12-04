//tcp server
const net = require('net');
const fs = require('fs');
const { exec } = require('child_process');

const port = 31245;
const host = 'localhost';

const socket = new net.Socket();

let fileCount = 0; // To keep track of the number of files received

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
  let fileWriteStream;

  socket.on('data', data => {
    if (!fileWriteStream) {
        // Determine the filename based on the order of files received
        const filename = fileCount === 0 ? 'receivedFile.txt' : 'received_key.puk';
        fileWriteStream = fs.createWriteStream(filename);
        console.log(`Receiving file: ${filename}`);
    }
    fileWriteStream.write(data);
  });

socket.on('end', () => {
    fileWriteStream.end();
    console.log('File transfer completed');

    fileCount++; // Increment the file count

    // Optionally, call verifySignature here if this is the second file
    if (fileCount === 2) {
        verifySignature();
    }
  });
  socket.on('error', (error) => {
    console.error(`Error: ${error.message}`);
  });


});

fileServer.listen(31246, 'localhost', () => {
  console.log('File server listening on port 31246');
});

// Function to verify the signature
function verifySignature() {
  exec('./dmodule -v nonce.txt receivedFile.txt received_key.puk', (error, stdout, stderr) => {
      if (error) {
          console.error(`Execution error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.error(`Stderr: ${stderr}`);
          return;
      }
      console.log(`Verification Output: ${stdout}`);
  });
}