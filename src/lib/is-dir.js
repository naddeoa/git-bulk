const fs = require('fs');

/**
 * Test if a dir exists
 * @param dir
 * @returns {boolean}
 */
const isDir = function (dir) {
    try {
        fs.lstatSync(dir).isDirectory();
        return true;
    } catch (e) {
        return false;
    }
};

module.exports = isDir;
