const glob = require('glob');


const entryClient = function(arrayPath) {
    const entry = {};
    const arr = glob.sync('./src/modules/**/entry-client.js');
    console.log(arr);
    
}   

entryClient()