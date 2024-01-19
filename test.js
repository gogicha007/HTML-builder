const fs = require('fs');
const path = require('path');

const secretDir = path.join(__dirname, 'secret-folder');

const fileStat = async (file) => {
  fs.stat(path.join(secretDir, file), (error, stats) => {
    if (error) console.log(`Something went wrong with error code: ${error}`);
    else {
      return stats;
    }
  });
};

fs.readdir(secretDir, (err, files) => {
  if (err) console.log(err);
  else {
    console.log('\nCurrent directory filenames:');
    for await (const file of files) {
      const fileObj = await fileStat(file);
      console.log(fileObj)
    }
  }
});

// if (fileObj.isFile()) {
//   console.log(
//     `${path.parse(file).name} - ${path.parse(file).ext.substring(1)} - ${
//       fileObj.size / 1000
//     }kb`,
//   );
// }