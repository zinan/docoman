const Store = require('electron-store');
const store = new Store();
const fs = require('fs');
const path = require('path');
const i18n = new (require('../i18n/i18n'));

document.title = i18n.__('preferences');
document.getElementById("lang-language").innerText = i18n.__('language');

let select = document.getElementById("language");
let lang = store.get('lang');

fs.readdir(path.join(__dirname, '../i18n/translations'), (err, files) => {
    files.forEach(file => {
        let fileName = file.split('.').slice(0, -1).join('.');
        let option = document.createElement("option");
        option.text = fileName;
        option.value = fileName;
        option.selected = lang === fileName;
        select.appendChild(option);
    });
});

select.addEventListener('change', function(e){
    store.set('lang', select.value);
});
