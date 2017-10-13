module.exports = (gulp, args) => {
    'use strict';

    var runSequence = require('run-sequence');

    //Experimental version, the use will change in a large number of files and changes may be difficult to withdraw

    // Barrels configuration:
    //  createBarrels - Project names for create barrles
    //  include - Projects for replace barrels in imports
    //  exclude - Projects exclude from operation    

    gulp.task('buildBarrels', (callback) => {
        runSequence('createBarrels', 'setBarrels', 'changeImportsToBarrels', callback);
    });
};
