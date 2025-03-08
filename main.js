const { app, BrowserWindow } = require('electron')

const createWindow = () => {
    const win = new BrowserWindow({
      width: 1000,
      height: 800,
      webPreferences: {
        preload: ('preload.js') //path.join(__dirname, 'preload.js')
      }  
    })
    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
      })
    
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit() //force quit if not on mac
  })