//udp server
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const PORT = ;
const HOST = 'localhost'; // Use 0.0.0.0 if you want to accept messages from any IP

server.on('listening', () => {
  const address = server.address();
  console.log(`UDP Server listening on ${address.address}:${address.port}`);
});

server.on('message', (message, remote) => {
  console.log(`${remote.address}:${remote.port} - ${message}`);
  // Echo the message back to the client
  server.send(message, remote.port, remote.address);
});

server.bind(PORT, HOST);
