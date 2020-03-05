// import "./stylesheets/main.css";
// import "./stylesheets/all.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "./stylesheets/style.css";
import "./stylesheets/responsive.css";

// Small helpers you might want to keep
import "./helpers/context_menu.js";
import "./helpers/external_links.js";

// ----------------------------------------------------------------------------
// Everything below is just to show you how it works. You can delete all of it.
// ----------------------------------------------------------------------------

import { remote } from "electron";
import jetpack from "fs-jetpack";
import { greet } from "./hello_world/hello_world";
import env from "env";
import { header } from "./header/header";
import { getDatasource } from "../app/server/controllers/datasource_controller";

const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath());

// Holy crap! This is browser window with HTML and stuff, but I can read
// files from disk like it's node.js! Welcome to Electron world :)
const manifest = appDir.read("package.json", "json");

const osMap = {
    win32: "Windows",
    darwin: "macOS",
    linux: "Linux"
};

getDatasource().then(data => {
    console.log(data);
}).catch(err => {
    console.error(err);
});
document.querySelector('#header').innerHTML = header();