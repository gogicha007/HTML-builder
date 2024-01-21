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
  fs.promises
    .readdir(srcFolder, { withFileTypes: true })
    .then(async (files) => {
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
