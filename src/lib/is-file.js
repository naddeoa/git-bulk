const fs = require('fs');

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

module.exports = isFile;
