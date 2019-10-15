const path = require("path");
const electron = require('electron');
const fs = require('fs');
const Store = require('electron-store');
const store = new Store();

let loadedLanguage;
let app = electron.app ? electron.app : electron.remote.app;

module.exports = i18n;

function i18n() {
    let lang = store.get('lang');
    if (fs.existsSync(path.join(__dirname, 'translations/' + lang + '.json'))) {
        loadedLanguage = JSON.parse(fs.readFileSync(path.join(__dirname, 'translations/' + lang + '.json'), 'utf8'))
    } else {
        loadedLanguage = JSON.parse(fs.readFileSync(path.join(__dirname, 'translations/' + 'en.json'), 'utf8'))
    }
}

i18n.prototype.__ = function (phrase) {
    let translation = loadedLanguage[phrase];
    if (translation === undefined) {
        translation = phrase
    }
    return translation
};