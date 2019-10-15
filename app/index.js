'use strict';

import {app, Menu, Tray} from "electron";
import path from "path";

import {popMenu, subMenu, menuRedraw} from "../components/popmenu";

const Store = require('electron-store');
const store = new Store();
//let i18n = new (require('../i18n/i18n'));

if (typeof store.get('lang') == 'undefined') {
    store.set('lang', 'en');
}

app.dock.hide();

let appIcon = null;

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('ready', async () => {
    appIcon = new Tray(path.join(__dirname, '../assets/trayIcon.png'));

    await menuRedraw();

    const contextMenu = Menu.buildFromTemplate(popMenu);
    appIcon.setToolTip('Docoman v' + app.getVersion());
    appIcon.setContextMenu(contextMenu);

});


