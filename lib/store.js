var fs = require('fs');

var dbPath = './db.json';

var Store = function() {

  var self = this;

  self.get = function() {
    var list = fs.readdirSync(process.env.LOCAL_DIRECTORY);


    var db = JSON.parse(fs.readFileSync(dbPath));

    // create database if empty
    if (db.length === 0) {
      if (list.length > 0) {
        var store = [];
        list.forEach(function(file) {
          store.push(file);
        });

        fs.writeFileSync(dbPath, JSON.stringify(store), 'utf8');
      }
      // reload database
      db = JSON.parse(fs.readFileSync(dbPath));
    }

    var selectedFile = db[Math.floor(Math.random()*db.length)];

    var index = db.indexOf(selectedFile);
    db.splice(index, 1);
    fs.writeFileSync(dbPath, JSON.stringify(db), 'utf8');

    var play = 'omxplayer ' + process.env.LOCAL_DIRECTORY + selectedFile;

    var child = exec(play, function(err, stdout, stderr) {
        if (err) throw err;
    });

    child.on('close', function(code) {
        self.get();
    });

  };
};

module.exports = new Store();