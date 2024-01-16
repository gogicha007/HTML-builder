const { stdin, stdout, exit } = process;

const flag = process.argv[2];

const allowedFlags = ['-d', '-f'];
if (!allowedFlags.includes(flag)) {
  stdout.write('Please ender -d or -f flags');
  exit();
}

if ((flag === '-d')) {
  stdout.write(__dirname);
  exit();
}
if ((flag === '-f')) {
  stdout.write(__filename);
  exit();
}
