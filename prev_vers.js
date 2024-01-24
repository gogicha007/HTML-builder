const fs = require('node:fs');
const path = require('path');

const distFolder = path.join(__dirname, 'project-dist');
const assetsFolder = path.join(distFolder, 'assets');
const stylesFolder = path.join(distFolder, 'styles');
const compFolder = path.join(__dirname, 'components');
const getPath = (dir, file) => path.join(dir, file);

/* Make project-dist and assets */
[distFolder, assetsFolder].forEach((item) => {
  fs.mkdir(item, { recursive: true }, (err) => {
    if (err) throw err;
  });
});
/* helper for copying folders */
const copyFolder = (src, dest) => {
  fs.promises.readdir(src, { withFileTypes: true }).then(async (items) => {
    const filesArr = items.filter((item) => item.isFile());
    const foldersArr = items.filter((item) => item.isDirectory());

    foldersArr.forEach((item) => {
      fs.mkdir(path.join(dest, item.name), { recursive: true }, (err) => {
        if (err) throw err;
      });
    });

    filesArr.forEach((item) => {
      fs.copyFile(
        path.join(src, item.name),
        path.join(dest, item.name),
        (err) => {
          if (err) throw err;
        },
      );
    });

    for (const item of foldersArr) {
      copyFolder(path.join(src, item.name), path.join(dest, item.name));
    }
  });
};

/* copy assets folder */
copyFolder(path.join(__dirname, 'assets'), assetsFolder);

/* helper for merging files, returns file content */
const getFileData = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
};
/* merge styles and write to destination */
fs.promises
  .readdir(path.join(__dirname, 'styles'), { withFileTypes: true })
  .then((files) => {
    // return css file names array
    return files.reduce((acc, file) => {
      if (file.isFile() && path.parse(file.name).ext === '.css')
        acc.push(file.name);
      return acc;
    }, []);
  })
  .then(async (filesArr) => {
    // return array of data from each file
    const arr = [];
    for (const file of filesArr) {
      arr.push(await getFileData(path.join(__dirname, 'styles', file)));
    }
    return arr;
  })
  .then((arr) => {
    // merge files to destination file
    fs.writeFile(path.join(distFolder, 'style.css'), '', (err) => {
      if (err) console.log('Error occured when writing to file');
    });

    arr.forEach((data) => {
      fs.appendFile(path.join(distFolder, 'style.css'), data, (err) => {
        if (err) throw err;
      });
    });
  });
/* make index.html file */
fs.promises
  .readdir(compFolder, { withFileTypes: true }) // return components folder content
  .then((items) => {
    return items.reduce((acc, item) => {
      if (item.isFile()) acc.push(item.name);
      return acc;
    }, []);
  })
  .then(async (files) => {
    // return array of file content
    const compObj = {};
    for (const file of files) {
      compObj[path.parse(file).name] = await getFileData(
        path.join(__dirname, 'components', file),
      );
    }
    return compObj;
  })
  .then((obj) => {
    const srcHtml = fs.createReadStream(
      path.join(__dirname, 'template.html'),
      'utf-8',
    );
    fs.writeFile(path.join(distFolder, 'index.html'), '', (err) => {
      if (err) throw err;
    });
    const destHtml = fs.createWriteStream(path.join(distFolder, 'index.html'));
    let str = '';
    srcHtml.on('data', (data) => {
      str = data.toString();
      for (const key in obj) {
        str = str.replace(`{{${key}}}`, obj[key].trim());
      }
      destHtml.write(str);
    });
  });
