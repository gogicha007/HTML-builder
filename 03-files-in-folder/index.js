const fs = require('fs');
const path = require('path');

const secretDir = path.join(__dirname, 'secret-folder');

fs.readdir(secretDir, (err, files) => {
  if (err) console.log(err);
  else {
    console.log('\nCurrent directory filenames:');
    files.forEach((file) => {
      let fileObj = fs.statSync(path.join(secretDir, file));
      if (fileObj.isFile()) {
        console.log(
          `${path.parse(file).name} - ${path
            .parse(file)
            .ext.substring(1)} - ${fileObj.size / 1000}kb`,
        );
      }
    });
  }
});
