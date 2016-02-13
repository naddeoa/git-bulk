const process = 'process';

/*
    This file exists because of the nexe compiler. Currently, it doesn't support
    native modules and it requires that this workaround is used to omit them from
    bundling during compilation. See the caveats section for the nexe repo.

    https://github.com/jaredallard/nexe
 */
module.exports = require(process);