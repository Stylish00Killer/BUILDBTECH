import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { setupDatabase } from '../renderer/services/db.service';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  console.log('Creating main window...');

  try {
    mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      }
    });

    console.log('Loading application...');
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Loading from dev server');
      mainWindow.loadURL('http://localhost:5000');
      mainWindow.webContents.openDevTools();
    } else {
      console.log('Production mode: Loading from static files');
      mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    }

    mainWindow.on('closed', () => {
      console.log('Main window closed');
      mainWindow = null;
    });
  } catch (error) {
    console.error('Error creating window:', error);
    throw error;
  }
}

// Initialize the application
app.whenReady().then(async () => {
  console.log('Electron app is ready');

  try {
    console.log('Setting up database...');
    await setupDatabase();

    console.log('Creating main window...');
    createWindow();

    app.on('activate', () => {
      console.log('App activated');
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  } catch (error) {
    console.error('Failed to initialize application:', error);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  console.log('All windows closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers
ipcMain.handle('get-app-path', () => {
  const userDataPath = app.getPath('userData');
  console.log('Requested user data path:', userDataPath);
  return userDataPath;
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
});