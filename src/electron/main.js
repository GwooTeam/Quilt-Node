/*modules*/
const { app, BrowserWindow, ipcMain } = require('electron');
const dgram=require('dgram');
const fs = require('fs');
const EventEmitter = require('events');
const { exec } = require('child_process');
const { ipcRenderer } = require('electron');
/*modules*/

/*variables*/
const udpsoket=dgram.createSocket('udp4');
const eventEmitter = new EventEmitter();

/*variables*/

/*events*/

/*functions*/

function createWindow() {
    const win = new BrowserWindow({
        width: 1400,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });
    win.loadFile('.\\src\\electron\\login.html');
}

app.whenReady().then(createWindow);

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

eventEmitter.on('newbie', () => {
    console.log("newbie is comming")
});

ipcMain.on('message', (event, message) => {
    console.log(message);
    if (message === 'hello world') {
        console.log("hello 월드");
        eventEmitter.emit('newbie')
        return '환영합니다';
    }
    else if (message === 'user') {
        console.log("user");
        return 'user';
    }
    else if (message === 'supp') {
        console.log("supp");
        return 'supp';
    }

});

