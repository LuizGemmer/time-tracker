const { app, BrowserWindow, ipcMain } = require('electron')
const url =   require("url");
const path =  require('path')
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

const { Store } =     require("./Store");

const { IS_DEV } =    process.env;
const { channels } =  require("../../src/shared/channels.js")

let isTracking =    false;
let currentTrack =  {}
let store =         new Store();

function createWindow () {
  const mainWindow = new BrowserWindow({
    width:          800,
    height:         600,
    webPreferences: {
      preload:          path.join(__dirname, 'preload.js'),
      nodeIntegration:  false,
    }
  })

  // load the app's HTML.
  mainWindow.loadURL(
    process.env.ELECTRON_START_URL || url.format({
      pathname:   path.join(__dirname, '../index.html'),
      protocol:   'file:',
      slashes:    true,
    })
  )

  // Open the DevTools.
  IS_DEV ? mainWindow.webContents.openDevTools() : null; 
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // if (IS_DEV) {
  //   installExtension( REACT_DEVELOPER_TOOLS )
  //     .then(( name ) => console.log( `Added Extension:  ${ name }` ) )
  //     .catch(( err ) => console.log( 'An error occurred: ', err ) )
  // }

  app.on('activate', function () {
    if ( BrowserWindow.getAllWindows().length === 0 ) createWindow();
  });
});

app.on('window-all-closed', function () {
  if ( process.platform !== 'darwin' ) { 
    store.saveSettings();
    store.saveTracks();

    app.quit();
  } 
})

ipcMain.on(channels.TRACKER_START, track => {
  isTracking = true;
  currentTrack = track;
} );

ipcMain.on( channels.TRACKER_STOP, ( e, track ) => {
  isTracking = false;
  store.addTrack( track );
} );

ipcMain.on( channels.ADD_PROJECT, ( e, project ) => store.addProject( project ) );

ipcMain.on( channels.APP_INIT, e => {
  e.returnValue = store.getProjects(); 
} );