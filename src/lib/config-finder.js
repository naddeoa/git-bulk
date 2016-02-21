'use strict';
const Config = require('./config');
const path = require('path');

const CONFIG_PATH = './.gitbulkconfig';
const PACKAGE_ROOT = path.join(process.cwd(), './src');
const defaultConfig = new Config(PACKAGE_ROOT, []);

/**
 * Test if a file exists
 * @param file The file path to test
 * @returns {boolean} true if the file exists.
 */
const isFile = file => {
    try {
        fs.lstatSync(file).isFile();
        return true;
    } catch (e) {
        return false;
    }
};

class ConfigFinder {

    /**
     * Get the config that should be used for all of the operations during
     * the current execution. The config is used to determine which git
     * repositories to run commands against.
     * @returns {Config}
     */
    static getConfig() {
        if (isFile(CONFIG_PATH)) {
            return Config.fromJSONFile(CONFIG_PATH);
        }
        return defaultConfig;
    }
}

module.exports = ConfigFinder;
