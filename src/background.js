// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from "path";
import url from "url";
import { app, Menu } from "electron";
import { devMenuTemplate } from "./menu/dev_menu_template";
import { editMenuTemplate } from "./menu/edit_menu_template";
import createWindow from "./helpers/window";
// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from "env";


let tray = null
let quitting = false
const args = require('./args')
const squirrel = require('./squirrel')

const cmd = args.parseArguments(app, process.argv.slice(1)).squirrelCommand
if (process.platform === 'win32' && squirrel.handleCommand(app, cmd)) {
  return
}

const createTray = () => {
  const variant = (process.platform === 'darwin' ? 'Black' : 'White')
  const iconPath = path.resolve(__dirname, `../resources/Icon${variant}Template.png`)

  tray = new Tray(iconPath)

  const trayMenu = Menu.buildFromTemplate([
    {
      label: 'Preferences...',
      click: () => {
        win.show()
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      click: () => {
        app.quit()
      }
    }
  ])
  tray.setContextMenu(trayMenu)
}

const setApplicationMenu = () => {
  const menus = [editMenuTemplate];
  if (env.name !== "production") {
    menus.push(devMenuTemplate);
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== "production") {
  const userDataPath = app.getPath("userData");
  app.setPath("userData", `${userDataPath} (${env.name})`);
}

app.on("ready", () => {
  setApplicationMenu();
  const iconPath = path.resolve(__dirname, '../resources/Icon.png')
  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    show: false,
    icon: iconPath
  });
  mainWindow.on('close', (evt) => {
    if (quitting) {
      return
    }
    evt.preventDefault()
    mainWindow.hide()
  });

  mainWindow.on('closed', () => {
    tray = null
    mainWindow = null
  })

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "../src/components/login/login.html"),//"app.html"
      protocol: "file:",
      slashes: true
    })
  );
  createTray();
  // if (env.name === "development") {
  //   mainWindow.openDevTools();
  // }
});
app.on('before-quit', () => {
  quitting = true
})
app.on("window-all-closed", () => {
  app.quit();
});
