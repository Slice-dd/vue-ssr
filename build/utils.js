const glob = require('glob');


exports.entryClient = function(arrayPath) {
    const entry = {};
    
    const arr = glob.sync('./src/module/**/entry-client.js');
    console.log(arr);
    
}   