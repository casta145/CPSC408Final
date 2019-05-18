var fs = require('fs');
var path = require('path');

function createdir() {
  fs.stat(path.join(require('os').homedir(), 'Desktop/Exports'), function(e) {
    if (!e) {
      // console.log("Directory already exists");
    } else {
      fs.mkdir(path.join(require('os').homedir(), 'Desktop/Exports'), callback);
    }
  })
  // console.log("directory created");
}

//grabs callback to remove error
function callback(){
  //console.log();
}

module.exports = createdir();
