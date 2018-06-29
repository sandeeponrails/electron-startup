const electron = require('electron')
const {autoUpdater} = require("electron-updater");

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// const autoUpdater = require('electron').autoUpdater;
const dialog = require('electron').dialog;
var updateFeed = 'http://localhost:3000/releases/win32/0.0.2/electron-quick-start';
const ipc = require('electron').ipcMain;
require('./application-menu.js');
// const autoUpdater = require('./auto-update')


// autoUpdater.setFeedURL(updateFeed);

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', ()=>{
  createWindow();
  autoUpdater.checkForUpdates();
  // autoUpdater.initialize();
  // var http = require("http");
  // var options = {
  //     hostname: 'localhost',
  //     port: 3000,
  //     path: '/updates/latest/version?v='+app.getVersion(),
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'text/html',
  //       'Content-Length': Buffer.byteLength("")
  //     }
  //   };
  //   try {
  //   var req = http.request(options, (res) => {
  //     var body = '';
  //     res.on('data', (chunk) => {
  //       body += chunk;
  //     });
  //     res.on('end', () => {
  //       var resData = JSON.parse(body);
  //       if(resData["update"]){
  //           var updateNow = dialog.showMessageBox(mainWindow, {
  //           type: 'question',
  //           buttons: ['Yes', 'No'],
  //           defaultId: 0,
  //           cancelId: 1,
  //           title: 'Update available',
  //           message: 'There is an update available, do you want to restart and install it now?'
  //         })
          
  //         if (updateNow === 0) {
  //          // try {
  //          //    require('./auto-update')({
  //          //      url: updateFeed,
  //          //      version: app.getVersion()
  //          //    })
  //          //    ipc.on('update-downloaded', (autoUpdater) => {
  //          //      // Elegant solution: display unobtrusive notification messages
  //          //      mainWindow.webContents.send('update-downloaded')
  //          //      ipc.on('update-and-restart', () => {
  //          //        autoUpdater.quitAndInstall()
  //          //      })

  //               // Basic solution: display a message box to the user
  //               // var updateNow = dialog.showMessageBox(mainWindow, {
  //               //   type: 'question',
  //               //   buttons: ['Yes', 'No'],
  //               //   defaultId: 0,
  //               //   cancelId: 1,
  //               //   title: 'Update available',
  //               //   message: 'There is an update available, do you want to restart and install it now?'
  //               // })
  //               //
  //               // if (updateNow === 0) {
  //               //   autoUpdater.quitAndInstall()
  //               // }
  //             // })
  //           // } catch (e) {
  //           //   console.error(e.message)
  //           //   dialog.showErrorBox('Update Error', e.message)
  //           // } 
           
  //         }else{
  //           console.log("cancel")
  //         }
  //       }
  //     });
  //   });
  //   req.end();
  // } catch (e) {
  //   console.log(e.message);
  // }
});

autoUpdater.on('update-downloaded', (info) => {
    win.webContents.send('updateReady')
});

ipc.on("quitAndInstall", (event, arg) => {
    autoUpdater.quitAndInstall();
})


             
// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
