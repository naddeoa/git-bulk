'use strict';
const Config = require('./config');
const path = require('path');
const isFile = require('./is-file');
const isDir = require('./is-dir');

const CONFIG_PATH = path.join(process.cwd(), './.gitbulkconfig');
const PACKAGE_ROOT = path.join(process.cwd(), './src');
const defaultConfig = new Config(PACKAGE_ROOT, []);

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

        if(isDir(PACKAGE_ROOT)){
            return defaultConfig;
        }

        throw new Error(`No config found at ${CONFIG_PATH}, and no package root found at ${PACKAGE_ROOT}`);
    }
}

module.exports = ConfigFinder;
