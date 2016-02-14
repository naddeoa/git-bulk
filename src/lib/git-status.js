'use strict';
require('colors');

class GitStatus {

    constructor(data) {
        this.data = data;
    }

    anyChanged() {
        return this.data.deleted.length > 0 ||
          this.data.modified.length > 0 ||
          this.data.created.length > 0 ||
          this.data.conflicted.length > 0;
    }

    anyUnpushed() {
        return this.data.ahead > 0;
    }

    hasDiverged() {
        return this.data.behind > 0 && this.data.ahead > 0;
    }

    colorName(name) {
        if (this.hasDiverged()) {
            return name.red;
        } else if (this.anyChanged()) {
            return name.blue;
        } else if (this.anyUnpushed()) {
            return name.green;
        }
        return name;
    }

    toString(name) {
        const branches = [this.data.current, this.data.tracking].join(' ➜ ');
        const ahead = this.data.ahead ? ` ▲ ${this.data.ahead}`: '';
        const behind = this.data.behind ? ` ▼ ${this.data.behind}`.red: '';
        return `${this.colorName(name)} [${branches}${ahead}${behind}]`;
    }
}

module.exports = GitStatus;
