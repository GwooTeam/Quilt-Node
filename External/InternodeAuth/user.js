//tcp server
const net = require('net');
const fs = require('fs');

const port = 31245;
const host = 'localhost';

const server = net.createServer(socket => {
    console.log('Client connected');
    let fileWriteStream;
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
    });

    socket.on('end', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, host, () => {
    console.log(`Server listening at ${host}:${port}`);
});
