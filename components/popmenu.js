import path from "path";
import {app, BrowserWindow} from "electron";
import {containerList, version} from "../app/docker";
//import {containerCommand, removeExited, containerList, version} from "./docker";
let i18n = new(require('../i18n/i18n'));
let i = 4;

const aboutWindow = require("about-window").default;

export let subMenu = (containerId) => {
    return [
        {
            label: i18n.__('startStop'),
            click: () => {
                console.log(containerId + ' Start/Stop Clicked');
            }
        },
        {
            label: i18n.__('restart'),
            click: () => {
                console.log('Restart Clicked');
            }
        },
        {
            label: i18n.__('openTerminal'),
            click: () => {
                console.log('Open Terminal Clicked');
            }
        }
    ]
};

export let popMenu = [
    {
        label: i18n.__('dockerEngineisRunning'),
        type: 'normal',
        icon: path.join(__dirname, '../assets/circlecheck.png'),
        id : 1
    },
    {type: 'separator', id: 2},
    {
        label: i18n.__('about'), type: 'normal', click: () =>
            aboutWindow({
                icon_path: path.join(__dirname, '../assets/docker_logo.png'),
                copyright: 'Copyright (c) 2019, Sinan Turgut',
                package_json_dir: path.join(__dirname, '..'),
                show_close_button: i18n.__('close'),
                bug_report_url: 'https://github.com/zinan/docoman/issues',
                homepage: 'https://github.com/zinan/docoman',
                description: 'Docker Container Manager',
                license: 'GPL-3.0',
                use_version_info: false,
                bug_link_text: i18n.__('reportIssue')
            }), id: 3
    },
    {type: 'separator', id: 4},
    {label: i18n.__('preferences'), type: 'normal', accelerator: 'CommandOrControl+,', click() {
            const htmlPath = path.join('file://', __dirname, '../screens/preferences.html');
            let prefWindow = new BrowserWindow({
                y: 200, x:200, width: 500, height: 300, resizable: false,
                webPreferences: {
                    nodeIntegration: true
                }
            });
            prefWindow.loadURL(htmlPath);
            prefWindow.show();
        // let devtools = new BrowserWindow();
        // prefWindow.webContents.setDevToolsWebContents(devtools.webContents);
        // prefWindow.webContents.openDevTools({mode: 'detach'});
            prefWindow.on('close', function () {
                prefWindow = null;
            });
        }, id: 5},
    {label: i18n.__('checkUpdates'), type: 'normal', id: 6},
    {type: 'separator', id: 7},
    {label: i18n.__('restart'), type: 'normal', enabled: false, id: 8},
    {
        label: i18n.__('quit'), type: 'normal', accelerator: 'CommandOrControl+Q', click() {
            app.quit()
        }, id: 9
    }
];

export let menuRedraw = async () => {
    const containers = await containerList();
    for (const container of containers) {
        let containerName = container.name;

        const imageParts = container.image.split("_");
        const nameParts = container.name.split("_");

        if (nameParts.length >= 3) {
            containerName = nameParts.slice(1).join("_");
        } else if (imageParts.length >= 2) {
            containerName = imageParts.slice(1).join("_");
        }

        container.shortName = containerName.replace(/^_+/, "");
        container.statusObject = containerStatus(container.status);

        popMenu.splice(i, 0,
            {
                label: containerName + ' ' + container.statusObject.status,
                type: 'submenu',
                submenu: subMenu(container.id),
                id: container.id,
                icon: container.statusObject.icon
            }
        );
        i++;
    }

    popMenu.splice(i, 0,
        {
            label: i18n.__('removeAllExitedContainers'), type: 'normal', click() {
                Docker.removeExited();
            }
        }
    );
    i++;

    popMenu.splice(i, 0,
        {type: 'separator'}
    );


    popMenu[0] = await dockerStatus();
};

let containerStatus = (state) => {
    let result = {status: 'active', icon: path.join(__dirname, '../assets/active.png')};
    //console.warn('state='+state);
    if (state.indexOf("Up") >= 0) {
        result.status = 'active';
        result.icon = path.join(__dirname, '../assets/active.png');
    }
    if (state.indexOf("Paused") >= 0) {
        result.status = 'paused';
        result.icon = path.join(__dirname, '../assets/paused.png');
    }
    if (state.indexOf("Exited") >= 0) {
        result.status = 'exited';
        result.icon = path.join(__dirname, '../assets/exited.png');
    }
    return result;
};

let dockerStatus = async () => {
    let obj = {
        label: i18n.__('dockerEngineisNotRunning'),
        type: 'normal',
        icon: path.join(__dirname, '../assets/circlex.png')
    };
    let v = await version();
    if (v) {
        obj.label = i18n.__('dockerEngine') + ' v' + v + ' ' + i18n.__('running');
        obj.icon = path.join(__dirname, '../assets/circlecheck.png');
    }
    return obj;
};
