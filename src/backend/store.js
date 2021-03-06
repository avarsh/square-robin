const electron = require('electron')
const path = require('path')
const fs = require('fs')

class Store {
    constructor(options) {
        const userDataPath = (electron.app || electron.remote.app).getPath('userData');
        this.path = path.join(userDataPath, options.configName + '.json');
        try {
            this.data = JSON.parse(fs.readFileSync(this.path));
        } catch {
            // File doesn't exist yet.
            this.data = options.defaults;
        }
    }

    get(key) {
        return this.data[key];
    }

    set(key, val) {
        this.data[key] = val;
        fs.writeFileSync(this.path, JSON.stringify(this.data));
    }
}

module.exports = Store;