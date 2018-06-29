// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const electron = require('electron')
// Module to control application life.
const remote =  require('electron').remote;
// Module to create native browser window.
console.log(electron)
const BrowserWindow = electron.BrowserWindow
var pjson = require('./package.json');
const autoUpdater = require('electron').autoUpdater;
const dialog = require('electron').remote.dialog;
var updateFeed = 'http://localhost:3000/releases/win32/0.0.2/electron-quick-start';
const ipc = require('electron').remote.ipcMain;
var http = require("http");

function test(){
  var options = {
      hostname: 'localhost',
      port: 3000,
      path: '/updates/latest/version?v='+pjson.version,
      method: 'GET',
      headers: {
        'Content-Type': 'text/html',
        'Content-Length': Buffer.byteLength("")
      }
    };
    
    var req = http.request(options, (res) => {
      var body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        var resData = JSON.parse(body);
        if(resData["update"]){
            var updateNow = dialog.showMessageBox(remote.getCurrentWindow(),{
            type: 'question',
            buttons: ['Yes', 'No'],
            defaultId: 0,
            cancelId: 1,
            title: 'Update available',
            message: 'There is an update available, do you want to restart and install it now?',
            child: true
          })
          
          if (updateNow === 0) {

            try {
    // Don't try to update on development
                if (!process.execPath.match(/[\\\/]electron-prebuilt/)) {
                  console.info('Checking for updates at %s', updateFeed)
                  autoUpdater.setFeedURL(updateFeed)
                  autoUpdater.checkForUpdates()
                }
              } catch (e) {
                console.error(e.message)
                throw e
              }

              autoUpdater.on('error', (e) => {
                console.error(e.message)
              })

              autoUpdater.on('checking-for-update', () => {
                console.info('Checking for update...')
              })

              autoUpdater.on('update-available', () => {
                console.info('Found available update!')
              })

              autoUpdater.on('update-not-available', () => {
                console.info('There are no updates available.')
              })

              autoUpdater.on('update-downloaded', () => {
                console.info('Update package downloaded')
                require('electron').ipcMain.emit('update-downloaded', autoUpdater)
              })




           // try {
           //    require('./auto-update')({
           //      url: updateFeed,
           //      version: pjson.version
           //    })
           //    ipc.on('update-downloaded', (autoUpdater) => {
           //      // Elegant solution: display unobtrusive notification messages
           //      mainWindow.webContents.send('update-downloaded')
           //      ipc.on('update-and-restart', () => {
           //        autoUpdater.quitAndInstall()
           //      })

           //      // Basic solution: display a message box to the user
           //      // var updateNow = dialog.showMessageBox(mainWindow, {
           //      //   type: 'question',
           //      //   buttons: ['Yes', 'No'],
           //      //   defaultId: 0,
           //      //   cancelId: 1,
           //      //   title: 'Update available',
           //      //   message: 'There is an update available, do you want to restart and install it now?'
           //      // })
           //      //
           //      // if (updateNow === 0) {
           //      //   autoUpdater.quitAndInstall()
           //      // }
           //    })
           //  } catch (e) {
           //    console.error(e.message)
           //    dialog.showErrorBox('Update Error', e.message)
           //  } 
           
          }else{
            console.log("cancel")
          }
        }
      });
    });
    req.end();
  // } catch (e) {
  //   console.log(e.message);
  // }
}

