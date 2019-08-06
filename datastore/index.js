const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err, data) => {
      if (err) {
        throw err;
      } else {
        callback(null, {id, text});
      }
      // console.log(`${exports.dataDir}/${id}.txt`)
    })
  });
};

exports.readAll = (callback) => {
  // read files from dataDir
  fs.readdir(`${exports.dataDir}`, (err, files) => {
    var data = _.map(files, (id, text)=> {
      let fileNameId = id.slice(0,-4);
      return {
        id: fileNameId,
        text: fileNameId
      }
    });
    callback(null, data);
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8', (err, data) => {
    if (!data) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id: id, text: data});
    }
  })
};

exports.update = (id, text, callback) => {
  // var item = items[id]; //setting for example item to equal 00001
  // plan to remove the reference to the items variable and replace it
// how to find that one
// change it by overwriting old text
// and put the new desired text in the file
// READFILE
  fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8', (err, data) => {
    if (!data) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err, data) => {
        if (err) {
          throw err;
        } else {
          callback(null, {id, text});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8', (err, data) => {
    if (!data) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
        if (err) {
          console.log(err);
          return;
        } else {
          console.log(`${exports.dataDir}/${id}.txt was deleted`);
          callback();
        }
      })
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
