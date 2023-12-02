//tcp server
const net = require('net');

const port = 31245;
const host = 'localhost';

const server = net.createServer(socket => {
    console.log('Client connected');

    socket.on('data', data => {
        const message = data.toString().trim();
        if (message === 'auth request') {
            console.log('Authentication request received');
            // Generate a random value
            const randomValue = Math.random().toString(36).substr(2, 9);
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
