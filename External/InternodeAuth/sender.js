//tcp server
const net = require('net');

const clients = [];
const port = 31245;

const broadcast = (message, sender) => {
  clients.forEach(client => {
    // Don't send the message back to the sender
    if (client !== sender) {
      client.write(message);
    }
  });
  console.log(message.trim());
};

const server = net.createServer(socket => {
  console.log('A new client has connected');
  clients.push(socket);

  socket.on('data', data => {
    broadcast(`${socket.remoteAddress}:${socket.remotePort} - ${data}`, socket);
  });

  socket.on('end', () => {
    clients.splice(clients.indexOf(socket), 1);
    console.log('A client has disconnected');
  });

  socket.on('error', error => {
    console.error(`Error: ${error.message}`);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
