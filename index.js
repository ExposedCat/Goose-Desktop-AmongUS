process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

const {
    app,
    BrowserWindow,
    screen
} = require('electron')
const { moveMouse } = require('robotjs')
let win

function App() {
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

    window.setIgnoreMouseEvents(true, {
        forward: true
    })
    window.setAlwaysOnTop(true)
    window.loadURL(`file://${__dirname}/index.html`)
    win = window
}

app.on('ready', () => {
    const display = screen.getPrimaryDisplay()
    const {
        width,
        height
    } = display.size
    App()
    exports.moveMouse = moveMouse
    exports.app = win
    exports.width = width
    exports.height = height
    exports.scaleFactor = display.scaleFactor
    exports.getCursorScreenPoint = screen.getCursorScreenPoint
})