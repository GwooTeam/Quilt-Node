const { ipcRenderer } = require('electron');

/*button click event*/
let btn1 = document.getElementById('loginButton');
btn1.addEventListener('click', function() {
    console.log(1);
});

let tst1 = document.getElementById('test1');
tst1.addEventListener('click', function() {
    console.log(2);
    ipcRenderer.send('message', 'hello world');
});
let usr1 = document.getElementById('user');
let supp1=document.getElementById('supp');

usr1.addEventListener('click', function() {
    console.log(3);
    ipcRenderer.send('message', 'user');
});

supp1.addEventListener('click', function() {
    console.log(4);
    ipcRenderer.send('message', 'supp');
});


// Receive a message from the main process
ipcRenderer.on('message', (event, message) => {
    console.log(message);
});
