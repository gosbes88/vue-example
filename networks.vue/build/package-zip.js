'use strict';
require('./check-versions')();

process.env.NODE_ENV = 'production';

const zip = require('bestzip');
const config = require('../config');

zip(config.build.packageFile, [config.build.assetsRoot + '/*'], function(err) {
    if (err) {
        console.error(err.stack);
        process.exit(1);
    } else {
        console.log('all done!');
    }
});
