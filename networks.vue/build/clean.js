'use strict';
require('./check-versions')();

process.env.NODE_ENV = 'production';

const config = require('../config');
const del = require('del');

del([config.build.targetRoot]).then(paths => {
    console.log('Deleted files and folders:\n', paths.join('\n'));
});
