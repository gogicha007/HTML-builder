const readLine = require('node:readline');
const { stdin: input, stdout: output, exit } = require('node:process');
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

const rl = readLine.createInterface({ input, output });
rl.setPrompt('Good day! Please enter the text:\n');
rl.prompt();
rl.on('line', (data) => {
  if (data === 'exit') {
    farewell();
  } else {
    writeToFile(`${data}\n`);
  }
});

rl.on('SIGINT', () => {
  farewell();
})

function farewell() {
  console.log('\nGood bye...');
  exit();
}