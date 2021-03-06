// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from "path";
import url from "url";
import { app, Menu, Tray } from "electron";
import { devMenuTemplate } from "./menu/dev_menu_template";
import { editMenuTemplate } from "./menu/edit_menu_template";
import createWindow from "./helpers/window";
// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from "env";
let appIcon = null;
//const appIcon = new Tray(path.join(__dirname, 'assets', 'images/appicon.png'));//'/app/assets/images/appicon.png'
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

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "../src/components/login/login.html"),//"app.html"
      protocol: "file:",
      slashes: true
    })
  );

  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App', click: function () {
        mainWindow.show();
      }
    },
    {
      label: 'Quit', click: function () {
        mainWindow.destroy();
        app.quit();
      }
    }
  ]);
  appIcon = new Tray(path.join(__dirname, 'assets', 'images/appicon.png'));
  appIcon.setToolTip('Electron.js App');
  appIcon.setContextMenu(contextMenu);
  //show window on tray icon click etc....

  mainWindow.on('close', function (event) {
    debugger;
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('restore', () => {
    mainWindow.setSkipTaskbar(false)
  });

  mainWindow.on('minimize', () => {
    mainWindow.setSkipTaskbar(true)
  });

  // if (env.name === "development") {
  //   mainWindow.openDevTools();
  // }
});

app.on("window-all-closed", () => {
  app.quit();
});
