'use strict';
const process = require('./process');
const path = require('path');
const fs = require('fs');
const Immutable = require('immutable');

const PACKAGE_ROOT = path.join(process.cwd(), './src');

const isDir = function (dir) {
    try {
        fs.lstatSync(dir).isDirectory();
        return true;
    } catch (e) {
        return false;
    }
};

/**
 *
 * @returns {Immutable.List<PackageRoot>}
 */
const getPackages = function () {
    return Immutable.fromJS(fs.readdirSync(PACKAGE_ROOT))
      .filter((dir) => isDir(path.join(PACKAGE_ROOT, dir, '.git')))
      .map((dir) => new PackageRoot(path.join(PACKAGE_ROOT, dir)));
};

class PackageRoot {
    constructor(absolutePath) {
        this.path = absolutePath;
        this.basename = path.basename(this.path);
    }
}

module.exports = {getPackages: getPackages};
exports.PackageList = PackageRoot;
