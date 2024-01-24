const fs = require('node:fs');
const {
  readdir,
  mkdir,
  readFile,
  writeFile,
  rm,
} = require('node:fs/promises');
const path = require('path');

const distFolder = path.join(__dirname, 'project-dist');
const assetsFolder = path.join(distFolder, 'assets');
const compFolder = path.join(__dirname, 'components');

/* Make project-dist and assets */
makeFolders([distFolder, assetsFolder]);
async function makeFolders() {
  await rm(distFolder, { recursive: true, force: true });
  await mkdir(distFolder, { recursive: true });
  await mkdir(assetsFolder, { recursive: true });
  copyFolder(path.join(__dirname, 'assets'), assetsFolder);
  mergeStyles();
  makeIndex();
}
/* helper for copying folders */
const copyFolder = async (src, dest) => {
  const content = await readdir(src, { withFileTypes: true });

  const filesArr = content.filter((item) => item.isFile());
  const foldersArr = content.filter((item) => item.isDirectory());

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
};

/* merge styles and write to destination */
async function mergeStyles() {
  const styleFiles = await readdir(path.join(__dirname, 'styles'), {
    withFileTypes: true,
  });
  const styleNames = styleFiles.reduce((acc, file) => {
    if (file.isFile() && path.parse(file.name).ext === '.css')
      acc.push(file.name);
    return acc;
  }, []);
  // return array of data from each file
  const arr = [];
  styleNames.forEach(async (fileName) => {
    arr.push(await readFile(path.join(__dirname, 'styles', fileName)));
    await writeFile(path.join(distFolder, 'style.css'), arr.join('\n'));
  });
}
/* make index.html file */
async function makeIndex() {
  const compFiles = await readdir(compFolder);
  let srcHtml = (
    await readFile(path.join(__dirname, 'template.html'))
  ).toString();
  const compObj = {};
  const obj = await Promise.all(
    compFiles.map(async (file) => {
      compObj[path.parse(file).name] = (
        await readFile(path.join(__dirname, 'components', file))
      ).toString();
      return compObj;
    }),
  );
  for (const key in obj[0]) {
    srcHtml = srcHtml.replace(`{{${key}}}`, obj[0][key].trim());
  }
  await writeFile(path.join(distFolder, 'index.html'), srcHtml);
}