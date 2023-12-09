/*modules*/
const { app, BrowserWindow, ipcMain } = require('electron');
const dgram=require('dgram');
const fs = require('fs');
const EventEmitter = require('events');
/*modules*/

/*variables*/
const udpsoket=dgram.createSocket('udp4');

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