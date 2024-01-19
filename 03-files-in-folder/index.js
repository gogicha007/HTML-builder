const fs = require('fs');
const path = require('path');

const secretDir = path.join(__dirname, 'secret-folder');

const fileStat = async (file) => {
  const name = path.parse(file).name;
  const ext = path.parse(file).ext.substring(1);
  fs.stat(path.join(secretDir, file), (error, stats) => {
    if (error) console.log(`Something went wrong with error code: ${error}`);
    else {
      if (stats.isFile()) {
        console.log(`${name} - ${ext} - ${stats.size / 1000}kb`);
      }
    }
  });
};

fs.promises
  .readdir(secretDir)
  .then(async (files) => {
    const arr = [];
    for (const file of files) {
      fileStat(file);
    }
  })
  .catch((err) => {
    console.log(`Something went wrong with error code: ${err}`);
  });
