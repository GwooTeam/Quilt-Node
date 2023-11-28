//udp client
const dgram = require('dgram');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const client = dgram.createSocket('udp4');
const PORT = ;
const HOST = 'localhost'; // Replace with your server's IP if not running locally

rl.on('line', (line) => {
  const message = Buffer.from(line);
  client.send(message, 0, message.length, PORT, HOST, (err) => {
    if (err) throw err;
    console.log(`You: ${line}`);
  });
});

client.on('message', (message, remote) => {
  console.log(`Echo from server: ${remote.address}:${remote.port} - ${message}`);
});

client.on('error', (err) => {
  console.log(`client error:\n${err.stack}`);
  client.close();
});
