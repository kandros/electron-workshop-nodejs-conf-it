const electron = require('electron');
const path = require('path');
const fs = require('fs');
const {app, BrowserWindow, dialog} = electron;

let mainWindow = null;

app.on('ready', () => {
    console.log('The application is ready!');

    mainWindow = new BrowserWindow({
        width: 1000,
        height: 500,
        x: 0,
        y: 0,
        alwaysOnTop: true,
        frame: true
    });

    mainWindow.webContents.openDevTools();

    const filePath = path.join(__dirname, 'index.html');
    mainWindow.loadURL(`file://${filePath}`);

    // mainWindow.webContents.on('did-finish-load', () => {
    // });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

exports.openFile = function openFile() {
    dialog.showOpenDialog(mainWindow, {
        properties: ['openFile', 'multiSelections'],
        filters: [
            {name: 'Markdown Files', extensions: ['md', 'markdown', 'txt']}
        ],
        buttonLabel: 'Overo?'
    }, (files) => {

        if (!files) return;

        const [file] = files;
        const content = fs.readFileSync(file).toString();
        mainWindow.webContents.send('file-opened', file, content);
    });
}

exports.saveFile = function saveFile(content) {
    dialog.showSaveDialog(mainWindow, {
        title: 'Save HTML Output',
        defaultPath: app.getPath('documents'),
        filters: [
            {name: 'HTML Files', extensions: ['html']}
        ]
    }, (fileName) => {
        if (!fileName) return;

        fs.writeFileSync(fileName, content);
    });
}