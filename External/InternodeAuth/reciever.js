//tcp client
const net = require('net');
const readline = require('readline');

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
  process.stdout.write('\u001b[2K\u001b[200D'); // Clear the current line and move the cursor to the beginning
  console.log(data.toString());
  rl.prompt();
});

client.on('close', () => {
  console.log('Connection to chat server closed');
  process.exit(0);
});

client.on('error', (err) => {
  console.error(`Error: ${err.message}`);
});
