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

const getPackages = function () {
    return Immutable.fromJS(fs.readdirSync(PACKAGE_ROOT))
      .filter((dir) => isDir(path.join(PACKAGE_ROOT, dir, '.git')))
      .map((dir) => path.join(PACKAGE_ROOT, dir));

};

module.exports = {getPackages: getPackages};
