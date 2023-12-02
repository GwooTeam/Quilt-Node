//tcp client
const net = require('net');
const { exec } = require('child_process');
const readline = require('readline');
const fs = require('fs');


const keygen_sign = () => {
    exec('./dmodule --keygen', (error, stdout, stderr) => {
        if (error) {
            console.error(`Execution error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        console.log(`keygen_sign Output: ${stdout}`);
    });
};

const nonce_sign = (callback) => {
  exec('./dmodule -s nonce.txt dilithium_key.prk', (error, stdout, stderr) => {
      if (error) {
          console.error(`Execution error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.error(`Stderr: ${stderr}`);
          return;
      }
      console.log(`nonce_sign Output: ${stdout}`);
      if (callback) {
        callback(); // Call the callback function once execution is complete
    }
  });
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const config = require('./config.json');
const port = config.server_port;
const host = config.server_ip;

const client = new net.Socket();

client.connect(port, host, () => {
    console.log('Connected to chat server');
    rl.prompt();

    rl.on('line', (line) => {
        client.write(line);
        rl.prompt();
    });
});

client.on('data', (data) => {
  const message = data.toString().trim();
  console.log(`\nServer: ${message}`);
  // Check if the message is a random value
  if (message.startsWith('Random Value: ')) {
      const randomValue = message.split('Random Value: ')[1];
      console.log('Executing printhello program...');
      keygen_sign();

      // Write the random value to a file
      fs.writeFile('nonce.txt', randomValue, (err) => {
          if (err) {
              console.error(`Error writing to file: ${err}`);
          } else {
              console.log('Random value saved to nonce.txt');

          }
      });
  }
  rl.prompt();
});

// Function to send a file
function sendFile(filePath) {
  const readStream = fs.createReadStream(filePath);
  readStream.on('open', () => {
      readStream.pipe(client);
  });
  readStream.on('error', (err) => {
      console.error(`Error reading file: ${err}`);
  });
}


client.on('close', () => {
    console.log('Connection to chat server closed');
    process.exit(0);
});

client.on('error', (err) => {
    console.error(`Error: ${err.message}`);
});
