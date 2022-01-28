process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

const { moveMouse } = require('robotjs')
const { app, BrowserWindow, screen } = require('electron')

function createWindow() {
    const window = new BrowserWindow({
        show: false,
        transparent: true,
        frame: false,
        skipTaskbar: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    })

    window.maximize()
    window.show()

    window.setIgnoreMouseEvents(true, { forward: true })
    window.setAlwaysOnTop(true)
    window.loadURL(`file://${__dirname}/app-view.html`)

    return window
}

app.on('ready', () => {
    const { size, scaleFactor } = screen.getPrimaryDisplay()

    exports.moveMouse = moveMouse
    exports.window = createWindow()
    exports.width = size.width
    exports.height = size.height
    exports.scaleFactor = scaleFactor
    exports.getCursorScreenPoint = screen.getCursorScreenPoint
})
