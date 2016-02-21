'use strict';
require('colors');

class GitStatus {

    constructor(data) {
        this.deleted = data.deleted;
        this.modified = data.modified;
        this.created = data.created;
        this.conflicted = data.conflicted;
        this.ahead = data.ahead;
        this.behind = data.behind;
        this.current = data.current;
        this.tracking = data.tracking;
    }

    anyChanged() {
        return this.deleted.length > 0 ||
          this.modified.length > 0 ||
          this.created.length > 0 ||
          this.conflicted.length > 0;
    }

    anyUnpushed() {
        return this.ahead > 0;
    }

    hasDiverged() {
        return this.behind > 0 && this.ahead > 0;
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
        const branches = [this.current, this.tracking].join(' ➜ ');
        const ahead = this.ahead ? ` ▲ ${this.ahead}`: '';
        const behind = this.behind ? ` ▼ ${this.behind}`.red: '';
        return `${this.colorName(name)} [${branches}${ahead}${behind}]`;
    }
}

module.exports = GitStatus;
