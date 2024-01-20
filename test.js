const readLine = require('node:readline')
const { stdin, stdout, stderr } = require('node:process');
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'text.txt');

fs.writeFile(file, '', (err) => {
  if (err) console.log('Error occured when writing to file');
});

const writeToFile = (data) => {
  fs.appendFile(file, data, (err) => {
    if (err) {
      console.log('Error occured when writing to file');
    }
  });
};

stdout.write('Please enter the data:\n');
stdin.setEncoding('utf-8');
stdin.on('data', (data) => {
  const inData = data;
  writeToFile(data);
});

process.on('SIGINT', () => {
  stderr.write(`Good bye...`);
  process.exit();
});