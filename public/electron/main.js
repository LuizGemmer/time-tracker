const { app, BrowserWindow } = require('electron')
const url = require("url");
const path = require('path')

const isDev = process.env.IS_DEV;

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // load the app's HTML.
  mainWindow.loadURL(
    process.env.ELECTRON_START_URL || url.format({
      pathname: path.join(__dirname, '../index.html'),
      protocol: 'file:',
      slashes: true,
    })
  )

  // Open the DevTools.
  isDev ? mainWindow.webContents.openDevTools() : null; 
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})