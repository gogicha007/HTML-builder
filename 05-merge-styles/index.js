const fs = require('node:fs');
const { resolve } = require('node:path');
const path = require('path');

const srcFolder = path.join(__dirname, 'styles');
const destFolder = path.join(__dirname, 'project-dist');
const srcFile = (name) => path.join(srcFolder, name);
const destFile = path.join(destFolder, 'bundle.css');

const getFileData = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(srcFile(file), 'utf-8', (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
};

fs.promises
  .readdir(srcFolder, { withFileTypes: true })
  .then((files) => {
    return files.reduce((acc, file) => {
      if (file.isFile() && path.parse(file.name).ext === '.css')
        acc.push(file.name);
      return acc;
    }, []);
  })
  .then(async (filesArr) => {
    const arr = [];
    for (const file of filesArr) {
      arr.push(await getFileData(file));
    }
    return arr;
  })
  .then((arr) => {
    fs.writeFile(destFile, '', (err) => {
      if (err) console.log('Error occured when writing to file');
    });
    
    arr.forEach((data) => {
      fs.appendFile(destFile, data, (err) => {
        if(err) throw err;
      })
    })
  });
