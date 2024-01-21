const fs = require('node:fs');
const path = require('path');

const srcFolder = path.join(__dirname, 'files');
const destFolder = path.join(__dirname, 'files-copy');
const srcFile = (name) => {
  return path.join(srcFolder, name);
};
const destFile = (name) => {
  return path.join(destFolder, name);
};

fs.mkdir(destFolder, { recursive: true }, (err) => {
  if (err) {
    return handleError(err);
  }
  fs.promises // remove contend of dest folder
    .readdir(destFolder)
    .then((files) => {
      for (const file of files) {
        fs.unlink(path.join(destFolder, file), (err) => {
          if (err) throw err;
        });
      }
    });
  fs.promises
    .readdir(srcFolder, { withFileTypes: true })
    .then((files) => {
      for (const file of files) {
        if (file.isFile()) {
          fs.copyFile(
            path.join(srcFolder, file.name),
            path.join(destFolder, file.name),
            (err) => {
              if (err) handleError(err);
            },
          );
        }
      }
    })
    .catch((err) => handleError(err));
});

function handleError(err) {
  console.log(`Something went wrong with error code: ${err}`);
}
