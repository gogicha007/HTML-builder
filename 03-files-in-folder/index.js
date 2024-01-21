const fs = require('fs');
const path = require('path');

const secretDir = path.join(__dirname, 'secret-folder');

const printName = (file) => {
  const name = path.parse(file).name;
  const ext = path.parse(file).ext.substring(1);
  fs.stat(path.join(secretDir, file), (error, stats) => {
    if (error) console.log(`Cannot get stats for file error code: ${error}`);
    else {
      console.log(`${name} - ${ext} - ${stats.size / 1000}kb`);
    }
  });
};

fs.promises
  .readdir(secretDir, { withFileTypes: true })
  .then((files) => {
    for (const file of files) {
      if (file.isFile()) printName(file.name);
    }
  })
  .catch((err) => {
    console.log(`Something went wrong, error code: ${err}`);
  });
